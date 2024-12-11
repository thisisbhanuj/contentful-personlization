require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  contentful: {
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    apiKey: process.env.CONTENTFUL_MANAGEMENT_API_KEY,
    apiHost: process.env.CONTENTFUL_MANAGEMENT_API_HOST
  },
};
