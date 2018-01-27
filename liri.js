let dataKeys = require("./keys.js");
let fs = require('fs');
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require('request');


const writeToLogText = function(data) {
  	fs.appendFile("log.txt", '\r\n\r\n');

  	fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    	if (err) {
      		return console.log(err);
    	}

    	console.log("log.txt was updated!");
  	});
}

//Creates a function for finding artist name from spotify
const getArtistNames = function(artist) {
  	return artist.name;
};

//Function for finding songs on Spotify
const getSpotifyData = function(songName) {
	const spotify = new Spotify(dataKeys.spotifyKeys);
  	//If it doesn't find a song, find The Sign by Ace of Base
  	if (!songName) {
    	songName = 'The Sign';
  	};

  	spotify.search({ type: 'track', query: songName }, function(err, data) {
	    if (err) {
	      	console.log('Error occurred: ' + err);
	      	return;
	    }

    	const songs = data.tracks.items;
    	const spotifyData = []; //empty array to hold spotify data

    	for (let i = 0; i < songs.length; i++) {
      		spotifyData.push({
		        'artist(s)': songs[i].artists.map(getArtistNames),
		        'song name: ': songs[i].name,
		        'preview song: ': songs[i].preview_url,
		        'album: ': songs[i].album.name,
	      	});
		}
    	console.log(spotifyData);
    	writeToLogText(spotifyData);
  	});
};


const getTweets = function() {
  	const twitterClient = new Twitter(dataKeys.twitterKeys);
  	console.log(dataKeys.twitterKeys);

  	const params = { screen_name: 'ednas', count: 10 };

  	twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {

	    if (!error) {
	      	const twitterData = []; //empty array to hold twitter data
	      	for (let i = 0; i < tweets.length; i++) {
		        twitterData.push({
		            'created at: ' : tweets[i].created_at,
		            'Tweets: ' : tweets[i].text,
		        });
	      	}
	      	console.log(twitterData);
	      	writeToLogText(twitterData);
	    }
  	});
};

const getMovieData = function(movieName) {

  	if (!movieName) {
    	movieName = 'Mr Nobody';
  	}

  	const urlHit = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  	request(urlHit, function(error, response, body) {
    	if (!error && response.statusCode == 200) {
      		const movieData = [];
      		const jsonData = JSON.parse(body);

      		movieData.push({
		      	'Title: ' : jsonData.Title,
		      	'Year Released: ' : jsonData.Year,
		      	'IMDB Rating: ' : jsonData.imdbRating,
		      	'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
		      	'Country Produced: ' : jsonData.Country,
		      	'Language: ' : jsonData.Language,
		      	'Plot: ' : jsonData.Plot,
		      	'Actors: ' : jsonData.Actors,
  			});
      		console.log(movieData);
      		writeToLogText(movieData);
		}
  	});
}

const doWhatItSays = function() {
  	fs.readFile("log.txt", "utf8", function(error, data) {
	    console.log(data);
	    writeToLogText(data);
	    const dataArr = data.split(',')

	    if (dataArr.length == 2) {
	      	pick(dataArr[0], dataArr[1]);
	    } 
	    else if (dataArr.length == 1) {
	      	pick(dataArr[0]);
	    }

  	});
}

const pick = function(caseData, functionData) {
  	switch (caseData) {
	    case 'my-tweets':
	      	getTweets();
	      	break;
	    case 'spotify-this-song':
	      	getSpotifyData(functionData);
	      	break;
	    case 'movie-this':
	      	getMovieData(functionData);
	      	break;
	    case 'do-what-it-says':
	      	doWhatItSays();
	      	break;
	    default:
	      	console.log(`LIRI doesn't know that`);
  	}
}

//run this on load of js file
const runThis = function(argOne, argTwo) {
  	pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);