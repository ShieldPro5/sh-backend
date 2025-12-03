import Shipment from '../models/shipment.js';

// Get all shipments with pagination
export const getAllShipments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shipments = await Shipment.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    // Ensure "Delivered" step exists in progress array for all shipments
    for (let shipment of shipments) {
      if (shipment.progress && Array.isArray(shipment.progress)) {
        const hasDelivered = shipment.progress.some(step => step.title === "Delivered");
        if (!hasDelivered) {
          shipment.progress.push({
            title: "Delivered",
            description: "Package has been successfully delivered",
            location: shipment.destination,
            timestamp: shipment.status === "Delivered" ? new Date() : null,
            completed: shipment.status === "Delivered"
          });
          await shipment.save();
        }
      }
    }
    
    const total = await Shipment.countDocuments();

    res.json({
      shipments,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single shipment
export const getShipmentById = async (req, res) => {
  try {
    let shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    // Ensure "Delivered" step exists in progress array
    if (shipment.progress && Array.isArray(shipment.progress)) {
      const hasDelivered = shipment.progress.some(step => step.title === "Delivered");
      if (!hasDelivered) {
        shipment.progress.push({
          title: "Delivered",
          description: "Package has been successfully delivered",
          location: shipment.destination,
          timestamp: shipment.status === "Delivered" ? new Date() : null,
          completed: shipment.status === "Delivered"
        });
        await shipment.save();
      }
    }
    
    res.json({ shipment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Track shipment by tracking ID
export const trackShipment = async (req, res) => {
  try {
    const { trackingId } = req.params;
    let shipment = await Shipment.findOne({ tracking_id: trackingId });
    
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    // Ensure "Delivered" step exists in progress array
    if (shipment.progress && Array.isArray(shipment.progress)) {
      const hasDelivered = shipment.progress.some(step => step.title === "Delivered");
      if (!hasDelivered) {
        shipment.progress.push({
          title: "Delivered",
          description: "Package has been successfully delivered",
          location: shipment.destination,
          timestamp: shipment.status === "Delivered" ? new Date() : null,
          completed: shipment.status === "Delivered"
        });
        await shipment.save();
      }
    }
    
    res.json({ shipment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new shipment
export const createShipment = async (req, res) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.status(201).json({ shipment });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tracking ID already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Update shipment
export const updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    res.json({ shipment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete shipment
export const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    res.json({ message: 'Shipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get shipment statistics
export const getShipmentStats = async (req, res) => {
  try {
    const total = await Shipment.countDocuments();
    const inTransit = await Shipment.countDocuments({ status: 'In Transit' });
    const delivered = await Shipment.countDocuments({ status: 'Delivered' });
    const pending = await Shipment.countDocuments({ status: 'Pending' });
    const outForDelivery = await Shipment.countDocuments({ status: 'Out for Delivery' });
    const exception = await Shipment.countDocuments({ status: 'Exception' });
    const onHold = await Shipment.countDocuments({ status: 'On Hold' });
    
    const totalValue = await Shipment.aggregate([
      { $group: { _id: null, total: { $sum: '$shipment_value' } } }
    ]);
    
    const customsCleared = await Shipment.countDocuments({ customs_status: 'Cleared' });
    const customsOnHold = await Shipment.countDocuments({ customs_status: 'On Hold' });
    
    res.json({
      total,
      status: {
        inTransit,
        delivered,
        pending,
        outForDelivery,
        exception,
        onHold
      },
      customs: {
        cleared: customsCleared,
        onHold: customsOnHold
      },
      totalValue: totalValue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


