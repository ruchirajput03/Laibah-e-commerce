import express from 'express';
import Variation from '../models/Variation.js';

const router = express.Router();

// Get all variations
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    
    const variations = await Variation.find(query).sort({ type: 1, name: 1 });
    res.json(variations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create variation
router.post('/', async (req, res) => {
  try {
    const variation = new Variation(req.body);
    await variation.save();
    res.status(201).json(variation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating variation', error: error.message });
  }
});

// Update variation
router.put('/:id', async (req, res) => {
  try {
    const variation = await Variation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!variation) {
      return res.status(404).json({ message: 'Variation not found' });
    }

    res.json(variation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating variation', error: error.message });
  }
});

// Delete variation
router.delete('/:id', async (req, res) => {
  try {
    const variation = await Variation.findByIdAndDelete(req.params.id);
    if (!variation) {
      return res.status(404).json({ message: 'Variation not found' });
    }
    res.json({ message: 'Variation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;