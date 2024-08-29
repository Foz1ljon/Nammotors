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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto, img: Express.Multer.File) {
    if (!img) {
      throw new BadRequestException('Rasm talab qilinadi!');
    }

    const photoUrl = (await this.cloudinaryService.uploadImage(img)).secure_url;

    checkId(createProductDto.category);
    const category = await this.categoryModel.findById(
      createProductDto.category,
    );
    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    const newProduct = await this.productModel.create({
      img: photoUrl,
      ...createProductDto,
    });

    return newProduct.populate('category');
  }
  async filterProduct(searchProductDto: SearchProductDto): Promise<Product[]> {
    const { query } = searchProductDto;
    const searchQuery = typeof query === 'string' ? query.trim() : '';

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          img: 1,
          marka: 1,
          kwt: 1,
          turnover: 1,
          location: 1,
          count: 1,
          price: 1,
          m3: 1,
          mh: 1,
          category: '$categoryInfo.name',
        },
      },
    ];

    // Agar qidiruv so'rovi mavjud bo'lsa, $match bosqichini qo'shing
    if (searchQuery) {
      pipeline.splice(2, 0, {
        $match: {
          'categoryInfo.name': { $regex: searchQuery, $options: 'i' },
        },
      });
    }

    const products = await this.productModel.aggregate(pipeline).exec();
    console.log('Topilgan mahsulotlar:', products);
    return products;
  }

  async search(searchProductDto: SearchProductDto): Promise<Product[]> {
    const { query } = searchProductDto;
    const searchQuery = typeof query === 'string' ? query.trim() : '';

    const pipeline = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $match: {
          $or: [
            { marka: { $regex: searchQuery, $options: 'i' } },
            { kwt: { $regex: searchQuery, $options: 'i' } },
            { turnover: { $regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } },
            { m3: { $regex: searchQuery, $options: 'i' } },
            { mh: { $regex: searchQuery, $options: 'i' } },
            { 'categoryInfo.name': { $regex: searchQuery, $options: 'i' } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          img: 1,
          marka: 1,
          kwt: 1,
          turnover: 1,
          location: 1,
          count: 1,
          price: 1,
          m3: 1,
          mh: 1,
          category: '$categoryInfo.name',
        },
      },
    ];

    return this.productModel.aggregate(pipeline).exec();
  }

  async findOne(id: string) {
    checkId(id);
    const product = await this.productModel.findById(id).populate('category');
    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi!');
    }

    // Javobdan category ichidagi products arrayini o'chirish
    if (product.category && 'products' in product.category) {
      product.category.products = undefined;
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    img?: Express.Multer.File,
  ) {
    checkId(id);
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi!');
    }

    if (img) {
      const photoUrl = (await this.cloudinaryService.uploadImage(img))
        .secure_url;
      await this.cloudinaryService.removeImageByUrl(product.img);
      updateProductDto.img = photoUrl;
    }

    if (updateProductDto.category) {
      checkId(updateProductDto.category);
      const category = await this.categoryModel.findById(
        updateProductDto.category,
      );
      if (!category) {
        throw new NotFoundException('Kategoriya topilmadi!');
      }
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      { ...updateProductDto },
      { new: true },
    );

    return {
      message: 'Mahsulot muvaffaqiyatli yangilandi!',
      data: updatedProduct,
    };
  }

  async remove(id: string) {
    checkId(id);
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi!');
    }
    await this.productModel.findByIdAndDelete(id);
    return { message: 'Mahsulot muvaffaqiyatli o‘chirildi!' };
  }
}
