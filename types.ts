export type TrackResponse = {
  name: string;
  artist: string;
  internUrl: string;
  externUrl: string;
  length: number;
};

export type PlaylistResponse = {
  name: string;
  songCount: number;
  internUrl: string;
  externUrl: string;
  coverImageUrl: string;
};

export type AccessToken = {
  token: string;
  expirationTimeMS: number;
};
