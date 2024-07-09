import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import toStream = require('buffer-to-stream');
import { promisify } from 'util';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const uploadStream = promisify(
      cloudinary.uploader.upload_stream.bind(cloudinary.uploader),
    );

    try {
      const result = await uploadStream((error, result) => {
        if (error) {
          throw error;
        }
        return result;
      });

      toStream(file.buffer).pipe(uploadStream);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async removeImage(
    publicId: string,
  ): Promise<{ result: string } | UploadApiErrorResponse> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
