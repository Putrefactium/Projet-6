/**
 * @fileoverview Configuration principale de l'application Express
 * @module app
 * @requires express
 * @requires mongoose
 * @requires path
 * @requires url
 * @requires dotenv
 * @requires routes/User
 * @requires routes/Books
 */

import express from 'express';
import userRoutes from './routes/User.js';
import bookRoutes from './routes/Books.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

/**
 * Configuration des chemins pour ES modules
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chargement des variables d'environnement
dotenv.config();

/**
 * Instance de l'application Express
 * @type {express.Application}
 */
const app = express();

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/**
 * Middleware pour parser les requêtes en JSON et les données de formulaire
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware pour gérer les CORS
 * Configure les en-têtes pour permettre les requêtes cross-origin
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
    });

/**
 * Configuration des routes principales
 */
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

export default app;