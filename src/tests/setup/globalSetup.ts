
import app from '../../app';  // Your Express app
import { connectMongoose } from '../../db-config/db.config';


const globalSetup = async () => {
 await connectMongoose()
  const server = app.listen(8000, () => {
    console.log("Test server is running on port 8000");
  });

  global.__SERVER__ = server;
};

export default globalSetup;
