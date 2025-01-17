/**
 * @fileoverview Routes pour la gestion des livres
 * @module routes/Books
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
 */
router.get('/bestratings', auth, booksCtrl.getBestRatingsBook);

/**
 * Route GET pour récupérer tous les livres
 * @name GET/
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.get('/', booksCtrl.getAllBooks);

/**
 * Route GET pour récupérer un livre spécifique
 * @name GET/:id
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.get('/:id', booksCtrl.getOneBook);

/**
 * Route POST pour créer un nouveau livre
 * @name POST/
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.post('/', auth, multer, sharp, booksCtrl.createBook);

/**
 * Route PUT pour modifier un livre existant
 * @name PUT/:id
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.put('/:id', auth, multer, sharp, booksCtrl.modifyBook);

/**
 * Route DELETE pour supprimer un livre
 * @name DELETE/:id
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.delete('/:id', auth, booksCtrl.deleteBook);

/**
 * Route POST pour noter un livre
 * @name POST/:id/rating
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.post('/:id/rating', auth, booksCtrl.rateBook);

export default router;