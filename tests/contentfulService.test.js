const { updateContent } = require('../contentful/contentfulService');
const { createClient } = require('contentful-management');

// Mock contentful-management client
jest.mock('contentful-management', () => ({
  createClient: jest.fn(() => ({
    getSpace: jest.fn(() => ({
      getEnvironment: jest.fn(() => ({
        getEntry: jest.fn(() => ({
          update: jest.fn(() => ({
            publish: jest.fn(() => ({
              sys: { id: 'testEntry' }
            }))
          })),
          fields: {}
        }))
      }))
    }))
  }))
}));

// Mock configuration module (or mock environment variables)
jest.mock('../config/config', () => ({
  contentful: {
    apiKey: 'test-api-key',  // Mock API key
    spaceId: 'test-space-id', // Mock Space ID
    environment: 'master', // Mock Environment
  }
}));

describe('updateContent', () => {
  let mockClient;
  let mockSpace;
  let mockEnvironment;
  let mockEntry;

  beforeAll(() => {
    // Mocking contentful-management client methods
    mockEntry = {
      update: jest.fn().mockResolvedValue({
        fields: {},
      }),
      publish: jest.fn().mockResolvedValue({}),
      fields: {},
    };

    mockEnvironment = {
      getEntry: jest.fn().mockResolvedValue(mockEntry),
    };

    mockSpace = {
      getEnvironment: jest.fn().mockResolvedValue(mockEnvironment),
    };

    // Fix: Mock createClient properly to return the mockClient object
    mockClient = {
      getSpace: jest.fn().mockResolvedValue(mockSpace),
    };

    createClient.mockReturnValue(mockClient); // Ensure createClient uses mockClient
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should update and publish content entry', async () => {
    const payload = {
      entryId: 'test-entry-id',
      fields: {
        title: 'New Title',
        description: 'Updated Description',
      },
    };

    // Call the function under test
    await updateContent(payload);

    // Assert that the methods were called with the expected arguments
    expect(createClient).toHaveBeenCalledWith({
      accessToken: 'test-api-key', // This will be the mock value
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith('test-space-id'); // Mocked spaceId
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith('master'); // Mocked environment name
    expect(mockEnvironment.getEntry).toEqual(mockEntry);

    // Check that the fields are updated correctly
    expect(mockEntry.fields.title).toEqual({ 'en-US': 'New Title' });
    expect(mockEntry.fields.description).toEqual({ 'en-US': 'Updated Description' });
  });

  // ###############################################################
  // Add a test to verify that the entry is published after updating
  it('should handle errors when updating content', async () => {
    const payload = {
      entryId: 'test-entry-id',
      fields: {
        title: 'Error Title',
      },
    };

    // Simulate an error in the update function
    mockEntry.update.mockRejectedValue(new Error('Update failed'));

    await expect(updateContent(payload)).rejects.toThrow('Update failed');
    
    // Verify that update and publish were not called due to the error
    expect(mockEntry.update).toHaveBeenCalled();
    expect(mockEntry.publish).not.toHaveBeenCalled();
  });
});
