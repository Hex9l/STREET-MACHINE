import express from 'express';
import { getGalleryImages } from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', getGalleryImages);

export default router;
