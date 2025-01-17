/**
 * @fileoverview Configuration de Sharp pour l'optimisation des images
 * @module middlewares/sharp-config
 * @requires sharp
 * @requires url
 * @requires path
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Middleware pour optimiser les images téléchargées
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 * @returns {Promise<void>}
 */
const sharpMiddleware = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `book-${uniqueSuffix}.webp`;
        const outputPath = path.join(__dirname, '../images', filename);

        await sharp(req.file.buffer)
            .webp({ quality: 80 })
            .resize(800, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .toFile(outputPath);

        req.file.filename = filename;
        req.file.path = outputPath;

        next();
    } catch (error) {
        next(error);
    }
};

export default sharpMiddleware;