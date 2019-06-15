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

updateTrain();

$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  var trainName = $("#train-name-input").val().trim();
  var dest = $("#dest-input").val().trim();
  var startTime = moment($("#start-input").val().trim(), "HH:mm").format();
  var freq = $("#freq-input").val().trim();

  database.ref().push({
    name: trainName,
    destination: dest,
    startTime: startTime,
    frequency: freq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP,
  })

  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#start-input").val("");
  $("#freq-input").val("");
})

function updateTrain() {

  database.ref().on("child_added", function (snapshot) {

    var row = $("<tr>");
    var nameTD = $("<td>").text(snapshot.val().name);
    var destTD = $("<td>").text(snapshot.val().destination);
    var freqTD = snapshot.val().frequency;
    // console.log("Freq: " + freqTD);

    var startTimeTD = snapshot.val().startTime;
    // console.log("start: " + startTimeTD);

    var startTimeConverted = moment(startTimeTD, "hh:mm A").subtract(1, "years");
    // console.log("TimeConverted: " + startTimeConverted);

    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % freqTD;
    // console.log("Remainder: " + tRemainder);

    var tMinutesTillTrain = freqTD - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextArrival = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    // console.log("nextArrival: " + nextArrival);

    freqTD = $("<td>").text(snapshot.val().frequency);
    var nextArrivalTD = $("<td>").text(nextArrival);
    var minutesAwayTD = $("<td>").text(tMinutesTillTrain);

    row.append(nameTD, destTD, freqTD, nextArrivalTD, minutesAwayTD);

    $("tbody").append(row);

  }, function (errorObject) {
    // In case of error this will print the error
    console.log("The read failed: " + errorObject.code);
  })

  setTimeout(oneMinute, 1000 * 60);

  function oneMinute() {
    $("tbody").html("");
    updateTrain();
    // console.log("Reset Time and Minutes");
  }
}