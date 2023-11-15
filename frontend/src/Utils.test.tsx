import { getUserDetails } from "./Utils";
import fetchMock from 'jest-fetch-mock';

// Mock the fetch function using jest-fetch-mock
fetchMock.enableMocks();

describe('getUserDetails', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('fetches user details and returns the JSON', async () => {
    const userDetails = {
      has_data: true,
      profile_picture: "e97zaodzgk7c9c4fhzizj4czg-1699552391.533749.jpg",
      spotifyUserId: "e97zaodzgk7c9c4fhzizj4czg",
      status: "successful",
      username: "Niko"
    };

    // Mock the fetch function to return a response
    fetchMock.mockResponseOnce(JSON.stringify(userDetails));

    const result = await getUserDetails();

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_PYTHONHOST}/api/user_details`,
      {
        credentials: 'include',
      }
    );

    expect(result).toEqual(userDetails);
  });

  it('handles fetch error', async () => {
    // Mock the fetch function to throw an error
    fetchMock.mockReject(new Error('Network error'));

    await expect(getUserDetails()).rejects.toThrow('Network error');
  });
});
