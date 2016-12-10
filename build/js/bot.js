const url_begin = "http://api.openweathermap.org/data/2.5/weather?q="
const url_end = "&lang=pl&APPID=9d3cb30f7741b980a410eee17b5f26c7&units=metric";

// Create our RiveScript interpreter.
let rs = new RiveScript({
	debug:   false,
	onDebug: onDebug,
	utf8: true
});

rs.unicodePunctuation = new RegExp(/[.,!?;:]/g);

rs.loadFile([
	"resources/brain/brain.rive",
	"resources/brain/questions_to_bot.rive",
	"resources/brain/topics.rive",
	"resources/brain/weather.rive",
	"resources/brain/global.rive",
], on_load_success, on_load_error);


var getWeather = function(location,result){
	
	let weather_location = location
	let url = url_begin + weather_location + url_end;

	return new rs.Promise(function (resolve, reject) {
		qwest.get(url, {}, {
	        dataType: 'json',
	        cache: true,
	    })
	    .then(function(xhr, data) {
	    	const weather_icon = data['weather'][0]['icon']

	    	if(result == "clouds")
	    		resolve(data['clouds']['all'])
	    	else if(result == "pressure")
	    		resolve(data['main']['pressure'])
	    	else if(result == "temp")
	    		resolve(data['main']['temp']+"&deg;C")
	    	else 
	    		resolve(data['weather'][0]['description']+"<img class='weather_icon' src=http://openweathermap.org/img/w/"+weather_icon+".png>")
	    })
	});
}

// clouds query
rs.setSubroutine("clouds",function(rs,args){
	return getWeather(args.join(' '),"clouds")
});

// pressure query
rs.setSubroutine("pressure",function(rs,args){
	return getWeather(args.join(' '),"pressure")
});

// weather query
rs.setSubroutine("weather",function(rs,args){
	return getWeather(args.join(' '),"weather")
});

// temp query
rs.setSubroutine("temp",function(rs,args){
	return getWeather(args.join(' '),"temp")
});

function on_load_success () {
	$("#message").focus();

	// Now to sort the replies!
	rs.sortReplies();
}

function on_load_error (err) {
	console.log("Loading error: " + err);
}

function onDebug(message) {
	if (debugMode) {
		$("#debug").append("<div>[RS] " + escapeHtml(message) + "</div>");
	}
}


function removeDiactrics(str) {

    let plDict = {
	    'ą' : 'a',
	    'ę' : 'e',
	    'ć' : 'c',
	    'ł' : 'l',
	    'ń' : 'n',
	    'ó' : 'o',
	    'ś' : 's',
	    'ź' : 'z',
	    'ż' : 'z'
	}

    for (let i in plDict) {
        str = str.replace(new RegExp(i, "g"), plDict[i]);
    }

    return str;
}