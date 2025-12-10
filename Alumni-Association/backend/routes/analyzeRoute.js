const express = require('express');
const { analyzeMessage } = require('../ai/analyzeMessage');

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { message } = req.body;
    const aiResult = await analyzeMessage(message);
    res.json({ analysis: aiResult });
  } catch (error) {
    res.status(500).json({ error: 'AI processing failed' });
  }
});

module.exports = router;