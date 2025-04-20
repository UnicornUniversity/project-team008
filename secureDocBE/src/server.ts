import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { sequelize } from './config/database';

const PORT = process.env.SERVER_PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();
