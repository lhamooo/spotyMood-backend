import axios from 'axios';
import * as qs from 'querystring';
import { AccessToken } from '../types';

const client_id = '6ae83de1596f4d19a67d3562c6d854bd';
const client_secret = '371e1b8a507d4f18ab2702105adfe476';

let accessToken: AccessToken | null = null;

export async function getAccessToken() {
  // check if token is still valid
  if (accessToken && accessToken.expirationTimeMS < Date.now()) {
    return accessToken.token;
  } else {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'client_credentials',
        client_id,
        client_secret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    /* 
    - update access token
      expirationTimeMS is set to the current date in ms + the time it takes before the token expires.
      This way, expirationTimeMS is exactly the date when the token won't be valid anymore
    */
    accessToken = {
      token: response.data.access_token,
      expirationTimeMS: Date.now() + response.data.expires_in * 1000,
    };

    return response.data.access_token;
  }
}
