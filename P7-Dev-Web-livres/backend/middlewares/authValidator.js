/**
 * @fileoverview Middleware de validation des données d'authentification
 * @module middlewares/authValidator
 * @requires express-validator
 */

import { body, validationResult } from 'express-validator';

/**
 * Middleware de validation des champs email et mot de passe
 * @constant {Array} validateAuth - Tableau de middlewares de validation
 * @property {Function} email - Validation du format email
 * @property {Function} password - Validation du format mot de passe
 * @property {Function} errorHandler - Gestion des erreurs de validation
 * @returns {Array} Tableau de middlewares de validation
 */
export const validateAuth = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail({
            gmail_remove_dots: false,
            gmail_remove_subaddress: false
        })
        .toLowerCase(),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];