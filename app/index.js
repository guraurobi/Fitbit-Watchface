// Import all required libraries
import { display } from "display";
import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";


// Update the clock ticks to a second or a minute
clock.granularity = "minutes";


// Get a handle on the HTML elements
const sensors = [];
const hourLabel = document.getElementById("hourLabel");
const stepsLabel = document.getElementById("stepsLabel");
const heartLabel = document.getElementById("heartLabel");
const caloriesLabel = document.getElementById("caloriesLabel");


// Function that updates the Heart Rate element
if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    heartLabel.text = (hrm.heartRate ? hrm.heartRate : 0);
  });
  sensors.push(hrm);
  hrm.start();
}


// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let dateNow = evt.date;
  let hours = dateNow.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(dateNow.getMinutes());
  hourLabel.text = `${hours}:${mins}`;
  
  stepsLabel.text = today.local.steps;
  caloriesLabel.text = today.local.calories;
}


// Automatically stop all sensors when the screen is off to conserve battery
display.addEventListener("change", () => {
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});
