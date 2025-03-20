import { connect, connection } from 'mongoose';
import { config } from 'dotenv';

config();

const initDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection by getting collection names
    const collections = await connection.db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// If this file is run directly
if (require.main === module) {
  initDB()
    .then(() => {
      console.log('Database connection test successful!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Database connection test failed:', err);
      process.exit(1);
    });
}

export default initDB;