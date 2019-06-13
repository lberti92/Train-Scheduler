// FIREBASE CONFIG
var config = {
    apiKey: "AIzaSyAaB6WcM_oga0zDRvy6KTc03K1qaAmNnrI",
    authDomain: "trains-f6b6a.firebaseapp.com",
    databaseURL: "https://trains-f6b6a.firebaseio.com",
    projectId: "trains-f6b6a",
    storageBucket: "trains-f6b6a.appspot.com",
    messagingSenderId: "339385469335"
};
firebase.initializeApp(config);


// CLEAR ALL TEXT INPUTS AFTER NEW TRAIN IS ADDED
var clearInputs = function() {
$("#train-x").val("");
$("#city-x").val("");
$("#first-leaves-x").val("");
$("#leaves-every-x").val("");
};


var createNewIrvineExpress = firebase.database();


// STORE TRAIN SCHEDULE IN FIREBASE
$("#add-button-x").on("click", function() {


// LETS CHECK TO SEE IF THE FORM IS EMPTY FIRST
if ( document.getElementById('train-x').value === '' || document.getElementById('city-x').value === '' || document.getElementById('first-leaves-x').value === '' || document.getElementById('leaves-every-x').value === '' ) {
  alert("You need to enter all train information");
  return false;
} else {

// SETUP VARIABLES FOR TRAIN SCHEDULE INFORMATION
// GET THE TRAIN NAME INPUT TEXT
var train = $("#train-x").val().trim();
// GET THE TRAVELING TO CITY INPUT TEXT
var city = $("#city-x").val().trim();
// GET THE TRAIN NAME INPUT TEXT
var firstLeaves = moment($("#first-leaves-x").val().trim(), "HH:mm").subtract(10, "years").format("X");
// GET THE TIME BETWEEN TRAINS INPUT TEXT
var leavesEvery = $("#leaves-every-x").val().trim();

// VARIABLE FOR FIREBASE OBJECT
// name
// destination
// firstTrain
// frequency

var addIrvineExpress = { 
    name: train, 
    destination: city, 
    firstTrain: firstLeaves, 
    frequency: leavesEvery };

// PUSH ALL DATA TO THE DATABASE
createNewIrvineExpress.ref().push(addIrvineExpress);

// EMPTY THE INPUTS
clearInputs();

// LET'S ADD A RETURN FALSE TO PREVENT THE FUNCTION FROM EXECUTING UNLESS THE BUTTON IS CLICKED
return false;
}
});


createNewIrvineExpress.ref().on("child_added", function(childSnapshot, prevChildKey) {


var nameOfTrain = childSnapshot.val().name;

var nameOfCity = childSnapshot.val().destination;

var trainLeavesFirst = childSnapshot.val().firstTrain;

var trainFrequency = childSnapshot.val().frequency;

                                            //    vvvv trainLeavesFirst is a childSnapshot of firstTrain from Firebase in minutes     
var differenceTimes = moment().diff(moment.unix(trainLeavesFirst), "minutes");
console.log ("difference in time: " + differenceTimes); // lets see what we get

 // vvvv minutesLeft is going to be          vvvv trainLeavesFirst     vv divided by the trainFrequency i.e. if the first train leaves at 6:00 converted to unix time (something long and crazy) and we divide by a train frequency of 60 minutes
var minutesLeft = moment().diff(moment.unix(trainLeavesFirst), "minutes") % trainFrequency;
console.log ("minutes left: " + minutesLeft); // lets see what we get

  // now we have a totalTime variable that takes the trainFrequency i.e 60 minutes - minutesLeft = 6 
var totalTime = trainFrequency - minutesLeft;
console.log ("total time: " + totalTime); // lets see what we get

var nextTrainTime = moment().add(totalTime, "m").format("hh:mm A");
console.log ("arrival time: " + nextTrainTime); // lets see what we get

$("#irvine-express > tbody").append("<tr> <td>" + nameOfTrain + "</td> <td>" + nameOfCity + "</td> <td>" + trainFrequency + "</td> <td>" + nextTrainTime + "</td> <td>" + totalTime + "</td> </tr>");

});