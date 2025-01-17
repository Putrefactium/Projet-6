/**
 * @fileoverview Middleware d'authentification pour vérifier les tokens JWT
 * @module middlewares/auth
 * @requires jsonwebtoken
 * @requires dotenv
 */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware d'authentification qui vérifie la validité du token JWT
 * @function
 * @param {Object} req - Requête Express
 * @param {Object} req.headers - En-têtes de la requête
 * @param {string} req.headers.authorization - Token d'authentification au format 'Bearer <token>'
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {void}
 * @throws {Error} Erreur si le token est invalide ou manquant
 */
export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Requête non authentifiée !' });
    }
};
