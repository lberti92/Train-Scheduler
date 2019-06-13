
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

  console.log("start " + startTime);

  database.ref().push({
    name: trainName,
    destination: dest,
    startTime: startTime,
    frequency: freq,
    // dateAdded: firebase.database.ServerValue.TIMESTAMP,
  })

  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#start-input").val("");
  $("#freq-input").val("");

  database.ref().on("child_added", function (snapshot, prevChildKey) {

      //  var row = $("<tr>");
    // var nameTD = $("<td>").text(snapshot.val().name);
    var nameTD = snapshot.val().name;
    console.log("nameTD " + nameTD);

    // var destTD = $("<td>").text(snapshot.val().destination);
    var destTD = snapshot.val().destination;
    console.log("destTD " + destTD);

    var startTimeTD = snapshot.val().startTime;
    console.log("startTimeTD " + startTimeTD);

    // var freqTD = $("<td>").text(snapshot.val().frequency);
    var freqTD = snapshot.val().frequency;
    console.log("freqTD " + freqTD);

    var startTimeConverted = moment(startTimeTD, "hh:mm A").subtract(1, "years");
    console.log(startTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    console.log("freq " + freq);

    var tRemainder = diffTime % freqTD;
    console.log(tRemainder);

    var tMinutesTillTrain = freqTD - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextArrival = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("nextArrival " + nextArrival);

    // var nextArrivalTD = $("<td>").text(nextArrival);
    // var minutesAwayTD = $("<td>").text(tMinutesTillTrain);

    // // row.append(nameTD, destTD, freqTD, nextArrivalTD, minutesAwayTD);

    $("tbody").append("<tr> <td>" + nameTD + "</td> <td>" + destTD + "</td> <td>" + freqTD + "</td> <td>" + nextArrival + "</td> <td>" + tMinutesTillTrain + "</td> </tr>");


    // $("tbody").append(row);

  }, function (errorObject) {

    // In case of error this will print the error
    console.log("The read failed: " + errorObject.code);
  })
});