const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String }, // e.g., 'stock_mismatch'
  centre_id: { type: String },
  centre_vaccine_id: { type: String },
  requested_stock_amount: { type: Number },
  delivered_stock_amount: { type: Number },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  recipients: [{ type: String, required: true }], // list of authority emails
  created_at: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;