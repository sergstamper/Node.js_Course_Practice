import mongoose, { Connection, Mongoose } from 'mongoose';

import config from './config.js';

export default async (): Promise<Connection> => {
  const mongooseInstance: Mongoose = await mongoose.connect(config.dbUrl);

  const connection: Connection = mongooseInstance.connection;

  connection.on('error', error => {
    console.error('Error connection to MongoDB Atlas:', error);
  });

  connection.once('open', () => {
    console.log('Successfully connected to MongoDB Atlas');
  });

  return connection;
};
