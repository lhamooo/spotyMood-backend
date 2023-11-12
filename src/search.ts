import axios from 'axios';
import { getAccessToken } from './token';

export async function search(queryMood: string, limit: number, type: string) {
  if (limit >= 50) {
    limit = 50;
  }
  if (limit <= 0) {
    limit = 20;
  }
  if (!Number.isInteger(limit)) {
    console.log('You have to enter a number!!');
    limit = 1;
  }

  const token = await getAccessToken();
  const searchResponse = await axios.get(
    `https://api.spotify.com/v1/search?type=${type}&limit=${limit}&q=${queryMood}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return searchResponse.data[`${type}s`].items;
}
