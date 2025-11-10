import express from 'express';
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from '../controllers/complaintController.js';

const router = express.Router();

router.get('/', getAllComplaints);
router.get('/:id', getComplaintById);
router.post('/', createComplaint);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

export default router;
