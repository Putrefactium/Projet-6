/**
 * @fileoverview Modèle de données pour les utilisateurs de l'application
 * @module models/user
 * @requires mongoose
 * @requires mongoose-unique-validator
 */

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Schéma de données pour un utilisateur
 * @typedef {Object} UserSchema
 * @property {string} email - Email de l'utilisateur (unique et requis)
 * @property {string} password - Mot de passe de l'utilisateur hashé (requis)
 */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });

userSchema.plugin(uniqueValidator);

/**
 * Modèle mongoose pour les utilisateurs
 * @type {mongoose.Model<UserSchema>}
 * @exports User
 */
export default mongoose.model('User', userSchema);
