import { Router } from 'express';
import { search } from '../search';
import { PlaylistResponse, TrackResponse } from '../../types';

export function apiRouter() {
  const router = Router();

  router.get('/playlists', async function (req, res) {
    const queryMood = req.query.q as string;
    const queryLimit = req.query.limit as string;
    const response = await search(queryMood, parseInt(queryLimit), 'playlist');
    const playlists = [];

    for (const i of response) {
      const playlist: PlaylistResponse = {
        name: i.name,
        songCount: i.tracks.total,
        internUrl: i.uri,
        externUrl: i.external_urls.spotify,
        coverImageUrl: i.images.map(function (b: { url: string }) {
          return b.url;
        }),
      };
      playlists.push(playlist);
    }
    res.send(playlists);
  });

  router.get('/tracks', async function (req, res) {
    const queryMood = req.query.q as string;
    const queryLimit = req.query.limit as string;
    const tracksResponse = await search(queryMood, parseInt(queryLimit), 'track');
    const tracks: TrackResponse[] = tracksResponse.map((track: any) => {
      const durationInMs = track.duration_ms;
      const durationInSeconds = Math.round(durationInMs / 1000);
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;

      return {
        name: track.name,
        internUrl: track.uri,
        externUrl: track.external_urls.spotify,
        length: `${minutes} minutes ${seconds} seconds`,
        artist: track.artists.map((a: { name: string }) => a.name).join(', '),
      };
    });
    res.send(tracks);
  });

  return router;
}
