import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { AdminsModule } from './admins/admins.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ClientsModule } from './clients/clients.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
