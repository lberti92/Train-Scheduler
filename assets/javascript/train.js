var firebaseConfig = {
  apiKey: "AIzaSyCFVxSPrbGEadYBEhtYDjM3mcEHiuD4jTA",
  authDomain: "test-project-52fc8.firebaseapp.com",
  databaseURL: "https://test-project-52fc8.firebaseio.com",
  projectId: "test-project-52fc8",
  storageBucket: "test-project-52fc8.appspot.com",
  messagingSenderId: "855330801377",
  appId: "1:855330801377:web:a71a5048fbed72d2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  //grab user input
  var name = $("#train-name-input").val().trim();
  var dest = $("#dest-input").val().trim();
  var startTime = $("#start-input").val().trim();
  var freq = $("#freq-input").val().trim();

      // First Time (pushed back 1 year to make sure it comes before current time)
    var startTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
    console.log(startTimeConverted);

    // Current Time

  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % freq;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = freq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var arrival = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(arrival).format("hh:mm"));

  // uploads train data to database as well as creating the local "temporary" oject
  database.ref().push({
    name: name,
    destination: dest,
    firstTime: firstTime,
    frequency: freq,
    // arrival: arrival,
    // minutesAway: minutes,
    dateAdded: firebase.database.ServerValue.TIMESTAMP,
  });

  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("start-input").val("");
  $("#freq-input").val("");

  database.ref().on("child_added", function (snapshot) {

    console.log(snapshot.val());
    console.log("name " + snapshot.val().name);
    console.log("destination " + snapshot.val().destination);
    console.log(snapshot.val().firstTime);
    console.log(snapshot.val().frequency);







    //create a new tr as updating the database & for each bit of data, create a td like the one above
    var row = $("<tr>");
    var nameTD = $("<td>").text(snapshot.val().name);
    var destTD = $("<td>").text(snapshot.val().destination);
    var freqTD = $("<td>").text(snapshot.val().frequency);
    var nextArrivalTD = $("<td>").text(snapshot.val().arrival);
    var minutesAwayTD = $("<td>").text(snapshot.val().minutes);


    //after you have all 5, append the tds to the tr
    row.append(nameTD, destTD, freqTD, nextArrivalTD, minutesAwayTD);
    $("tbody").append(row);
    // after you've got a tr with data-ey tds , append the row to the page
  })


});
