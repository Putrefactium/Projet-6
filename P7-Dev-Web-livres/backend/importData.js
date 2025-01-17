/**
 * @fileoverview Script d'importation des données depuis data.json vers MongoDB
 * @requires mongoose - ODM pour MongoDB
 * @requires fs - Module Node.js pour la gestion des fichiers
 * @requires path - Module Node.js pour la gestion des chemins
 * @requires url - Module Node.js pour la gestion des URLs
 * @requires dotenv - Chargement des variables d'environnement
 * @requires ../models/book - Modèle Mongoose pour les livres
 */

import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Book from './models/book.js';

// Configuration des chemins pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chargement des variables d'environnement
dotenv.config();

/**
 * Fonction principale d'importation des données
 */
async function importData() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connexion à MongoDB réussie !');

        // Lecture du fichier data.json
        const dataPath = path.join(__dirname, 'data.json');
        const jsonData = await fs.readFile(dataPath, 'utf8');
        const books = JSON.parse(jsonData);

        // Suppression des données existantes
        await Book.deleteMany({});
        console.log('Collection books nettoyée');

        // Importation des nouvelles données
        const result = await Book.insertMany(books);
        console.log(`${result.length} livres importés avec succès !`);

        // Calcul des moyennes pour chaque livre
        for (const book of result) {
            book.calculateAverageRating();
            await book.save();
        }
        console.log('Moyennes des notes calculées et mises à jour');

    } catch (error) {
        console.error('Erreur lors de l\'importation :', error);
    } finally {
        // Fermeture de la connexion
        await mongoose.connection.close();
        console.log('Connexion MongoDB fermée');
    }
}

// Exécution du script
importData();