// SEE Dashboard Skin Tutorial FOR MORE INFORMATION ABOUT THIS FILE

Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {
    data.hasJob = data.trailer.attached;
    data.dashLights = data.truck.lightsParkingOn;
    var electric = data.truck.electricOn;
    var engine = data.truck.engineOn;
 // info dash
 data.infodash = electric == true ? true : false;
    // round truck speed
    data.truck.speedRounded = electric == true ? (Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed))) : "";
// fuel average consumption
   data.truck.fuelAverageConsumption = data.truck.engineOn == true ? ("Fuel Avg: " + (utils.formatFloat((data.truck.fuelAverageConsumption*100), 1)) + " l/100km") : "";
    // convert kg to t
    data.cargo.mass = (electric == true && data.hasJob == true) ? ("cargo Mass: " + utils.formatFloat((data.cargo.mass / 1000), 1) + ' t') : "";
// trailer wear
    data.trailer.wear = (electric == true && data.hasJob == true)? ("Trailer Wear: " + utils.formatFloat((data.trailer.wear * 100), 1) + '%') : "";

    // format odometer data as: 00000.0
    data.truck.odometer = utils.formatFloat(data.truck.odometer, 1);
// cruise control
data.truck.cruiseControlSpeed = data.truck.cruiseControlOn == true ? utils.formatFloat(data.truck.cruiseControlSpeed, 0) + "\n" + "km/h" : "";
    // convert gear to readable format
 var FwGears = ["N".fontcolor("green"), "1L", "1H", "2L", "2H", "3L", "3H", "4L", "4H", "5L", "5H", "6L", "6H"];
 data.truck.gear = data.truck.displayedGear;
 data.truck.gear = data.truck.electricOn == true ? 
	((data.truck.gear >= 0) ? FwGears[data.truck.gear] : 'R'.fontcolor("red") ): "";
    // convert rpm to rpm * 100
    data.truck.engineRpm = data.truck.engineRpm / 100;
   // air pressure
    data.truck.airPressureSplit = data.truck.airPressure > 100 ? (data.truck.airPressure - 100) : 0;
// motor brake
   data.truck.motorBrakeOn = (engine == true && (data.truck.gameThrottle < 0.1)) ? ((data.truck.gameClutch < 0.9 && data.truck.gear != 0) ? data.truck.motorBrakeOn : false) : false;
 // retarder
   data.truck.retarderBrake = (electric == true && data.truck.retarderBrake > 0 && data.truck.retarderStepCount > 0) ? data.truck.retarderBrake : "";
data.retarderSym = data.truck.retarderBrake > 0 ? true : false;
data.retarderMounted = data.truck.retarderStepCount > 0 ? true : false;
 // info dash
 data.infodash = electric == true ? true : false;

// ! FOR SUMMER TIME ! time comparison to dim dashboard according with game time (day = normal, night = dark)
	var timestr = data.game.time;
	timestr = timestr.substr(11, 5);
	var timeH = Number(timestr.substr(0, 2));
	data.isNight = ((timeH >= 00 && timeH <= 05) || (timeH >= 18 && timeH <= 23)) ? true : false;
	var totalMinutes = +timestr.substr(0, 2) * 60;
	totalMinutes += +timestr.substr(3, 2);
	var backgroundBrightnessNum = 50-(Math.cos((3.14 * totalMinutes)/720)) * 50;
	backgroundBrightnessNum = backgroundBrightnessNum < 15 ? 15 : backgroundBrightnessNum;
	data.backgroundBrightness = backgroundBrightnessNum + '%';
	data.gaugeBrightness = ((data.dashLights) ? 135 : backgroundBrightnessNum) + '%';	
/*
// ! FOR WINTER TIME ! time comparison to dim dashboard according with game time (day = normal, night = dark)
	var timestr = data.game.time;
	timestr = timestr.substr(11, 5);
	var timeH = Number(timestr.substr(0, 2));
	data.isNight = ((timeH >= 00 && timeH <= 07) || (timeH >= 16 && timeH <= 23)) ? true : false;
	var totalMinutes = +timestr.substr(0, 2) * 60;
	totalMinutes += +timestr.substr(3, 2);
	var backgroundBrightnessNum = 50-(Math.cos((3.14 * totalMinutes)/720)) * 50;
	backgroundBrightnessNum = backgroundBrightnessNum < 50 ? 10 : backgroundBrightnessNum - 40;
	data.backgroundBrightness = backgroundBrightnessNum + '%';
	data.gaugeBrightness = ((data.dashLights) ? 135 : backgroundBrightnessNum) + '%';	
*/
   // extract time and date from game to readable format "Sun 00:00"
   var time1 = data.game.time;
  var timestr = data.truck.electricOn == true ? time1.substr(11, 5) : "";
   var date1 = new Date(data.game.time);
   var dayweek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   var day = date1.getDay();
   var datestr = data.truck.electricOn == true ? dayweek[day] : "";
   data.datetime = datestr + ' ' + timestr;
   // enable this gauges and indicators when electric or engine (according with case) is on
    data.truck.speedRounded = electric == true ? data.truck.speedRounded : "";
    data.truck.gear = electric == true ? data.truck.gear : "";	
    data.truck.fuel = electric == true ? data.truck.fuel : 0;
    data.truck.airPressureSplit = engine == true ? data.truck.airPressureSplit : 0;
    data.truck.airPressure = engine == true ? data.truck.airPressure : 0;
    data.truck.parkBrakeOn = electric == true ? data.truck.parkBrakeOn : false;
    data.truck.lightsBeamLowOn = electric == true ? data.truck.lightsBeamLowOn : false;
    data.truck.lightsBeamHighOn = (electric == true && data.truck.lightsBeamLowOn == true) ? data.truck.lightsBeamHighOn : false;
       data.truck.waterTemperature = electric == true ? data.truck.waterTemperature : 0;
// rest stop time warning
var enableSleep = true; // disable this (change "true" to "false" - without quotes) if you dont want use in-game sleep
var RestTime = data.game.nextRestStopTime; // is only to clear code below
data.restWarning = enableSleep == true ? ((RestTime <= "0001-01-01T02:00:00Z" && RestTime > "0001-01-01T01:30:00Z") ? 'blue' : ((RestTime <= "0001-01-01T01:30:00Z" && RestTime > "0001-01-01T01:00:00Z") ? 'red' : ((RestTime <= "0001-01-01T01:00:00Z" && RestTime >= "0001-01-01T00:00:00Z") ? 'blinking' : 'off'))) : '';
// change speed limit color when above truck speed
    data.navigation.speedLimit = electric == true ? data.navigation.speedLimit : "";
    data.speeding = electric == true ? (((data.navigation.speedLimit > 0) && (data.navigation.speedLimit < data.truck.speedRounded)) ? true : false) : false;
	
    // return changed data to the core for rendering
    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {    
}

Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {    
    utils.preloadImages(['images/air-warning.png', 'images/arrow.png', 'images/arrow-s.png', 'images/bg-on.jpg', 'images/bg-on-bright.jpg', 'images/bg-on-dark.jpg', 'images/blinker-left-on.png', 'images/blinker-right-on.png', 'images/cruise-on.png', 'images/fuel-warning.png', 'images/highbeam-on.png', 'images/infoDash.png', 'images/lowbeam-on.png', 'images/mBrake.png', 'images/parkingbrake.png', 'images/parklights-on.png', 'images/RestWarning.png', 'images/retarder.png']);
    $(document).add('body').on('click', function () {
        window.history.back();
    });
}