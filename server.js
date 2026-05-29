const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');
const authMiddleware = require('./middleware/auth');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('DB error:', err));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running!' });
});

app.post('/jobs',authMiddleware, async (req, res) => {
  try {
    const job = new Job({ ...req.body, userId: req.user.id });
    await job.save();
    res.json({ message: 'Job added!', job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/jobs',authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/jobs/:id', authMiddleware,async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Job updated!', job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/jobs/:id', authMiddleware,async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));