const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { handleError } = require('./middleware/middleware');
const config = require('./config/config');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/personalize', routes);

// Error Handling Middleware
app.use(handleError);

// Start Server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
