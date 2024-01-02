import mongoose, { Document, Model } from 'mongoose';
import PointSchema, { Point } from './Utils/PointSchema';

interface Dev {
  name: string;
  github_username: string;
  bio: string;
  avatar_url: string;
  techs: string[];
  location: Point;
}

interface DevDocument extends Dev, Document {}

interface DevModel extends Model<DevDocument> {}

const DevSchema = new mongoose.Schema<DevDocument, DevModel>({
  name: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  techs: [String],
  location: {
    type: PointSchema,
    index: '2dsphere',
  },
});

export default mongoose.model<DevDocument, DevModel>('Dev', DevSchema);
