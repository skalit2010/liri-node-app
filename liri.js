require("dotenv").config();

// dependencies
var fs = require("fs");
var request = require("request");
var twitter = require("twitter"); 
var spotifyAPI = require("node-spotify-api");
var keys = require("./keys.js");

var nodeArgs = process.argv;
var command = process.argv[2];

var userInput = "";

function storeInput() {
	for (var i = 3; i < nodeArgs.length; i++) {
		userInput = userInput + " " + nodeArgs[i];
	}

	console.log("Searching for: " + userInput +"\n");
}

// call and return tweets
function myTweets() {
	var client = new twitter(keys.twitterKeys);

	var params = {screen_name: "placeholder"};

	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (!error) {
			tweets.forEach( function(element, index) {
				console.log( index+1 + ") You Tweeted - " + element.text);
				console.log("Date : " + element.created_at);
				console.log("-----------------------------------");
			});
			log(tweets) ;
		}
		else{
			console.log(error);
		}
	});

// spotify function 
function spotifyThisSong() {
	storeInput();

	var spotify = new spotifyAPI(keys.spotifyKeys);
	var query;

	// if the user provides a song, that song will be queried; otherwise, "The Sign" will be queried
	if (userInput !== "" && userInput !== null) {
		query = userInput;
	} else {
		query = "Fake Love";
	}

	spotify.search({type: "track", query: query}, function(err, data) {
  		if (err) {
    		return console.log("Error occurred: " + err);
  		}
		// console.log(JSON.stringify(data, null, 2)); 

		// logs to the terminal
		console.log("\nTHE SONG YOU REQUESTED:\n\n" + "Artist: " + data.tracks.items[0].album.artists[0].name + "\nSong: " + query + "\nAlbum: " + data.tracks.items[0].album.name + "\nPreview link: " + data.tracks.items[0].album.artists[0].external_urls.spotify + "\n---------------\n");

		// logs to the log.txt file
		fs.appendFile("log.txt", "\nTHE SONG YOU REQUESTED:\n\n" + "Artist: " + data.tracks.items[0].album.artists[0].name + "\nSong: " + query + "\nAlbum: " + data.tracks.items[0].album.name + "\nPreview link: " + data.tracks.items[0].album.artists[0].external_urls.spotify + "\n---------------\n", function(err) {

			if (err) {
				console.log(err);
			} else {
				console.log("Song added!");
			}
		});
	});
}

// function to call and return user's provided movie
function movieThis() {
	var movieName;
	storeInput();

	// if the user provides a movie name, that movie will be queried; otherwise, "Mr. Nobody" will be queried
	if (userInput !== "" && userInput !== null) {
		movieName = userInput;
	} else {
		movieName = "Mrs. Doubtfire";
	}

	var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	console.log(queryURL);

	request(queryURL, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			console.log(JSON.parse(body));


			console.log("\nTHE MOVIE YOU REQUESTED:\n\n" + "Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n---------------\n");

			// logs to the log.txt file
			fs.appendFile("log.txt", "\nTHE MOVIE YOU REQUESTED:\n\n" + "Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n---------------\n", function(err) {

				if (err) {
					console.log(err);
				} else {
					console.log("Movie added!");
				}
			});
		}
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log(err);
		}
		console.log(data);

		var dataArray = data.split(",");
		console.log(dataArray);

		
		command = dataArray[0];
		userInput = dataArray[1];

		switch (command) {
			case "my-tweets":
			myTweets();
			break;

			case "spotify-this-song":
			spotifyThisSong();
			break;

			case "movie-this":
			movieThis();
			break;
		}
	});
}

// a switch-case statement
switch (command) {
	case "my-tweets":
	myTweets();
	break;

	case "spotify-this-song":
	spotifyThisSong();
	break;

	case "movie-this":
	movieThis();
	break;

	case "do-what-it-says":
	doWhatItSays();
	break;
}
}
