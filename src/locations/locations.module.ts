import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location, LocationSchema } from './schemas/location.schemas';
import { Product, ProductSchema } from '../products/schemas/product.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
