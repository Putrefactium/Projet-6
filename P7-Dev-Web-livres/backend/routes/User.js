/**
 * @fileoverview Routes pour la gestion des utilisateurs
 * @module routes/User
 * @requires express
 * @requires controllers/userCtrl
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
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne une promesse qui se résout quand l'utilisateur est créé
 */
router.post('/signup', userCtrl.signup);

/**
 * Route POST pour la connexion d'un utilisateur
 * @name POST/login 
 * @function
 * @memberof module:routes/User
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} Retourne une promesse qui se résout avec le token d'authentification
 */
router.post('/login', userCtrl.login);

export default router;