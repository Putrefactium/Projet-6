/**
 * @fileoverview Contrôleur pour la gestion des livres dans l'application. Gère la création, modification, suppression et notation des livres.
 * @module controllers/booksCtrl
 * @requires ../models/book
 * @requires fs
 * @requires path
 * @requires url
 */

import Book from '../models/book.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Crée un nouveau livre dans la base de données
 * @async
 * @param {Object} req - Requête Express contenant les données du livre et l'image
 * @param {Object} req.body - Corps de la requête contenant les données du livre
 * @param {Object} req.file - Fichier image uploadé
 * @param {Object} req.auth - Informations d'authentification
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne un message de confirmation ou une erreur
 * @throws {Error} Erreur si le format des données est invalide
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
 * Récupère les informations d'un livre spécifique
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID du livre à récupérer
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne les données du livre ou une erreur
 * @throws {Error} Erreur si le livre n'est pas trouvé
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
 * Récupère la liste de tous les livres
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne un tableau de tous les livres
 * @throws {Error} Erreur lors de la récupération des livres
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
 * Modifie les informations d'un livre existant
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Nouvelles données du livre
 * @param {Object} req.file - Nouvelle image du livre (optionnel)
 * @param {Object} req.auth - Informations d'authentification
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID du livre à modifier
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne un message de confirmation ou une erreur
 * @throws {Error} Erreur si la modification échoue
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
            if (oldFilename) {
                const oldFilePath = path.join(__dirname, '../images', oldFilename);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        }

        await Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
        );

        res.status(200).json({ message: 'Livre modifié !' });
    } catch (error) {
        console.error('Erreur lors de la modification du livre:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Supprime un livre et son image associée
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID du livre à supprimer
 * @param {Object} req.auth - Informations d'authentification
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne un message de confirmation ou une erreur
 * @throws {Error} Erreur si la suppression échoue
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
 * Récupère les 3 livres ayant les meilleures notes moyennes
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne un tableau des 3 meilleurs livres
 * @throws {Error} Erreur lors de la récupération des livres
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
 * Ajoute ou met à jour la note d'un livre par un utilisateur
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.rating - Note attribuée au livre (entre 0 et 5)
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID du livre à noter
 * @param {Object} req.auth - Informations d'authentification
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne le livre mis à jour avec la nouvelle note
 * @throws {Error} Erreur si la notation échoue ou si les conditions ne sont pas respectées
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

        // Ajouter la nouvelle note à la liste des notes
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
