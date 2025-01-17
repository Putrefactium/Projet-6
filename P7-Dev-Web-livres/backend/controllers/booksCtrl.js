/**
 * @fileoverview Contrôleur pour la gestion des livres dans l'application
 * @module controllers/booksCtrl
 * @requires ../models/book
 */

import Book from '../models/book.js';

/**
 * Crée un nouveau livre
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 * @returns {Promise<void>}
 */
export const createBook = async (req, res, next) => {
    try {
        const bookObject = req.file ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: 'Nouveau livre enregistré !' });
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
    } catch (error) {
        res.status(400).json({ error: 'Format de données invalide' });
    }
};

/**
 * Récupère un livre spécifique
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 * @returns {Promise<void>}
 */
export const getOneBook = async (req, res, next) => {
    try {
        Book.findOne({
            _id: req.params.id
        })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error: error.message }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Récupère tous les livres
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 * @returns {Promise<void>}
 */
export const getAllBooks = async (req, res, next) => {
    try {
        Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error: error.message }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Modifie un livre existant
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 * @returns {Promise<void>}
 */
export const modifyBook = async (req, res, next) => {
    try {
        const bookObject = req.file ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

        const existingBook = await Book.findOne({ _id: req.params.id });
        
        if (!existingBook) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        if (existingBook.userId != req.auth.userId) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        // Si une nouvelle image est uploadée, supprimer l'ancienne
        if (req.file && existingBook.imageUrl) {
            const oldFilename = existingBook.imageUrl.split('/images/')[1];
            const oldFilePath = path.join(__dirname, '../images', oldFilename);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
        );

        res.status(200).json({ message: 'Livre modifié !' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

/**
 * Supprime un livre
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 * @returns {Promise<void>}
 */
export const deleteBook = async (req, res, next) => {
    try {
        Book.findOne({ _id: req.params.id })
            .then((book) => {
                if (book.userId != req.auth.userId) {
                    res.status(401).json({ message: 'Not authorized' });
                } else {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Récupère les 3 livres les mieux notés
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 * @returns {Promise<void>}
 */    
export const getBestRatingsBook = async (req, res, next) => {
    try {
        Book.find()
            .sort({ averageRating: -1 }) // Tri par note moyenne décroissante
            .limit(3) // Limite à 3 livres
            .then(books => res.status(200).json(books))
            .catch(error => res.status(400).json({ error: error.message }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Note un livre
 * @async
 * @param {Object} req - Requête Express contenant la note dans req.body.rating
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 * @returns {Promise<void>}
 */
export const rateBook = async (req, res, next) => {
    try {
        // Vérifier que la note est entre 0 et 5
        if (req.body.rating < 0 || req.body.rating > 5) {
            return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5' });
        }

        // Récupérer le livre
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Livre non trouvé' });
        }

        // Vérifier si l'utilisateur a déjà noté ce livre
        const userRating = book.ratings.find(rating => rating.userId === req.auth.userId);
        if (userRating) {
            return res.status(400).json({ error: 'Vous avez déjà noté ce livre' });
        }

        // Ajouter la nouvelle note
        book.ratings.push({
            userId: req.auth.userId,
            grade: req.body.rating
        });

        // Recalculer la moyenne
        book.calculateAverageRating();

        // Sauvegarder les modifications
        await book.save();

        // Renvoyer le livre mis à jour
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
