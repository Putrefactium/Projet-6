/**
 * @fileoverview Contrôleur pour la gestion des utilisateurs
 * @module controllers/userCtrl
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const signup = async (req, res) => {
    try {
        // Pour le test, on simule un hash du mot de passe
        const hash = await bcrypt.hash(req.body.password, 10);
        
        // On renvoie une confirmation de création
        res.status(201).json({
            message: "Utilisateur créé !",
            user: {
                email: req.body.email,
                // On ne renvoie jamais le mot de passe, même hashé
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Connexion d'un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const login = async (req, res) => {
    try {
        // Pour le test, on simule une vérification réussie
        // En production, il faudrait vérifier l'email et le mot de passe

        // Création d'un token JWT
        const token = jwt.sign(
            { userId: 'user123' }, // payload fictif
            'RANDOM_TOKEN_SECRET', // clé secrète à remplacer en production
            { expiresIn: '24h' }
        );

        res.status(200).json({
            userId: 'user123',
            token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    signup,
    login
};

