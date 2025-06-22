import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  getMulterOptions(): MulterOptions {
  return {
    storage: new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => ({
        folder: 'profile-images',
        format: file.mimetype.split('/')[1], 
        public_id: `${Date.now()}-${file.originalname}`,
      }),
    }),
  };
}


  async uploadImage(filePath: string): Promise<string> {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url;
  }
}
