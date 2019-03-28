// Require package statements
const axios = require("axios");
require("dotenv").config();
const fs = require("fs");
const moment = require("moment");
const Spotify = require("node-spotify-api");

// Get keys for Spotify
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);

// Get command line arguments
const cmd = process.argv[2];
const name = process.argv.slice(3).join(" ");

// Check if "do-what-it-says" command was entered
if(cmd === "do-what-it-says") {
    // Read the command from file
    fs.readFile("random.txt", "utf8", function(err, data) {
        if(err) {
            return console.log("Error occurred: " + err);
        }

        // Split command and name by comma
        const command = data.split(",");
        processCommand(command[0], command[1]);
    });
} else {
    processCommand(cmd, name);
}

function processCommand(cmd, name) {
    switch(cmd) {
        // Get concert information from Bandsintown
        case "concert-this":
            if(name) {
                getConcert(name);
            } else {
                console.log("Please provide an artist name");
            }
            break;
        
        // Get song information from Spotify
        case "spotify-this-song":
            if(name) {
                getSong(name);
            } else {
                getSong("The Sign Ace of Base");
            }
            break;
    
        // Get movie information for OMDb
        case "movie-this":
            if(name) {
                getMovie(name);
            } else {
                getMovie("Mr. Nobody");
            }
            break;
        
        default:
            break;
    }
}

function getConcert(artistName) {
    // Query Bandsintown with the artist name
    const queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(function(response) {
        // Log each event
        response.data.forEach(event => {
            // Log venue name 
            console.log("Venue: " + event.venue.name);

            if(event.venue.region) {
                // Log city, region(state), and country 
                console.log("Location: " + event.venue.city + ", " + event.venue.region + ", " + event.venue.country);
            } else {
                // Only log city and country - omit region if it is missing
                console.log("Location: " + event.venue.city + ", " + event.venue.country);
            }

            // Log the date of the concert
            console.log("Date: " + moment(event.datetime).format("MM/DD/YYYY"));
            console.log();
        });
    });
}

function getSong(songName) {
    // Get song info from Spotify
    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if(err) {
            return console.log("Error occurred: " + err);
        }

        // Only look at the first result
        const songInfo = data.tracks.items[0];

        // Check if Spotify found a song
        if(songInfo) {
            // Convert array of objects to string of object names containing comma seperated artist names
            //  incase there were multiple artists for the song
            let artists = songInfo.artists.map(artist => artist.name).slice(0).join(", ");
            
            // Log the song info
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
    // Query movie info from OMDb
    const queryUrl = "https://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(function(response) {
        // Log the Title and Year
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);

        // Ratings are an array of objects - find the object with the matching Source name
        console.log("IMDB Rating: " + response.data.Ratings.find(rating => rating.Source === "Internet Movie Database").Value);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings.find(rating => rating.Source === "Rotten Tomatoes").Value);

        // Log the Country, Language, and Actors list
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Actors: " + response.data.Actors);
    })
}