// Require package statements
require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

const cmd = process.argv[2];
const name = process.argv.slice(3).join(" ");

switch(cmd) {
    case "concert-this":
        if(name) {
            getConcert(name);
        } else {
            console.log("Please provide an artist name");
        }
        break;

    case "spotify-this-song":
        if(name) {
            getSongInfo(name);
        } else {
            getSongInfo("The Sign Ace of Base");
        }
        break;

    case "movie-this":
        break;

    case "do-what-it-says":
        break;
    default:
        break;
}

function getConcert(artistName) {
    const queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(function(response) {
        response.data.forEach(event => {
            console.log("Venue: " + event.venue.name);

            if(event.venue.region) {
                console.log("Location: " + event.venue.city + ", " + event.venue.region + ", " + event.venue.country);
            } else {
                console.log("Location: " + event.venue.city + ", " + event.venue.country);
            }
            console.log("Date: " + moment(event.datetime).format("MM/DD/YYYY"));
            console.log();
        });
    });
}

function getSongInfo(songName) {
    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if(err) {
            return console.log("Error occurred: " + err);
        }

        const songInfo = data.tracks.items[0];
        if(songInfo) {
            let artists = songInfo.artists[0].name;
            for(let i = 1; i < songInfo.artists.length; i++) {
                artists += ", " + songInfo.artists[i].name;
            }
            
            console.log("Artist: " + artists);
            console.log("Song: " + songInfo.name);
            console.log("Album: " + songInfo.album.name);
            console.log("Preview link: " + songInfo.external_urls.spotify);
        } else {
            console.log("Could not find song info for: " + songName);
        }
    });
}