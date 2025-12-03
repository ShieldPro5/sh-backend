import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  tracking_id: { type: String, required: true, unique: true },
  service_type: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  estimated_delivery: { type: Date, required: true },
  shipment_value: { type: Number, required: true },
  current_location: { type: String, required: true },
  customs_status: { type: String, enum: ['Cleared', 'On Hold', 'Pending', 'Under Review', 'Rejected'], default: 'On Hold' },
  status: { 
    type: String, 
    enum: ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Exception', 'On Hold', 'Returned'], 
    default: 'In Transit' 
  },
  progress: [{
    title: String,
    description: String,
    location: String,
    timestamp: Date,
    completed: Boolean
  }],
  // Additional shipment details
  recipient_name: String,
  recipient_phone: String,
  recipient_email: String,
  sender_name: String,
  sender_phone: String,
  sender_email: String,
  package_weight: Number,
  package_dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'inches' }
  },
  package_type: { type: String, enum: ['Package', 'Envelope', 'Pallet', 'Freight'], default: 'Package' },
  shipping_date: Date,
  delivery_date: Date,
  delivery_signature: String,
  delivery_notes: String,
  insurance_value: Number,
  declared_value: Number,
  currency: { type: String, default: 'USD' },
  special_instructions: String,
  delivery_attempts: { type: Number, default: 0 },
  last_update: Date,
  delivered_at: { type: String },
  outDelivered_at: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;



