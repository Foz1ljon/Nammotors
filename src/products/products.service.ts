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
    const photo = (await this.cloudinaryService.uploadImage(img)).secure_url;

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
    const photo = (await this.cloudinaryService.uploadImage(img)).secure_url;
    return this.productModel.create({ img: photo, ...createComponentDto });
  }

  async filterProduct(searchProductDto: SearchProductDto): Promise<Product[]> {
    const { query } = searchProductDto;

    // Ensure query is a string and not empty
    const searchQuery = typeof query === 'string' ? query : '';

    // Log the search query for debugging
    console.log('Search Query:', searchQuery);

    // If the search query is empty, return an empty array
    if (!searchQuery) {
      return []; // Return empty array if no query is provided
    }

    // Aggregation pipeline for filtering products based on category name only
    const pipeline = [
      {
        $lookup: {
          from: 'categories', // The collection name for categories
          localField: 'category', // Field in products collection
          foreignField: '_id', // Field in categories collection
          as: 'categoryInfo', // Alias for the joined data
        },
      },
      {
        $unwind: {
          path: '$categoryInfo', // Flatten the categoryInfo array
          preserveNullAndEmptyArrays: true, // Keep products without category
        },
      },
      {
        $match: {
          'categoryInfo.name': { $regex: searchQuery, $options: 'i' }, // Match by category name (case insensitive)
        },
      },
      {
        $project: {
          // Define the fields to include in the output
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

    // Execute the aggregation pipeline
    const products = await this.productModel.aggregate(pipeline).exec();

    // Log the found products for debugging
    console.log('Products Found:', products);

    return products; // Returns [] if no matches
  }

  // qidiruv
  async search(searchProductDto: SearchProductDto): Promise<Product[]> {
    let { query } = searchProductDto;

    // Ensure query is a string
    query = typeof query === 'string' ? query : '';

    // Aggregation pipeline for searching by category.name
    const pipeline = [
      {
        $lookup: {
          from: 'categories', // The collection name for categories
          localField: 'category', // Field in products collection
          foreignField: '_id', // Field in categories collection
          as: 'categoryInfo', // Alias for the joined data
        },
      },
      {
        $unwind: '$categoryInfo', // Flatten the categoryInfo array
      },
      {
        $match: {
          $or: [
            { marka: { $regex: query, $options: 'i' } },
            { kwt: { $regex: query, $options: 'i' } },
            { turnover: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { m3: { $regex: query, $options: 'i' } },
            { mh: { $regex: query, $options: 'i' } },

            { 'categoryInfo.name': { $regex: query, $options: 'i' } }, // Search by category name
          ],
        },
      },
      {
        $project: {
          // Optional: Define the fields to include in the output
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

    const products = await this.productModel.aggregate(pipeline).exec();

    return products;
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
        img: photo.secure_url,
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
        img: photo.secure_url,
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
