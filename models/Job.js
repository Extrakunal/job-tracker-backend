const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  salary: {
    type: Number
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
});

module.exports = mongoose.model('Job', jobSchema);