const https = require("https");
const http = require("http");
const api = require("./api.json");

function printTemperature(zipCode, temperature){
	const message = `The current temperature in ${zipCode} is ${temperature}F`;
	console.log(message);
}

function printStatusCode(response){
	try{
		if (response.statusCode === 200) {
			console.log(response.statusCode);
			console.log(http.STATUS_CODES[response.statusCode]);
		} else if (response.statusCode === 404){
			console.error(response.statusCode);
			console.error(http.STATUS_CODES[response.statusCode]);
		}
	} catch (error){
		printError(error);
	}
}

function printError(error){
	console.error(error.message);
}

function get(zipCode){
	try{
		const request = https.get(`https://api.wunderground.com/api/${api.key}/geolookup/conditions/q/${zipCode}.json`, response => {
			printStatusCode(response);

			if(response.statusCode === 200){
				let responseBody = "";

				response.on('data', dataChunk => {
					responseBody += dataChunk;
				});

				response.on('end', () => {
					try{
						const weather = JSON.parse(responseBody);
						
						if(weather.location){
							printTemperature(weather.location.city, weather.current_observation.temp_f);
						} else{
							const invalidLocationError = new Error(`The location ${zipCode} could not be found.`);
							printError(invalidLocationError);
						}

					}catch (error){
						printError(error);
					}
					
				})

			} else{
				console.error(`Something went wrong with the request for zip code ${zipCode} [${response.statusCode}]`)
			}
		});
	} catch (error){
		printError(error);
	}
}

module.exports.get = get;