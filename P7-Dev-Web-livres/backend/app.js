import express from 'express';
import userRoutes from './routes/User.js';
import bookRoutes from './routes/Books.js';
import mongoose from 'mongoose';
// import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware pour parser les requêtes en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour gérer les erreurs de CORS et autoriser les requêtes entre le frontend et le backend
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
    });

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

export default app;