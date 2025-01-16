/**
 * @fileoverview Routes pour la gestion des utilisateurs
 * @module routes/User
 */

import express from 'express';
import * as userCtrl from '../controllers/userCtrl.js';

/**
 * Router Express pour les routes utilisateur
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Route POST pour l'inscription d'un nouvel utilisateur
 * @name POST/signup
 * @function
 * @memberof module:routes/User
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.post('/signup', userCtrl.signup);

/**
 * Route POST pour la connexion d'un utilisateur
 * @name POST/login 
 * @function
 * @memberof module:routes/User
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
router.post('/login', userCtrl.login);

export default router;