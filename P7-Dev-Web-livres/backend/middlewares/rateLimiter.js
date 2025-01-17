/**
 * @fileoverview Middleware de limitation de taux pour les tentatives de connexion
 * @module middlewares/rateLimiter
 * @requires express-rate-limit
 */

import rateLimit from 'express-rate-limit';

/**
 * Middleware de limitation du nombre de tentatives de connexion
 * @constant {Object} loginLimiter - Configuration du limiteur de taux
 * @property {number} windowMs - Fenêtre de temps en millisecondes (15 minutes)
 * @property {number} max - Nombre maximum de tentatives autorisées
 * @property {Object} message - Message d'erreur par défaut
 * @property {boolean} standardHeaders - Active les headers standards de rate limit
 * @property {boolean} legacyHeaders - Désactive les anciens headers
 * @property {Function} handler - Gestionnaire personnalisé des dépassements de limite
 * @returns {Function} Middleware Express de limitation de taux
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Augmenté à 100 tentatives pour le développement
    message: {
        error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
    },
    standardHeaders: true, // Retourne les infos de rate limit dans les headers
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.',
            remainingTime: Math.ceil(req.rateLimit.resetTime / 1000 / 60) + ' minutes' // Temps restant en minutes
        });
    }
});