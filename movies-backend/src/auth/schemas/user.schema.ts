import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  name?: string;

  @Prop()
  address?: string;

  @Prop()
  image?: string;

  @Prop()
  dob?: Date;

  @Prop({ type: [String], default: [] })
  categories?: string[];

  @Prop({ type: Map, of: Number, default: {} })
  movieRatings?: Map<string, number>;
}

export const UserSchema = SchemaFactory.createForClass(User);
