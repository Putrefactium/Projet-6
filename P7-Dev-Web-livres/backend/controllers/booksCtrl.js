/**
 * @fileoverview Contrôleur pour la gestion des livres
 * @module controllers/booksCtrl
 */

export const getAllBooks = async (req, res) => {
    try {
        // Pour le moment, on renvoie un tableau vide
        res.status(200).json([]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOneBook = async (req, res) => {
    try {
        // Pour le moment, on renvoie un objet vide
        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createBook = async (req, res) => {
    try {
        // Pour le moment, on simule la création
        res.status(201).json({ message: "Livre créé !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const modifyBook = async (req, res) => {
    try {
        // Pour le moment, on simule la modification
        res.status(200).json({ message: "Livre modifié !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        // Pour le moment, on simule la suppression
        res.status(200).json({ message: "Livre supprimé !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

    
export const getBestRatingsBook = async (req, res) => {
    try {
        // Pour le moment, on renvoie un tableau exemple
        res.status(200).json([
            { id: 1, title: "Livre 1", rating: 4.5 },
            { id: 2, title: "Livre 2", rating: 4.8 }
        ]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Note un livre
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const rateBook = async (req, res) => {
    try {
        // Pour le moment, on simule l'ajout d'une note
        res.status(201).json({
            message: "Note ajoutée !",
            rating: {
                bookId: req.params.id,
                userId: req.auth.userId,
                grade: req.body.rating
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
