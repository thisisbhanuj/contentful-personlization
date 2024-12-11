// Validate Incoming Payload
const validatePayload = (req, res, next) => {
    const { entryId, fields } = req.body;
    if (!entryId || !fields) {
      return res.status(400).json({ error: 'Invalid payload. "entryId" and "fields" are required.' });
    }
    next();
};

// Error Handling Middleware
const handleError = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
};
  
module.exports = { validatePayload, handleError };
