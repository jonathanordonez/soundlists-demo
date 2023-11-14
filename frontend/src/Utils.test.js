// Import the function to be tested
import { getUserDetails } from "./Utils"; // Replace 'yourModule' with the correct path to your module

// Mock the global fetch function
global.fetch = jest.fn();

describe('getUserDetails', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  it('fetches user details and returns the JSON', async () => {
    // Define a sample user details object
    const userDetails = { name: 'John', email: 'john@example.com' };

    // Mock the fetch function to return a response
    global.fetch.mockResolvedValue({
      json: async () => userDetails,
    });

    // Call the function
    const result = await getUserDetails();

    // Assert that fetch was called with the expected URL
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_PYTHONHOST}/api/user_details`,
      {
        credentials: 'include',
      }
    );

    // Assert that the function returns the expected JSON
    expect(result).toEqual(userDetails);
  });

  it('handles fetch error', async () => {
    // Mock the fetch function to throw an error
    global.fetch.mockRejectedValue(new Error('Network error'));

    // Call the function
    await expect(getUserDetails()).rejects.toThrow('Network error');
  });
});