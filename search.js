"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var querystring_1 = __importDefault(require("querystring"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
var token = '';
var client_id = '6ae83de1596f4d19a67d3562c6d854bd';
var client_secret = '371e1b8a507d4f18ab2702105adfe476';
app.use(cors_1.default({
    origin: 'http://localhost:8080'
}));
app.use('/', express_1.default.static(__dirname + '/Frontend'));
app.get('/playlists', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var queryMood, queryLimit, response, playlists, _i, response_1, i, playlist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryMood = req.query.q;
                    queryLimit = req.query.limit;
                    return [4 /*yield*/, search(queryMood, parseInt(queryLimit), "playlist")];
                case 1:
                    response = _a.sent();
                    playlists = [];
                    for (_i = 0, response_1 = response; _i < response_1.length; _i++) {
                        i = response_1[_i];
                        playlist = {
                            name: i.name,
                            songCount: i.tracks.total,
                            internUrl: i.uri,
                            externUrl: i.external_urls.spotify,
                            coverImageUrl: i.images.map(function (b) {
                                return b.url;
                            })
                        };
                        playlists.push(playlist);
                    }
                    res.send(playlists);
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/tracks', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var queryMood, queryLimit, response, tracks, _i, response_2, i, track;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryMood = req.query.q;
                    queryLimit = req.query.limit;
                    return [4 /*yield*/, search(queryMood, parseInt(queryLimit), "track")];
                case 1:
                    response = _a.sent();
                    tracks = [];
                    for (_i = 0, response_2 = response; _i < response_2.length; _i++) {
                        i = response_2[_i];
                        track = {
                            name: i.name,
                            internUrl: i.uri,
                            externUrl: i.external_urls.spotify,
                            length: Math.round(i.duration_ms / 1000),
                            artist: i.artists.map(function (a) {
                                return a.name;
                            }).join(", ")
                        };
                        /*       for(const a of i.album.artists ){
                                   track.artist = track.artist + ", " + a.name
                               }*/
                        tracks.push(track);
                    }
                    res.send(tracks);
                    return [2 /*return*/];
            }
        });
    });
});
function search(queryMood, limit, type) {
    return __awaiter(this, void 0, void 0, function () {
        var searchResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (limit >= 50) {
                        limit = 50;
                    }
                    if (limit <= 0) {
                        limit = 20;
                    }
                    if (!Number.isInteger(limit)) {
                        console.log("You have to enter a number!!");
                        limit = 1;
                    }
                    return [4 /*yield*/, axios_1.default.get("https://api.spotify.com/v1/search?type=" + type + "&limit=" + limit + "&q=" + queryMood, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 1:
                    searchResponse = _a.sent();
                    return [2 /*return*/, searchResponse.data[type + "s"].items];
            }
        });
    });
}
function accessToken() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.post('https://accounts.spotify.com/api/token', querystring_1.default.stringify({
                        grant_type: 'client_credentials',
                        client_id: client_id,
                        client_secret: client_secret
                    }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })];
                case 1:
                    response = _a.sent();
                    setTimeout(function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, accessToken()];
                                    case 1:
                                        token = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }, (response.data.expires_in - 60) * 1000);
                    return [2 /*return*/, response.data.access_token];
            }
        });
    });
}
accessToken().then(function (t) { return token = t; });
app.listen(8080, function () {
    console.log('App is listening on port 8080');
});
