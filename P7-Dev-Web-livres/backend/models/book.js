/**
 * @fileoverview Modèle Mongoose pour les livres et les notations
 * @module models/Book
 */

import mongoose from 'mongoose';

/**
 * Schéma Mongoose pour les notations de livres
 * @typedef {Object} RatingSchema
 * @property {string} userId - ID de l'utilisateur ayant noté
 * @property {number} grade - Note donnée (entre 0 et 5)
 */
const ratingSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  grade: { 
    type: Number, 
    required: true,
    min: 0,
    max: 5
  }
});

/**
 * Schéma Mongoose principal pour les livres
 * @typedef {Object} BookSchema
 * @property {string} userId - ID de l'utilisateur ayant créé le livre
 * @property {string} title - Titre du livre
 * @property {string} author - Auteur du livre
 * @property {string} imageUrl - URL de l'image de couverture
 * @property {number} year - Année de publication
 * @property {string} genre - Genre du livre
 * @property {RatingSchema[]} ratings - Tableau des notations
 * @property {number} averageRating - Note moyenne (entre 0 et 5)
 */
const bookSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  year: { 
    type: Number, 
    required: true 
  },
  genre: { 
    type: String, 
    required: true 
  },
  ratings: {
    type: [ratingSchema],
    required: true
  },
  averageRating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  }
});

/**
 * Calcule la note moyenne d'un livre en arrondissant à la décimale la plus proche
 * @method calculateAverageRating
 * @memberof BookSchema
 */
bookSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.grade, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  }
};

export default mongoose.model('Book', bookSchema);
