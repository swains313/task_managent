import mongoose from 'mongoose';

const globalTeardown = async () => {
  await mongoose.connection.close();

  if (global.__SERVER__) {
    await new Promise<void>((resolve, reject) => {
      global.__SERVER__.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};

export default globalTeardown;
