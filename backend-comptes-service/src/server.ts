import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import logger from './utils/logger';
import compteRoutes from './routes/compteRoutes';
import serviceRoutes from './routes/serviceRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3053;

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/comptes', compteRoutes);
app.use('/api/services', serviceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Comptes & Services' });
});

app.listen(PORT, () => {
  logger.info(`Serveur Comptes & Services démarré sur le port ${PORT}`);
});
