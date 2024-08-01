import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInAdminDto } from './dto/signin-admin.dto';
import { checkId } from '../common/utils/check-mongodbId';
import { SearchAdminDto } from './dto/search-admin.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
    private clientService: ClientsService,
  ) {}

  // Token yaratish
  getToken(data: any) {
    const payload = { id: data._id, super: data.super };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  // Admin yaratish
  async create(createAdminDto: CreateAdminDto, photo: Express.Multer.File) {
    const existingAdmin = await this.adminModel.findOne({
      username: createAdminDto.username,
    });

    if (existingAdmin) {
      throw new BadRequestException("Bu username allaqachon ro'yxatdan o'tgan");
    }

    createAdminDto.password = await bcrypt.hash(createAdminDto.password, 7);

    if (!photo) {
      throw new BadRequestException('Rasm kiritilishi shart!');
    }

    const img = (await this.cloudinaryService.uploadImage(photo)).url;

    const newAdmin = await this.adminModel.create({
      image: img,
      ...createAdminDto,
    });

    const token = this.getToken(newAdmin);

    return {
      data: newAdmin,
      ...token,
    };
  }

  // Adminni tizimga kirishi
  async login(loginAdminDto: SignInAdminDto) {
    const admin = await this.adminModel.findOne({
      username: loginAdminDto.username,
    });

    if (!admin) {
      throw new NotFoundException("Admin topilmadi yoki parol noto'g'ri");
    }

    const isMatch = await bcrypt.compare(
      loginAdminDto.password,
      admin.password,
    );

    if (!isMatch) {
      throw new NotFoundException("Admin topilmadi yoki parol noto'g'ri");
    }

    const token = this.getToken(admin);

    return {
      id: admin._id,
      ...token,
    };
  }

  // Adminlarni qidirish
  async search(searchAdminDto: SearchAdminDto): Promise<Admin[]> {
    const { query } = searchAdminDto;

    const matchAdminCriteria: any = {};
    if (query) {
      matchAdminCriteria.$or = [
        { username: { $regex: query, $options: 'i' } },
        { fname: { $regex: query, $options: 'i' } },
        { lname: { $regex: query, $options: 'i' } },
      ];
    }

    const pipeline = [
      { $match: matchAdminCriteria },
      {
        $lookup: {
          from: 'clients',
          localField: 'clients',
          foreignField: '_id',
          as: 'clientsInfo',
        },
      },
      {
        $unwind: {
          path: '$clientsInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          image: 1,
          username: 1,
          fname: 1,
          lname: 1,
          'clientsInfo.fname': 1,
          'clientsInfo.phone_number': 1,
          'clientsInfo.firma': 1,
          'clientsInfo.type': 1,
          'clientsInfo.location': 1,
        },
      },
      {
        $group: {
          _id: '$_id',
          image: { $first: '$image' },
          username: { $first: '$username' },
          fname: { $first: '$fname' },
          lname: { $first: '$lname' },
          clientsInfo: { $push: '$clientsInfo' },
        },
      },
    ];

    const admins = await this.adminModel.aggregate(pipeline).exec();

    return admins;
  }

  // Adminni ID bo'yicha topish
  async findById(id: string) {
    checkId(id);
    const admin = await this.adminModel
      .findById(id)
      ?.select('-password')
      ?.populate('clients');

    if (!admin) {
      throw new NotFoundException('Admin topilmadi!');
    }

    return admin;
  }

  // Token orqali adminni olish
  async getme(token: string) {
    const id = await this.clientService.decodeToken(token);
    checkId(id);
    const admin = await this.adminModel.findById(id).populate('clients');

    if (!admin) {
      throw new NotFoundException('Admin topilmadi!');
    }

    return admin;
  }

  // Adminni yangilash
  async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
    photo: Express.Multer.File,
  ) {
    checkId(id);

    const admin = await this.adminModel.findById(id)?.select('-password');

    if (!admin) {
      throw new NotFoundException('Admin topilmadi!');
    }

    if (photo) {
      await this.cloudinaryService.removeImageByUrl(admin.image);
      updateAdminDto.image = (
        await this.cloudinaryService.uploadImage(photo)
      ).url;
      admin.image = updateAdminDto.image;
    }

    if (updateAdminDto.fname) {
      admin.fname = updateAdminDto.fname;
    }
    if (updateAdminDto.lname) {
      admin.lname = updateAdminDto.lname;
    }
    if (updateAdminDto.username) {
      const findUsername = await this.adminModel.findOne({
        username: updateAdminDto.username,
      });
      if (findUsername && findUsername.id !== id) {
        throw new BadRequestException('Bu username allaqachon mavjud!');
      }
      admin.username = updateAdminDto.username;
    }
    if (updateAdminDto.password) {
      admin.password = await bcrypt.hash(updateAdminDto.password, 7);
    }

    await admin.save();

    return this.adminModel
      .findByIdAndUpdate(id, admin, { new: true })
      .select('-password')
      .select('-super');
  }

  // Adminni o'chirish
  async remove(id: string) {
    checkId(id);
    const admin = await this.adminModel.findById(id)?.select('-password');

    if (!admin) {
      throw new NotFoundException('Admin topilmadi!');
    }
    if (admin.super) throw new NotAcceptableException("Ruxsatingiz yo'q");

    const data = await this.adminModel.findByIdAndDelete(id);

    return { message: "Muvoffaqiyatli o'chirildi!", data };
  }
}
