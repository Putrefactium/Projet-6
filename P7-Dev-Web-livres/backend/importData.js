import mongoose from 'mongoose';
import Book from './models/book.js';
import { readFile } from 'fs/promises';

// Configuration de la connexion MongoDB
const MONGODB_URI = 'mongodb+srv://jeremiemariepro:N3y4qqOpcKXs68mT@cluster0.gfesu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Fonction d'importation
async function importData() {
  try {
    // Lecture du fichier JSON
    const data = JSON.parse(await readFile(new URL('./data/data.json', import.meta.url)));
    
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Suppression des données existantes (optionnel)
    await Book.deleteMany({});
    console.log('Données existantes supprimées');

    // Import des nouvelles données
    const books = await Book.insertMany(data);
    console.log(`${books.length} livres ont été importés avec succès`);

    // Déconnexion
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB');

  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    process.exit(1);
  }
}

// Exécution de l'importation
importData();