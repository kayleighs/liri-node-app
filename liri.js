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
//console.log(term)
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
        if (!term) {
            term = "Shawn Mendes"
        }
        logTerm(term)
        concertThis(term);
        break;
    case "spotify-this-song":
        if(!term) {
            term = "The Sign by the Ace of Base"
        }
        logTerm(term)
        spotifyThis(term);
        break;
    case "movie-this":
        if (!term) {
            term = "Mr. Nobody"
        }
        logTerm(term)
        movieThis(term);
        break;
    case "do-what-it-says":
        doThis();
        break;
    default:
        console.log("Please enter a command: concert-this, spotify-this-song, movie-this, or , do-what-it-says")
}
// Function to Append to Log
function logData(info) {
    console.log(info + divider);
    fs.appendFile("log.txt", info + divider, function (err) {
        if (err) throw err;
    });
};
function logTerm(term){
    console.log("\nSearched for..." + term + "\n\n")
    fs.appendFile("log.txt", "\nSearched for..." + term + "\n\n", function (err) {
        if (err) throw err;
    });
};


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
            logData(songData)
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
        logData(bandData)
   //  console.log(bandData)
     }
     
    })
    .catch (function (error) {
        console.log(error);
    })
    .then(function () {
        // always executed
    });  
};
//movie-this
function movieThis(movieTitle) {
    var mKey= keys.movies
    var URL = "http://www.omdbapi.com/?t=" + movieTitle + "&apikey=" + mKey
    axios.get(URL).then(function(response){
        var jsonData =  response.data
     //   console.log(jsonData)
        var title = jsonData.Title
        var year = jsonData.Year
        var rating = jsonData.imdbRating
        var rtRating = jsonData.Ratings[1]
        var country = jsonData.Country
        var language = jsonData.Language
        var plot = jsonData.Plot
        var actors = jsonData.Actors

        var movieData = [
        "Title: " + title,
        "Year: " + year,
        "IMBD Rating: " + rating,
        "Rotten Tomatoes Rating: " + rtRating,
        "Country: " + country,
        "Language: " + language,
        "Plot: " + plot,
        "Actors: " + actors
        ].join("\n\n")
        
        logData(movieData)

    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
        // always executed
    });  
}


//do-what-it-says
function doThis(){
    fs.readFile("random.txt", "utf8", function(error,data){
        if (error) {
            return console.log(error)
        }
        var dataArr = data.split(",");
  //      console.log(dataArr)
        var thisSong = dataArr[1]
        var thisConcert = dataArr[3]
        var thisMovie = dataArr[5]
  //      console.log(thisConcert)
        logTerm(thisSong);
        spotifyThis(thisSong);

        logTerm(thisConcert)
        concertThis(thisConcert);

        logTerm(thisMovie)
        movieThis(thisMovie);
    })

}