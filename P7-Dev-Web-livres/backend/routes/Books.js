/**
 * @fileoverview Routes pour la gestion des livres
 * @module routes/Books
 */

import express from 'express';
import * as booksCtrl from '../controllers/booksCtrl.js';
import auth from '../middlewares/auth.js';

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
router.get('/', auth, booksCtrl.getAllBooks);

/**
 * Route GET pour récupérer un livre spécifique
 * @name GET/:id
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.get('/:id', auth, booksCtrl.getOneBook);

/**
 * Route POST pour créer un nouveau livre
 * @name POST/
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.post('/', auth, booksCtrl.createBook);

/**
 * Route PUT pour modifier un livre existant
 * @name PUT/:id
 * @function
 * @memberof module:routes/Books
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.put('/:id', auth, booksCtrl.modifyBook);

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