# LIRI Bot
LIRI is a _Language Interpretation and Recognition Interface_. This is a command line node app that can give you a list of concerts based on an artist name, details on a song, or details about a movie.

## Installation
After cloning this repo, run:
```console
npm install
```

Next, create a file named `.env`. Add the following to it and replace the values with your Spotify API keys:
```js
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret
```

## Usage
![usage](images/usage-example.png)


### concert-this
Get a list of concerts for the artist "Slayer":  
![concert](images/concert-example.png)


### spotify-this-song
Get details for the song "Penny Lane":  
![spotify](images/spotify-example.png)


### movie-this
Get details for the movie "The Matrix":  
![movie](images/movie-example.png)
