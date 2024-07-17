import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schemas';
import { Category, CategorySchema } from '../category/schemas/category.schemas';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import {
  Location,
  LocationSchema,
} from '../locations/schemas/location.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Location.name, schema: LocationSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
