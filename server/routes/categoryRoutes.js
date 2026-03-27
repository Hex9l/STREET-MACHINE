import express from 'express';
import { getAllCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getAllCategories)
    .post(protect, admin, createCategory);

router.route('/:id')
    .delete(protect, admin, deleteCategory);

export default router;
