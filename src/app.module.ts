import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { AdminsModule } from './admins/admins.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ClientsModule } from './clients/clients.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(env.DB_URL),
    AdminsModule,
    CloudinaryModule,
    ClientsModule,
    CategoryModule,
    ProductsModule,
    LocationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
