interface Config {
  PORT: number;
  MONGODB_URI: string;
  NODE_ENV: string;
  dbUrl: string;
}

const dbUrl =
  'mongodb+srv://sergkabanoff:mayday77@nodeproject.f98upqi.mongodb.net/moviedb?retryWrites=true&w=majority';

const config: Config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  MONGODB_URI: process.env.MONGODB_URI || dbUrl,
  NODE_ENV: process.env.NODE_ENV || 'development',
  dbUrl,
};

export default config;
