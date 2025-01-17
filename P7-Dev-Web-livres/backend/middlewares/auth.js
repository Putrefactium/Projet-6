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
 * @param {string} req.headers.authorization - Token d'authentification au format 'Bearer <token>' où token est un JWT encodé en base64 contenant {userId: string}
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {void}
 * @throws {Error} Erreur si le token est invalide ou manquant
 * @example
 * Format valide du header Authorization
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * @example
 * Cas d'erreurs possibles:
 * 1. Header Authorization manquant
 * 2. Format du token invalide (pas de Bearer)
 * 3. Token JWT malformé ou expiré
 * 4. Signature du token invalide
 * 5. Payload du token ne contient pas userId
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
