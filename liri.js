// Require package statements
const axios = require("axios");
const chalk = require("chalk");
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
            return console.log(chalk.red("Error occurred: " + err));
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
                console.log(chalk.red("Please provide an artist name"));
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
            console.log(chalk.blue(`
Usage:    node liri concert-this <artist name>
          node liri spotify-this-song <song name>
          node liri movie-this <movie name>

Examples: node liri concert-this Slayer
          node liri spotify-this-song Penny Lane
          node liri movie-this The Matrix
            `))
            break;
    }
}

function getConcert(artistName) {
    // Query Bandsintown with the artist name
    const queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(function(response) {
        // Log each event
        console.log();
        response.data.forEach(event => {
            // Log venue name
            console.log(chalk.green("Venue: ") + chalk.yellow(event.venue.name));

            if(event.venue.region) {
                // Log city, region(state), and country 
                console.log(chalk.green("Location: ") + chalk.yellow(event.venue.city + ", " + event.venue.region + ", " + event.venue.country));
            } else {
                // Only log city and country - omit region if it is missing
                console.log(chalk.green("Location: ") + chalk.yellow(event.venue.city + ", " + event.venue.country));
            }

            // Log the date of the concert
            console.log(chalk.green("Date: ") + chalk.yellow(moment(event.datetime).format("MM/DD/YYYY")));
            console.log();
        });
    });
}

function getSong(songName) {
    // Get song info from Spotify
    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if(err) {
            return console.log(chalk.red("Error occurred: " + err));
        }

        // Only look at the first result
        const songInfo = data.tracks.items[0];

        // Check if Spotify found a song
        if(songInfo) {
            // Convert array of objects to string of object names containing comma seperated artist names
            //  incase there were multiple artists for the song
            let artists = songInfo.artists.map(artist => artist.name).slice(0).join(", ");
            
            // Log the song info
            console.log();
            console.log(chalk.green("Artist: ") + chalk.yellow(artists));
            console.log(chalk.green("Song: ") + chalk.yellow(songInfo.name));
            console.log(chalk.green("Album: ") + chalk.yellow(songInfo.album.name));
            console.log(chalk.green("Preview Link: ") + chalk.yellow(songInfo.external_urls.spotify));
            console.log();
        } else {
            console.log();
            console.log(chalk.red("Could not find song info for: " + songName));
            console.log();
        }
    });
}

function getMovie(movieName) {
    // Query movie info from OMDb
    const queryUrl = "https://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(function(response) {
        // Log the Title and Year
        console.log();
        console.log(chalk.green("Title: ") + chalk.yellow(response.data.Title));
        console.log(chalk.green("Release Year: ") + chalk.yellow(response.data.Year));

        // Ratings are an array of objects - find the object with the matching Source name
        console.log(chalk.green("IMDB Rating: ") + chalk.yellow(response.data.Ratings.find(rating => rating.Source === "Internet Movie Database").Value));
        console.log(chalk.green("Rotten Tomatoes Rating: ") + chalk.yellow(response.data.Ratings.find(rating => rating.Source === "Rotten Tomatoes").Value));

        // Log the Country, Language, and Actors list
        console.log(chalk.green("Country: ") + chalk.yellow(response.data.Country));
        console.log(chalk.green("Language: ") + chalk.yellow(response.data.Language));
        console.log(chalk.green("Actors: ") + chalk.yellow(response.data.Actors));
        console.log();
    });
}