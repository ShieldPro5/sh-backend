import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  country: { type: String },
  currency: { type: String },
  scam_type: { type: String, enum: ['crypto', 'transaction', 'gift_card', 'other'], required: true },
  description: { type: String, required: true },
  amount_lost: { type: Number },
  status: { type: String, enum: ['pending', 'in_review', 'resolved', 'closed'], default: 'pending' },
  admin_notes: { type: String },
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
