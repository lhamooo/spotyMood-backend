import axios from 'axios';
import qs from 'querystring';
import express from 'express';
import cors from 'cors';
import { findSourceMap } from "module";

const app: express.Application = express();

let token = '';
const client_id = '6ae83de1596f4d19a67d3562c6d854bd';
const client_secret = '371e1b8a507d4f18ab2702105adfe476';

type trackResponse = {
    name: string;
    artist: string;
    internUrl: string;
    externUrl: string;
    length: number;
}

type playlistResponse = {
    name: string;
    songCount: number;
    internUrl: string;
    externUrl: string;
    coverImageUrl: string
}

app.use(cors({
    origin: 'http://localhost:8080'
}))

app.use('/', express.static(__dirname + '/Frontend'))

app.get('/playlists', async function (req, res) {
    const queryMood = req.query.q as string;
    const queryLimit = req.query.limit as string;
    const response = await search(queryMood, parseInt(queryLimit), "playlist");
    const playlists = [];

    for (const i of response) {
        const playlist: playlistResponse = {
            name: i.name,
            songCount: i.tracks.total,
            internUrl: i.uri,
            externUrl: i.external_urls.spotify,
            coverImageUrl: i.images.map(function (b: { url: string }) {
                return b.url
            })
        }
        playlists.push(playlist);
    }
    res.send(playlists);
})


app.get('/tracks', async function (req, res) {
    const queryMood = req.query.q as string;
    const queryLimit = req.query.limit as string;
    const response = await search(queryMood, parseInt(queryLimit), "track");
    const tracks = [];

    for (const i of response) {
        const track: trackResponse = {
            name: i.name,
            internUrl: i.uri,
            externUrl: i.external_urls.spotify,
            length: Math.round(i.duration_ms / 1000),
            artist: i.artists.map(function (a: { name: string }) {
                return a.name
            }).join(", ")
        }
        /*       for(const a of i.album.artists ){
                   track.artist = track.artist + ", " + a.name
               }*/
        tracks.push(track);
    }
    res.send(tracks);
})

async function search(queryMood: string, limit: number, type: string) {

    if (limit >= 50) {
        limit = 50
    }
    if (limit <= 0) {
        limit = 20
    }
    if (!Number.isInteger(limit)) {
        console.log("You have to enter a number!!")
        limit = 1
    }

    const searchResponse = await axios.get(`https://api.spotify.com/v1/search?type=${type}&limit=${limit}&q=${queryMood}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return searchResponse.data[`${type}s`].items;
}

async function accessToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
        grant_type: 'client_credentials',
        client_id: client_id,
        client_secret: client_secret
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    setTimeout(async function () {
        token = await accessToken()
    }, (response.data.expires_in - 60) * 1000)

    return response.data.access_token
}

accessToken().then((t) => token = t)

app.listen(8080, function () {
    console.log('App is listening on port 8080');
})