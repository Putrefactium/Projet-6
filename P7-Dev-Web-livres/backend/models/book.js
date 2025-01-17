import mongoose from 'mongoose';

// Schéma pour les notations
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

// Schéma principal pour les livres
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

// Méthode pour calculer la moyenne des notes
bookSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.grade, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  }
};

export default mongoose.model('Book', bookSchema);
