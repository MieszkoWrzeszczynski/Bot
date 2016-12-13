const url_begin = "http://api.openweathermap.org/data/2.5/weather?q="
const url_end = "&lang=pl&APPID=9d3cb30f7741b980a410eee17b5f26c7&units=metric";

// Create our RiveScript interpreter.
let rs = new RiveScript({
	debug:   false,
	utf8: true
});

rs.unicodePunctuation = new RegExp(/[.,!?;:]/g);

rs.loadFile([
	"resources/brain/brain.rive",
	"resources/brain/global.rive",
	"resources/brain/questions_to_bot.rive",
	"resources/brain/topics.rive",
	"resources/brain/weather.rive",
], on_load_success, on_load_error);

function mergeArgs(args){
	sentences = []

	for(var i = 0; i < args.length; i++){
		sentences.push(args[i].split(" "))
	}

	return sentences;
}


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

function listComparable(first,second){

	var i = 0;
	
	for(i; i < first.length; i++){
		if(second.indexOf(first[i]) >= 0){
			return true;
		}
	}

	return false;

}

rs.setSubroutine("input_temp",function(rs,args){
	input_sentences = mergeArgs(args)
	keys = ["temperature","temperatury","temperatura","temperaturze"]

	return listComparable(keys,[].concat.apply([], input_sentences))
});

rs.setSubroutine("input_weather",function(rs,args){
	input_sentences = mergeArgs(args)
	keys = ["pogoda","pogode","pogodowe","pogodnie"]

	return listComparable(keys,[].concat.apply([], input_sentences))
});

rs.setSubroutine("input_clouds",function(rs,args){
	input_sentences = mergeArgs(args)
	keys = ["zachmurzenie","chmury","pochmurnie","pochmurno","chmurami"]
	
	return listComparable(keys,[].concat.apply([], input_sentences))
});


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

	console.log(message);
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

var form = document.getElementById("form");

function sendMessage () {
	var text = $("#message").val();
	text = removeDiactrics(text);

	$("#message").val("");
	$("#dialogue").append("<div class='chat_msg'><strong class='user'>Ty:</strong> " + text + "</div>");

	try {
		rs.replyAsync("soandso", text, this).then(function(reply) {
			$("#dialogue").append("<div class='chat_msg'><strong class='bot'>WeatherBot: </strong>" + reply + "</div>");

		    $('#dialogue').scrollTop($('#dialogue')[0].scrollHeight);
		});

			
	} catch(e) {
		console.log(e);
	}

	return false;
}

function escapeHtml(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


function savelogs(log) {

		qwest.post("http://www.mieszkowrzeszczynski.pl/bot/log.php",{ data: log }, {
            cache: true,
            dataType: 'json'
        })
        .then(function(xhr, response) {
       		console.log("send a log");
            
        })
        .catch(function(e, xhr, response) {
            console.log("POST Error:" + e);
        });
	    
}



function getLogData(){
	var log = {
	    messages: []
	};

	var dialogue = document.getElementById("dialogue");
	var children = dialogue.children;

	for (var i = 0; i < children.length; i++) {
		log.messages.push({
			"text" : children[i].textContent
		})
	} 

	return log;
}

form.addEventListener('submit', function(){
	sendMessage();
	return false;
});


var saveLogButton = document.getElementById("save-logs");
saveLogButton.addEventListener('click',function(){
	savelogs(getLogData())
	swal({
	  title: "Logi zostały zapisane!",
	  text: "Dzięki :)",
	  type: "success",
	  timer: 2000,
  	  showConfirmButton: false
	});
});

	
