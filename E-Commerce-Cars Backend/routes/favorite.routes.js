import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { validateDTO } from '../middlewares/validation.middleware.js';
import { FavoriteRequestDTO } from '../dtos/favorite.dto.js';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favorites.controller.js';

const router = express.Router();

router.post('/', protect, validateDTO(FavoriteRequestDTO), addFavorite);
router.get('/', protect, getFavorites);
router.delete('/:id', protect, removeFavorite);

export default router;