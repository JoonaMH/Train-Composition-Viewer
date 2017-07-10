var trainNumber = [];
var departureDate = [];
var trainData = [];
var loader = 0;
var date = new Date();


init();


function init() {
	jQuery.ajaxSetup({async:false});
	buildFirst();
	buildSecond();
	buildThird();
};


function buildFirst() {
  var trains = "https://rata.digitraffic.fi/api/v1/live-trains?station=SLO";
  $.getJSON(trains, {}).done(function(data) {
  			for (var i = 0; i < data.length; i++) {
  			trainNumber.push(data[i].trainNumber);
 	 		trainData.push("<p>"+trainNumber[i]+""+data[i].trainType);
 	 		departureDate.push(data[i].departureDate);
		}
      });
};

function buildSecond(){
	for (var i = 0; i < departureDate.length; i++) {
	  	(function(i) {
	  	var trains = "https://rata.digitraffic.fi/api/v1/compositions/"+trainNumber[i]+"?departure_date="+departureDate[i];
     	$.ajaxSetup({async: false});
     	$.getJSON(trains, {}).done(function(data) {
       		if(typeof data.journeySections !== "undefined"){

		  	trainData[i] +=" "+
		  	data.journeySections[0].beginTimeTableRow.stationShortCode+"-"+
		  	data.journeySections[0].endTimeTableRow.stationShortCode+"<br> Locomotive: "+
		  	data.journeySections[0].locomotives[0].locomotiveType+" "+
		  	data.journeySections[0].locomotives[0].powerType+"<br>Wagons: ";

		  	for (var l = 0; l < data.journeySections[0].wagons.length; l++){
		  	trainData[i] += data.journeySections[0].wagons[l].wagonType+ ", ";
		  	}

		  	trainData[i] = trainData[i].substring(0, trainData[i].length-2);
		  	trainData[i] += " ("+data.journeySections[0].totalLength+
		  	" meters)<br>Max speed: "+data.journeySections[0].maximumSpeed;

			var currentTime = new Date(date).getTime();
		  	var departureTime = new Date(data.journeySections[0].beginTimeTableRow.scheduledTime).getTime();
		  	var arrivalTime = new Date(data.journeySections[0].endTimeTableRow.scheduledTime).getTime();

		  	if(currentTime >= departureTime && currentTime <= arrivalTime){
		  	trainData[i] += "<br>Train is currently moving</p>"
		  	}else{
		  	trainData[i] += "<br>Train is not currently moving</p>"
		  	}

		  	}else{
		  	trainData[i] +=" n/a-n/a<br>Locomotive: n/a<br>Wagons: n/a<br>Max speed: n/a<br>Train is not currently moving</p>";
		  	}
      });
    })(i);
	}
};


function buildThird(){
var $table = $("<table></table>");

for ( var i = 0; i < trainData.length; i++ ) {
    var a = trainData[i];
    var $line = $("<tr></tr>");
    $line.append( $("<td></td>").html(a) );
    $table.append($line);
}

$table.appendTo(document.getElementById("trains"));
};

