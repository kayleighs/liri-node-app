//Requires
require("dotenv").config();
var inquirer = require("inquirer")
var moment = require('moment');
moment().format();
const axios = require('axios');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require('fs');


var divider = "\n-------------------------------------------------------------------\n";


//Process.argv to take in user commands
var command = process.argv[2];
var term = process.argv.slice(3).join(" ");
console.log(term)
/* var userInput = "";
var nodeArgv= process.argv;

for (let i=3; nodeArgv.length; i+=1){
    if (i ===3){
        userInput= userInput + nodeArgv[i];
    }
    else {
        userInput = userInput + "+" + nodeArgv[i]
    }
}
 */
//User commands
switch(command) {
    case"concert-this":
        concertThis(term);
        break;
    case "spotify-this-song":
        if(!term) {
            term = "The Sign by the Ace of Base"
        }
        spotifyThis(term);
        break;
    case "movie-this":
        movieThis(term);
        break;
    case "do-what-it-says":
        doThis();
        break;
    default:
        console.log("Please enter a command: concert-this, spotify-this-song, movie-this, or , do-what-it-says")
}

//Spotify

function spotifyThis(term){
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: term ,limit: 5 }).then(function(response) {
     //   console.log(response);
        var songs = response.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            var resultNum = i + 1;
            var name = songs[i].name;
            var artist = songs[i].artists[0].name;
            var preview = songs[i].preview_url;
            var album = songs[i].album.name;

            var songData = [
                "Result No. " +resultNum,
                "Name: " + name,
                "Artist(s): " + artist,
                "Preview: " + preview,
                "Album: " + album
            ].join("\n\n")
            console.log(songData + divider)
        };
  })
  .catch(function(err) {
    console.log(err);
  });
};

//concert-this
function concertThis(artist) {
    var bKey=keys.bands
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bKey
    
    axios.get(URL).then(function(response){
        var jsonData = response.data
     //   console.log(jsonData)
     for (var i=0; i < 5; i++){

        var resultNum= i + 1;
        var name = jsonData[i].venue.name
         var venueLocation = jsonData[i].venue.city + ", " + jsonData[i].venue.region + ", " + jsonData[i].venue.country
        var date = moment(jsonData[i].datetime).format("MM/DD/YYYY")

        var bandData = [
            "Result No. " + resultNum,
            "Venue: " + name,
            "Location: " + venueLocation,
            "Date: " + date
        ].join("\n\n")
        console.log(bandData +divider)
     }
    });
};
//movie-this

//do-what-it-says