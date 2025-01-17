import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sharpMiddleware = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        // Générer un nom de fichier unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `book-${uniqueSuffix}.webp`;
        const outputPath = path.join(__dirname, '../images', filename);

        // Traiter l'image depuis le buffer
        await sharp(req.file.buffer)
            .webp({ quality: 80 })
            .resize(800, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .toFile(outputPath);

        // Mettre à jour les informations du fichier dans la requête
        req.file.filename = filename;
        req.file.path = outputPath;

        next();
    } catch (error) {
        next(error);
    }
};

export default sharpMiddleware;