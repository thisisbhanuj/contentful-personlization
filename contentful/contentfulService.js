const { createClient } = require('contentful-management');
const config = require('../config/config');

// Initialize Contentful Client
const client = createClient({
  accessToken: config.contentful.apiKey,
});

const updateContent = async (payload) => {
  const { entryId, fields } = payload;

  // Fetch Space and Environment
  const space = await client.getSpace(config.contentful.spaceId);
  const environment = await space.getEnvironment(config.contentful.environment);

  // Fetch Entry
  const entry = await environment.getEntry(entryId);

  // Update Fields Dynamically
  for (const [key, value] of Object.entries(fields)) {
    entry.fields[key] = { 'en-US': value }; // Assuming 'en-US' locale
  }

  // Save and Publish Entry
  const updatedEntry = await entry.update();
  await updatedEntry.publish();

  console.log(`Entry ${entryId} updated successfully!`);
};

module.exports = { updateContent };
