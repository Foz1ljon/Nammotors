import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
  ) {}

  getToken(data: any) {
    const payload = {
      id: data._id,
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  async create(createAdminDto: CreateAdminDto, photo: Express.Multer.File) {
    const admin = await this.adminModel.findOne({
      username: createAdminDto.username,
    });
    if (admin)
      throw new BadRequestException("Bu username allaqachon ro'yxatdan o'tgan");

    createAdminDto.password = await bcrypt.hash(createAdminDto.password, 7);

    if (!photo) throw new BadRequestException('Image is requirred!');
    const img = (await this.cloudinaryService.uploadImage(photo)).url;

    const data = await this.adminModel.create({
      image: img,
      ...createAdminDto,
    });

    const token = this.getToken(data);

    return {
      data,
      ...token,
    };
  }

  async login(loginAdminDto: SignInAdminDto) {
    const admin = await this.adminModel.findOne({
      username: loginAdminDto.username,
    });

    if (!admin)
      throw new NotFoundException('Admin topilmadi! yoki Parol no`tog`ri');

    const isMatch = await bcrypt.compare(
      loginAdminDto.password,
      admin.password,
    );

    if (!isMatch)
      throw new NotFoundException('Admin topilmadi! yoki Parol no`tog`ri');
    const token = this.getToken(admin);
    return {
      id: admin._id,
      ...token,
    };
  }

  async search(searchAdminDto: SearchAdminDto): Promise<Admin[]> {
    const { username, firstName, lastName } = searchAdminDto;

    const query: any = {};
    if (username) {
      query.username = { $regex: username, $options: 'i' };
    }
    if (firstName) {
      query.firstName = { $regex: firstName, $options: 'i' };
    }
    if (lastName) {
      query.lastName = { $regex: lastName, $options: 'i' };
    }

    return this.adminModel.find(query).exec();
  }

  async findById(id: string) {
    checkId(id);
    const admin = await this.adminModel
      .findById(id)
      ?.select('-password')
      ?.populate('clients');
    if (!admin) throw new NotFoundException('Admin topilmadi!');

    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    checkId(id);
    const admin = await this.adminModel.findById(id)?.select('-password');
    if (!admin) throw new NotFoundException('Admin topilmadi!');
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
      if (findUsername)
        throw new BadRequestException('Bu username allaqachon mavjud!');
      admin.username = updateAdminDto.username;
    }
    if (updateAdminDto.password) {
      admin.password = updateAdminDto.password;
    }
    await admin.save();

    return this.adminModel
      .findByIdAndUpdate(id, admin, { new: true })
      .select('-password')
      .select('-super');
  }

  async remove(id: string) {
    checkId(id);
    const admin = await this.adminModel.findById(id)?.select('-password');
    if (!admin) throw new NotFoundException('Admin topilmadi!');
    console.log('hello');

    const data = await this.adminModel.findByIdAndDelete(id);

    return { message: 'Muvoffaqiyatli o`chirildi!', ...data };
  }
}
