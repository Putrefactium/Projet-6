/**
 * @fileoverview Configuration de Multer pour le téléchargement de fichiers images
 * @module middlewares/multer-config
 * @requires multer
 */

import multer from 'multer';

/**
 * Types MIME acceptés et leurs extensions correspondantes
 * @constant {Object}
 */
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg', 
  'image/png': 'png',
  'image/webp': 'webp'
};

/**
 * Configuration du stockage Multer
 * @constant {Object}
 */
const storage = multer.memoryStorage();

/**
 * Configuration de Multer avec limites et filtres
 * @type {Object}
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
 */
export default upload.single('image');