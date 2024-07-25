import { CreateComponentDto } from './dto/create-component.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schemas';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SearchProductDto } from './dto/search-product.dto';
import { Category } from '../category/schemas/category.schemas';
import { checkId } from '../common/utils/check-mongodbId';
import { UpdateComponentDto } from './dto/update-component.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,

    private cloudinaryService: CloudinaryService,
  ) {}
  async create(createProductDto: CreateProductDto, img: Express.Multer.File) {
    if (!img) throw new BadRequestException('Image is requirred!');
    const photo = (await this.cloudinaryService.uploadImage(img)).url;

    checkId(createProductDto.category);
    const findCategory = await this.categoryModel.findById(
      createProductDto.category,
    );
    if (!findCategory) throw new NotFoundException('Kategoriya topilmadi');
    return (
      await this.productModel.create({ img: photo, ...createProductDto })
    ).populate('category');
  }

  // Zapchastlarni yaratish

  async createComponent(
    createComponentDto: CreateComponentDto,
    img: Express.Multer.File,
  ) {
    if (!img) throw new BadRequestException('Image is requirred!');
    const photo = (await this.cloudinaryService.uploadImage(img)).url;
    return this.productModel.create({ img: photo, ...createComponentDto });
  }

  // qidiruv
  async search(searchProductDto: SearchProductDto): Promise<Product[]> {
    const { query } = searchProductDto;
    const queries: any = {};

    if (query) {
      queries.$or = [
        { marka: { $regex: query, $options: 'i' } },
        { kwt: { $regex: query, $options: 'i' } },
        { turnover: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ];
    }

    return this.productModel.find(queries).exec();
  }

  async findOne(id: string) {
    checkId(id);
    const findProd = await this.productModel.findById(id).populate('category');
    if (!findProd) throw new NotFoundException('Mahsulot topilmadi!');
    delete findProd.category.products;

    return findProd;
  }

  async updateComp(
    id: string,
    updateComponentDto: UpdateComponentDto,
    img?: Express.Multer.File,
  ) {
    const findProd = await this.productModel.findById(id);
    if (!findProd) throw new NotFoundException('Mahsulot topilmadi!');
    let photo: any;
    if (img) {
      photo = await this.cloudinaryService.uploadImage(img);
      await this.cloudinaryService.removeImageByUrl(findProd.img);
    }

    const data = await this.productModel.findByIdAndUpdate(
      id,
      {
        img: photo.url,
        ...updateComponentDto,
      },
      { new: true },
    );

    return { message: 'Yangilandi!', data };
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    img?: Express.Multer.File,
  ) {
    checkId(id);
    const findProd = await this.productModel.findById(id).populate('category');
    if (!findProd) throw new NotFoundException('Mahsulot topilmadi!');
    let photo: any;
    if (img) {
      photo = await this.cloudinaryService.uploadImage(img);
      await this.cloudinaryService.removeImageByUrl(findProd.img);
    }
    if (updateProductDto.category) {
      checkId(updateProductDto.category);
      const find = await this.categoryModel.findById(updateProductDto.category);
      if (!find) throw new NotFoundException('Kategoriya topilmadi!');
    }
    const data = await this.productModel.findByIdAndUpdate(
      id,
      {
        img: photo.url,
        ...updateProductDto,
      },
      { new: true },
    );
    return { message: 'Yangilandi!', data };
  }

  async remove(id: string) {
    checkId(id);
    const findProd = await this.productModel.findById(id);
    if (!findProd) throw new NotFoundException('Mahsulot topilmadi!');
    await this.productModel.findByIdAndDelete(id);
  }
}
