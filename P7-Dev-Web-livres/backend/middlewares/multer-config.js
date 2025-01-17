/**
 * @fileoverview Configuration de Multer pour le téléchargement de fichiers images
 * @module middlewares/multer-config
 * @requires multer
 * @description Gère le téléchargement et la validation des fichiers images
 */

import multer from 'multer';

/**
 * Types MIME acceptés et leurs extensions correspondantes
 * @constant {Object}
 * @property {string} image/jpg - Extension jpg
 * @property {string} image/jpeg - Extension jpg
 * @property {string} image/png - Extension png 
 * @property {string} image/webp - Extension webp
 */
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg', 
  'image/png': 'png',
  'image/webp': 'webp'
};

/**
 * Configuration du stockage Multer en mémoire
 * @constant {Object}
 * @description Utilise le stockage en mémoire pour permettre le traitement ultérieur par Sharp
 */
const storage = multer.memoryStorage();

/**
 * Configuration de Multer avec limites et filtres
 * @type {Object}
 * @property {Object} storage - Configuration du stockage en mémoire
 * @property {Object} limits - Limites de taille des fichiers
 * @property {Function} fileFilter - Fonction de validation des types de fichiers
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    fileFilter: (req, file, callback) => {
        // Vérifie si le type MIME est autorisé
        if (MIME_TYPES[file.mimetype]) {
            callback(null, true);
        } else {
            callback(new Error('Type de fichier non supporté'), false);
        }
    }
});

/**
 * Middleware Multer configuré pour gérer un seul fichier image
 * @type {Object}
 * @exports upload.single
 * @description Traite un seul fichier avec le champ 'image'
 */
export default upload.single('image');