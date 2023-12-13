import { Schema, model, Document } from 'mongoose';

interface IGenre extends Document {
  name: string;
}

const genreSchema = new Schema<IGenre>({
  name: {
    type: String,
    required: true,
  },
});

const GenreModel = model<IGenre>('Genre', genreSchema);

export default GenreModel;
