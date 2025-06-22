import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  release_date: string;

  @Prop()
  vote_average: number;

  @Prop()
  poster_path: string;

  @Prop()
  backdrop_path: string;

  @Prop()
  genre_ids: number[];

  @Prop()
  original_language: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
