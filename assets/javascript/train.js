var firebaseConfig = {
  apiKey: "AIzaSyCFVxSPrbGEadYBEhtYDjM3mcEHiuD4jTA",
  authDomain: "test-project-52fc8.firebaseapp.com",
  databaseURL: "https://test-project-52fc8.firebaseio.com",
  projectId: "test-project-52fc8",
  storageBucket: "test-project-52fc8.appspot.com",
  messagingSenderId: "855330801377",
  appId: "1:855330801377:web:a71a5048fbed72d2"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  var trainName = $("#train-name-input").val().trim();
  var dest = $("#dest-input").val().trim();
  var startTime = moment($("#start-input").val().trim(), "HH:mm").format();
  var freq = $("#freq-input").val().trim();

  // console.log("start " + startTime);

  var startTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
  // console.log(startTimeConverted);

  // var currentTime = moment();
  // // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  var tRemainder = diffTime % freq;
  // console.log(tRemainder);

  var tMinutesTillTrain = freq - tRemainder;
  // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  var nextArrival = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");
  // console.log("nextArrival" + nextArrival);

  database.ref().push({
    name: trainName,
    destination: dest,
    startTime: startTime,
    frequency: freq,
    arrival: nextArrival,
    minutesAway: tMinutesTillTrain,
    dateAdded: firebase.database.ServerValue.TIMESTAMP,
  })

  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#start-input").val("");
  $("#freq-input").val("");
});
  database.ref().on("child_added", function (snapshot) {

    var row = $("<tr>");
    var nameTD = $("<td>").text(snapshot.val().name);
    var destTD = $("<td>").text(snapshot.val().destination);
    var freqTD = $("<td>").text(snapshot.val().frequency);
    var nextArrivalTD = $("<td>").text(snapshot.val().arrival);
    var minutesAwayTD = $("<td>").text(snapshot.val().minutesAway);

    row.append(nameTD, destTD, freqTD, nextArrivalTD, minutesAwayTD);
    $("tbody").append(row);
  
  });