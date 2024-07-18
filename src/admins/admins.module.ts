import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Client, ClientSchema } from '../clients/schemas/client.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
    CloudinaryModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    JwtModule.register({
      secret: env.JWT_ACCESS_TOKEN,
      signOptions: { expiresIn: env.JWT_TIME },
    }),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
