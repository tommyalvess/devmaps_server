import { Document, Model, Schema } from 'mongoose';

interface Point {
  type: 'Point';
  coordinates: [number, number];
}

interface PointDocument extends Point, Document {}

interface PointModel extends Model<PointDocument> {}

const PointSchema = new Schema<PointDocument, PointModel>({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

export { Point, PointDocument, PointModel };
export default PointSchema;
