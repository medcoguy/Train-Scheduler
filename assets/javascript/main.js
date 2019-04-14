$(document).ready(function(){
let config = {
    apiKey: "AIzaSyB4K9YgIXUPGDRBOP4NmigKMk5qlk4V_Bw",
    authDomain: "trainscheduler-b2072.firebaseapp.com",
    databaseURL: "https://trainscheduler-b2072.firebaseio.com",
    projectId: "trainscheduler-b2072",
    storageBucket: "trainscheduler-b2072.appspot.com",
    messagingSenderId: "38009933213"
  };
	firebase.initializeApp(config);
	
let database = firebase.database();

$( "#target" ).submit(function( event ) {

  	let trainName = $("#train-input").val().trim();
  	let whereTo = $("#destination-input").val().trim();
  	let firstRun = moment($("#time-input").val().trim(), "HH:mm").format("X");
  	let howOften = $("#frequency-input").val().trim();

  	let newTrain = {
    	name: trainName,
    	destination: whereTo,
    	start: firstRun,
    	frequency: howOften
  	};

	database.ref().push(newTrain);

	$("#train-input").val("");
	$("#destination-input").val("");
	$("#time-input").val("");
	$("#frequency-input").val("");
  	return false;
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

	let trainName = childSnapshot.val().name;
	let whereTo = childSnapshot.val().destination;
	let firstRun = childSnapshot.val().start;
	let howOften = childSnapshot.val().frequency;

    let firstTimeConverted = moment(firstRun, "HH:mm").subtract(1, "years");
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    let tRemainder = diffTime % howOften;
  	let tMinutesTillTrain = howOften - tRemainder;
    let nextTrain = moment().add(tMinutesTillTrain, "minutes");
    let formattedTime = moment(nextTrain).format("HH:mm");

	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + whereTo + "</td><td>" + howOften + "</td><td>" + formattedTime + "</td><td>" + tMinutesTillTrain + "</td>");
});
});
