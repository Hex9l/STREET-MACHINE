import express from 'express';
import { getVehicles, getVehicleById, createVehicle, deleteVehicle, updateVehicle } from '../controllers/vehicleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';

const router = express.Router();

const upload = multer({ storage });

router.route('/')
  .get(getVehicles)
  .post(protect, admin, upload.array('images'), createVehicle);

router.route('/:id')
  .get(getVehicleById)
  .delete(protect, admin, deleteVehicle)
  .put(protect, admin, upload.array('images'), updateVehicle);

export default router;
