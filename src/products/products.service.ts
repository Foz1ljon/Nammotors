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

  async search(searchProductDto: SearchProductDto): Promise<Product[]> {
    const { marka, price, kwt, turnover } = searchProductDto;

    const query: any = {};

    if (marka) {
      query.marka = { $regex: marka, $options: 'i' };
    }
    if (price) {
      query.price = { $regex: price, $options: 'i' };
    }
    if (kwt) {
      query.kwt = { $regex: kwt, $options: 'i' };
    }
    if (turnover) {
      query.turnover = { $regex: turnover, $options: 'i' };
    }

    return this.productModel.find(query).exec();
  }

  findOne(id: string) {
    return `This action returns a #${id} product`;
  }

  update(
    id: string,
    updateProductDto: UpdateProductDto,
    img?: Express.Multer.File,
  ) {
    return img;
    return updateProductDto;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
