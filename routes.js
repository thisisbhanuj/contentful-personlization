const express = require('express');
const { validatePayload } = require('./middleware/middleware');
const { updateContent } = require('./contentful/contentfulService');

const router = express.Router();

// Webhook Endpoint
router.patch('/', validatePayload, async (req, res, next) => {
  try {
    const payload = req.body;
    await updateContent(payload);
    res.status(200).json({ message: 'Content Updated Successfully!' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
