import mongoose, { Connection, Mongoose } from 'mongoose';

const dbUrl = 'mongodb+srv://sergkabanoff:mayday77@nodeproject.f98upqi.mongodb.net/moviedb?retryWrites=true&w=majority';

const connectToDatabase = async (): Promise<Connection> => {
    const mongooseInstance: Mongoose = await mongoose.connect(dbUrl);

    const connection: Connection = mongooseInstance.connection;

    connection.on('error', (error) => {
        console.error('Error connection to MongoDB Atlas:', error);
    });

    connection.once('open', () => {
        console.log('Successfully connected to MongoDB Atlas');
    });

    return connection;
};

export default connectToDatabase;