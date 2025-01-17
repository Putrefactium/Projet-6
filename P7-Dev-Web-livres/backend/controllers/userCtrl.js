/**
 * @fileoverview Contrôleur pour la gestion des utilisateurs (inscription et connexion)
 * @module controllers/userCtrl
 * @requires bcrypt - Module pour le hachage des mots de passe
 * @requires jsonwebtoken - Module pour la gestion des tokens JWT
 * @requires ../models/user - Modèle Mongoose pour les utilisateurs
 * @requires dotenv - Module pour la gestion des variables d'environnement
 * @requires middlewares/authValidator - Middleware de validation des données d'authentification
 * @description Ce module gère l'inscription et la connexion des utilisateurs avec validation des données,
 * hachage sécurisé des mots de passe et génération de tokens JWT
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';
import { validateAuth } from '../middlewares/authValidator.js';

dotenv.config();

/**
 * Inscription d'un nouvel utilisateur
 * @async
 * @function signup
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.email - Email de l'utilisateur (doit être unique et valide)
 * @param {string} req.body.password - Mot de passe de l'utilisateur (doit respecter les critères de sécurité)
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} - Retourne une promesse qui se résout quand l'utilisateur est créé
 * @throws {Error} - Erreur lors de la création de l'utilisateur ou si l'email existe déjà
 * @description Crée un nouvel utilisateur après validation des données et hachage du mot de passe
 */
export const signup = [
    validateAuth,
    async (req, res, next) => {
        try {
            // Log pour debug
            console.log("Tentative d'inscription avec:", {
                email: req.body.email,
                // Ne pas logger le mot de passe en production
            });

            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                console.log("Email déjà utilisé");
                return res.status(400).json({ message: "Cet email est déjà utilisé" });
            }

            const hash = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                email: req.body.email,
                password: hash
            });

            await user.save();
            console.log("Utilisateur créé avec succès");
            return res.status(201).json({ message: "Nouvel utilisateur créé !" });
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            return res.status(500).json({ 
                message: "Erreur lors de l'inscription",
                error: error.message 
            });
        }
    }
];

/**
 * Connexion d'un utilisateur existant
 * @async
 * @function login
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<Object>} - Retourne une promesse qui se résout avec l'ID utilisateur et le token JWT
 * @throws {Error} - Erreur lors de la connexion, si l'utilisateur n'existe pas ou si le mot de passe est incorrect
 * @description Authentifie un utilisateur et génère un token JWT valide pour 24h
 */
export const login = [
    validateAuth,
    async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }

            const valid = await bcrypt.compare(req.body.password, user.password);
            if (!valid) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }

            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                )
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

export default {
    signup,
    login
};
