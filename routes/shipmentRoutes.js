import express from 'express';
import {
  getAllShipments,
  getShipmentById,
  trackShipment,
  createShipment,
  updateShipment,
  deleteShipment,
  getShipmentStats,
} from '../controllers/shipmentController.js';

const router = express.Router();

router.get('/stats', getShipmentStats);
router.get('/', getAllShipments);
router.get('/track/:trackingId', trackShipment);
router.get('/:id', getShipmentById);
router.post('/', createShipment);
router.put('/:id', updateShipment);
router.patch('/:id', updateShipment);
router.delete('/:id', deleteShipment);

export default router;



