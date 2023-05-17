import { Photo } from '../photos/entities/photo.entity';
import { Upload } from '../uploads/entities/upload.entity';

export interface IWatermarkJob {
    photo: Photo;
    watermark: Upload | null;
}