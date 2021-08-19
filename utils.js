//This file defines commonly used components to cut down on code reuse
const got = require('got');

const servers = [
	"connery",
    "miller",
    "cobalt",
    "emerald",
	"jaegar",
    "soltech",
    "genudine",
    "ceres"
]

const serversNoJaegar = [
	"connery",
    "miller",
    "cobalt",
    "emerald",
    "soltech",
    "genudine",
    "ceres"
]

const continents = [
	"Indar",
	"Hossin",
	"Amerish",
	"Esamir"
]

const serverNames = {
	1: "Connery",
	10: "Miller",
	13: "Cobalt",
	17: "Emerald",
	19: "Jaegar",
	40: "SolTech",
	1000: "Genudine",
	2000: "Ceres"
}

const serverIDs = {
    "connery": 1,
    "miller": 10,
    "cobalt": 13,
    "emerald": 17,
    "jaegar": 19,
    "soltech": 40,
    "genudine": 1000,
    "ceres": 2000
}

function badQuery(input){
	// This is its own function so a single list of disallowed characters can be maintained
	return input.match(/[<@>!+&?%*#$^()_:/\\,`~[\]{}|+=]/g);
}

async function censusRequest(platform, key, extension){
	// Places boilerplate error checking in one location and standardizes it
	// Allows for easily changing https to http if there is an error
	const uri = `https://census.daybreakgames.com/s:${process.env.serviceID}/get/${platform}/${extension}`;
	try{
		const response = await got(uri).json();
		if(typeof(response.error) !== 'undefined'){
			if(response.error == 'service_unavailable'){
				throw "Census API currently unavailable";
			}
			if(typeof(response.error) === 'string'){
				throw `Census API error: ${response.error}`;
			}
			throw response.error;
		}
		if(typeof(response.errorCode) !== 'undefined'){
			throw `Census API error: ${response.errorCode}`;
		}
		if(typeof(response[key]) === 'undefined'){
			throw "Census API Error: undefined response";
		}
		return response[key];
	}
	catch(err){
		if(typeof(err) == 'string'){
			throw err;
		}
		if(err.message.indexOf('404') > -1){
            throw "API Unreachable";
        }
		throw err;
	}
}

module.exports = {
	servers: servers,
	serversNoJaegar: serversNoJaegar,
	continents: continents,
	serverNames: serverNames,
	serverIDs: serverIDs,
	badQuery: badQuery,
	censusRequest: censusRequest
}