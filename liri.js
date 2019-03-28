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
            getSong(name);
        } else {
            getSong("The Sign Ace of Base");
        }
        break;

    case "movie-this":
        if(name) {
            getMovie(name);
        } else {
            getMovie("Mr. Nobody");
        }
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

function getSong(songName) {
    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if(err) {
            return console.log("Error occurred: " + err);
        }

        const songInfo = data.tracks.items[0];
        if(songInfo) {
            let artists = songInfo.artists.map(artist => artist.name).slice(0).join(", ");
            
            console.log("Artist: " + artists);
            console.log("Song: " + songInfo.name);
            console.log("Album: " + songInfo.album.name);
            console.log("Preview Link: " + songInfo.external_urls.spotify);
        } else {
            console.log("Could not find song info for: " + songName);
        }
    });
}

function getMovie(movieName) {
    const queryUrl = "https://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(function(response) {
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.Ratings.find(rating => rating.Source === "Internet Movie Database").Value);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings.find(rating => rating.Source === "Rotten Tomatoes").Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Actors: " + response.data.Actors);
    })
}