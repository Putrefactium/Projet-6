/**
 * @fileoverview Contrôleur pour la gestion des utilisateurs (inscription et connexion)
 * @module controllers/userCtrl
 * @requires bcrypt
 * @requires jsonwebtoken
 * @requires ../models/user
 * @requires dotenv
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Inscription d'un nouvel utilisateur
 * @async
 * @function signup
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction middleware suivante
 * @returns {Promise<void>} - Retourne une promesse qui se résout quand l'utilisateur est créé
 * @throws {Error} - Erreur lors de la création de l'utilisateur
 */
export const signup = async (req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
            const user = new User({
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(() => {
                res.status(201).json({ message: 'Nouvel utilisateur créé !' });
                console.log('Nouvel utilisateur créé !'); 
              })
              .catch(error => {
                res.status(400).json({ error });
                console.log('Erreur lors de la création de l\'utilisateur :', error);
              });
          })
          .catch(error => {
            res.status(500).json({ error });
            console.log('Erreur lors de la création de l\'utilisateur :', error);
          });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
};

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
 * @returns {Promise<void>} - Retourne une promesse qui se résout avec le token d'authentification
 * @throws {Error} - Erreur lors de la connexion de l'utilisateur
 */
export const login = async (req, res, next) => {
    try {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    console.log('Paire login/mot de passe incorrecte');
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                            console.log('Paire login/mot de passe incorrecte');
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id }, 
                                process.env.JWT_SECRET, 
                                { expiresIn: '24h' }
                            )
                        });
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                        console.log('Erreur lors de la connexion de l\'utilisateur :', error);
                    });
            })
            .catch(error => {
                res.status(500).json({ error });
                console.log('Erreur lors de la connexion de l\'utilisateur :', error);
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    signup,
    login
};
