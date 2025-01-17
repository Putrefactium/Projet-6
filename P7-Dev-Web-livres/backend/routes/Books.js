/**
 * @fileoverview Routes pour la gestion des livres
 * @module routes/Books
 * @requires express
 * @requires middlewares/auth
 * @requires middlewares/multer-config
 * @requires middlewares/sharp-config
 * @requires controllers/booksCtrl
 */

import express from 'express';
import auth from '../middlewares/auth.js';
import multer from '../middlewares/multer-config.js';
import sharp from '../middlewares/sharp-config.js';
import * as booksCtrl from '../controllers/booksCtrl.js';

/**
 * Router Express pour les routes des livres
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Route GET pour récupérer les livres les mieux notés
 * @name GET/bestratings
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne les 3 livres les mieux notés
 */
router.get('/bestratings', booksCtrl.getBestRatingsBook);

/**
 * Route GET pour récupérer tous les livres
 * @name GET/
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne la liste de tous les livres
 */
router.get('/', booksCtrl.getAllBooks);

/**
 * Route GET pour récupérer un livre spécifique
 * @name GET/:id
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID du livre à récupérer
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne le livre demandé
 */
router.get('/:id', booksCtrl.getOneBook);

/**
 * Route POST pour créer un nouveau livre
 * @name POST/
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.title - Titre du livre
 * @param {string} req.body.author - Auteur du livre
 * @param {number} req.body.year - Année de publication
 * @param {string} req.body.genre - Genre du livre
 * @param {Object} req.file - Fichier image uploadé
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne le livre créé
 */
router.post('/', auth, multer, sharp, booksCtrl.createBook);

/**
 * Route PUT pour modifier un livre existant
 * @name PUT/:id
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID du livre à modifier
 * @param {Object} req.body - Corps de la requête avec les modifications
 * @param {Object} req.file - Nouveau fichier image (optionnel)
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne le livre modifié
 */
router.put('/:id', auth, multer, sharp, booksCtrl.modifyBook);

/**
 * Route DELETE pour supprimer un livre
 * @name DELETE/:id
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID du livre à supprimer
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne un message de confirmation
 */
router.delete('/:id', auth, booksCtrl.deleteBook);

/**
 * Route POST pour noter un livre
 * @name POST/:id/rating
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - ID du livre à noter
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.rating - Note attribuée (entre 0 et 5)
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne le livre avec sa nouvelle note moyenne
 */
router.post('/:id/rating', auth, booksCtrl.rateBook);

export default router;