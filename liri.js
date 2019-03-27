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
        getConcert(name);
        break;

    case "spotify-this-song":
        break;

    case "movie-this":
        break;

    case "do-what-it-says":
        break;
    default:
        break;
}

function getConcert(artistName) {
    if(artistName) {
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
    } else {
        console.log("Please provide an artist name");
    }
}