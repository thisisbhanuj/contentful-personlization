// Import the service to be tested
const { updateContent } = require('../contentful/contentfulService');
const contentfulManagement = require('contentful-management');

// Mock Contentful Management client
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

describe('updateContent', () => {
  it('should update and publish the entry successfully', async () => {
    const payload = {
      entryId: 'testEntry',
      fields: {
        title: 'Updated Title',
      }
    };

    await updateContent(payload);

    const clientMock = contentfulManagement.createClient();
    const spaceMock = await clientMock.getSpace();
    const environmentMock = await spaceMock.getEnvironment();
    const entryMock = await environmentMock.getEntry(payload.entryId);

    // Assertions
    expect(clientMock.getSpace).toHaveBeenCalled();
    expect(spaceMock.getEnvironment).toHaveBeenCalled();
    expect(environmentMock.getEntry).toHaveBeenCalledWith(payload.entryId);
    expect(entryMock.update).toHaveBeenCalled();
    expect(entryMock.publish).toHaveBeenCalled();
  });
});
