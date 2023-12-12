import { Schema, model, Document } from 'mongoose';

interface IMovie extends Document {
  title: string;
  description: string;
  releaseDate: Date;
  genre: string[];
}

const movieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: false,
  },
  genre: {
    type: [String],
    required: true,
  },
});

movieSchema.pre('save', function (next) {
  if (!this.releaseDate) {
    this.releaseDate = new Date();
  }
  next();
});

const MovieModel = model<IMovie>('Movie', movieSchema);

export default MovieModel;
