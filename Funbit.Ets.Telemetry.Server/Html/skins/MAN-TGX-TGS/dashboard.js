// SEE Dashboard Skin Tutorial FOR MORE INFORMATION ABOUT THIS FILE


function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else
		var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}


Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {
    data.hasJob = data.trailer.attached;
    data.dashLights = data.truck.lightsParkingOn;
    var electric = data.truck.electricOn;
    var engine = data.truck.engineOn;
    
	

	$('#button').click(function () { // add a button on dashboard to reset total distance counter anytime
		createCookie('TotalTraveledDis', odmtr, 1);
		createCookie('LastFuelLevel', (data.truck.fuel), 1);
	});
	
	// info dash
    data.infodash = electric == true ? true : false;
    
	//show panel icons on electric start
	data.startIcons = electric == true ? true : false;
	
	// round truck speed
    data.truck.speedRounded = electric == true ? (Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed))) : "";
    
	// fuel average consumption
    data.truck.fuelAverageConsumption = data.truck.engineOn == true ? ((utils.formatFloat((data.truck.fuelAverageConsumption*100), 1)) + " l/100km") : "";
    
	// RPM assistance
	var acceleration = utils.formatFloat((data.truck.acceleration.z), 4);
	var throttlePos = utils.formatFloat(data.truck.gameThrottle, 2);
	var truckPitch =  utils.formatFloat((data.truck.placement.pitch * 100), 2);
		/* only for test purpose
		data.truck.acceleration = acceleration;
		data.truck.gameThrottle = throttlePos;
		data.truck.pitch = truckPitch; */
	// negative acceleratioon (meters/s) = truck is accelerating; negative truck pitch = downhill drive
	data.truck.rpmAssistant = 
	data.truck.electricOn ? (
	(data.truck.engineRpm >= 1200 && data.truck.engineRpm < 1400  && data.truck.motorBrakeOn) ? 'eBrake' :
	(data.truck.engineRpm > 1400 && data.truck.engineRpm < 1600  && data.truck.motorBrakeOn) ?'eBrake1' :
	(data.truck.engineRpm > 1600 && data.truck.engineRpm < 1800  && data.truck.motorBrakeOn) ? 'eBrake2' :
	(data.truck.engineRpm > 1800 && data.truck.engineRpm <= 2000  && data.truck.motorBrakeOn) ? 'eBrake3' : 	// zero throttle, motor brake engaged 1800-2300 rpm
	'eBrake1') : ''; 
	
	// convert kg to t
    data.cargo.mass = (electric == true && data.hasJob == true) ? ("cargo Mass: " + utils.formatFloat((data.cargo.mass / 1000), 1) + ' t') : "";
    
	// trailer wear
    data.trailer.wear = (electric == true && data.hasJob == true)? ("Trailer Wear: " + utils.formatFloat((data.trailer.wear * 100), 1) + '%') : "";

    // format odometer data as: 00000.0
    data.truck.odometer = electric ? (utils.formatFloat(data.truck.odometer, 1)) : '';
	
	// odometer km
    data.odometerKm = (electric == true) ? true : false;
	data.travDistanceKm = (electric == true) ? true : false;
	
	// cruise control
    data.truck.cruiseControlSpeed = data.truck.cruiseControlOn == true ? utils.formatFloat(data.truck.cruiseControlSpeed, 0) : "";
    
	// convert gear to readable format
    var FwGears = ["N", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
	data.truck.gear = data.truck.displayedGear;
	data.truck.gear = data.truck.electricOn == true ?
	((data.truck.gear >= 0) ? FwGears[data.truck.gear] : 'R' ): "";
	var shiftertype = data.truck.shifterType;
	data.truck.shifterType = electric ? (shiftertype == 'automatic' ? 'A' : shiftertype == 'manual' ? 'M' : '') : '';
	
	// neutral warning
	data.engineNeutral = (electric == true && engine == false && data.truck.displayedGear != 0) ? true : false;

    // adblue warning
    data.truck.adblueWarningOn = electric == true ? data.truck.adblueWarningOn : false;
	
    // convert rpm to rpm * 100
    data.truck.engineRpm = data.truck.engineRpm / 100;
	
    // air pressure
   	data.truck.airPressureSplit = data.truck.airPressure > 100 ? (data.truck.airPressure - 100) : 0;
	//data.truck.airPressureSplit = data.truck.airPressure;
	var airPressureWarningOn = data.truck.airPressureWarningOn;
	data.truck.airPressureWarningOn = (electric == true) ? true : false;
    data.airPressureWarningOnDisplay = (electric == true && airPressureWarningOn == true) ? true : false;
	data.airPressureWarningOn1 = (electric == true && airPressureWarningOn == true) ? true : false;
	data.airPressureWarningOn2 = (electric == true && airPressureWarningOn == true) ? true : false;
   
    // motor brake
    data.truck.motorBrakeOn = (engine == true && (data.truck.gameThrottle < 0.1)) ? ((data.truck.gameClutch < 0.9 && data.truck.gear != 0) ? data.truck.motorBrakeOn : false) : false;
   
    // retarder
    data.truck.retarderBrake = (electric == true && data.truck.retarderBrake > 0 && data.truck.retarderStepCount > 0) ? data.truck.retarderBrake : "";
    data.retarderSym = data.truck.retarderBrake > 0 ? true : false;
    data.retarderMounted = data.truck.retarderStepCount > 0 ? true : false;
  
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

/* 
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

*/
    // extract time and date from game to readable format "Sun 00:00"
    var time1 = data.game.time;
    var timestr = data.truck.electricOn == true ? time1.substr(11, 5) : "";
    var date1 = new Date(data.game.time);
    data.datetime = timestr;

	//total traveled distance
	var odmtr = utils.formatFloat(data.truck.odometer, 1); // current odometer value
	var td1 = utils.formatFloat(readCookie('TotalTraveledDis'), 1);
	data.truck.TravDistance = electric ? utils.formatFloat((odmtr - td1), 1) : 0;

   	//brake temperature
	data.temperature = 
	data.truck.electricOn == true ? ( 
	(timeH >= 0 && timeH < 1) ? '12 °C':
	(timeH >= 1 && timeH < 2) ? '12 °C':
	(timeH >= 2 && timeH < 3) ? '11 °C':
	(timeH >= 3 && timeH < 4) ? '11 °C':
	(timeH >= 4 && timeH < 5) ? '10 °C':
	(timeH >= 5 && timeH < 6) ? '10 °C':
	(timeH >= 6 && timeH < 7) ? '10 °C':
	(timeH >= 7 && timeH < 8) ? '10 °C':
	(timeH >= 8 && timeH < 9) ? '10 °C':
	(timeH >= 9 && timeH < 10) ? '10 °C':
	(timeH >= 10 && timeH < 11) ? '12 °C':
	(timeH >= 11 && timeH < 12) ? '13 °C':
	(timeH >= 12 && timeH < 13) ? '14 °C':
	(timeH >= 13 && timeH < 14) ? '15 °C':
	(timeH >= 14 && timeH < 15) ? '15 °C':
	(timeH >= 15 && timeH < 16) ? '15 °C':
	(timeH >= 16 && timeH < 17) ? '14 °C':
	(timeH >= 17 && timeH < 18) ? '12 °C':
	(timeH >= 18 && timeH < 19) ? '12 °C':
	(timeH >= 19 && timeH < 20) ? '11 °C':
	(timeH >= 20 && timeH < 21) ? '11 °C':
	(timeH >= 21 && timeH < 22) ? '11 °C':
	(timeH >= 22 && timeH < 23) ? '11 °C':
	(timeH >= 23 && timeH < 0) ? '11 °C':
	'') : ''; 

	// truck Health
    var wearSumPercent = data.truck.wearEngine * 100 +
        data.truck.wearTransmission * 100 +
        data.truck.wearCabin * 100 +
        data.truck.wearChassis * 100 +
        data.truck.wearWheels * 100;
    wearSumPercent = Math.min(wearSumPercent, 100);
    var wearSub = 100 - Math.round(wearSumPercent);
	//var healthStatus = electric ? (wearSub >= 75 ? 'OK' : (wearSub < 75 && wearSub >= 50) ? 'attention' : 'bad') : '';
	data.truck.stopWarning = (electric == true && wearSub < 50) ? true : false;
	data.stopWarning = data.truck.stopWarning;
	data.truck.checkWarning = (electric == true && wearSub < 60 && wearSub > 50) ? true : false;
	data.checkWarning = data.truck.checkWarning;
	data.checkWarning1 = data.truck.checkWarning;
	data.truck.importantWarning = (electric == true && wearSub < 80 && wearSub > 60) ? true : false;
	data.importantWarning = data.truck.importantWarning;
	data.importantWarning1 = data.truck.importantWarning;
	data.truck.serviceWarning = (electric == true && wearSub <= 90 &&  wearSub > 80) ? true : false;
	data.serviceWarning = data.truck.serviceWarning;
	data.serviceWarning1 = data.truck.serviceWarning;
	
	// engine start
	data.engineStart = (electric == true && engine == false) ? true : false;

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

	// blink warning and blinkers
	//data.truck.blinkWarning = (data.truck.blinkerLeftOn == true && data.truck.blinkerRightOn == true) ? true : false;
    //data.truck.blinkWarning = (data.truck.blinkerLeftActive == true && data.truck.blinkerRightActive == true) ? true : false;
    //data.truck.blinkerLeftOn = (data.truck.blinkerLeftActive == true && data.truck.blinkWarning == false) ? data.truck.blinkerLeftOn : false;
    //data.truck.blinkerRightOn = (data.truck.blinkWarning == false && data.truck.blinkerRightActive == true) ? data.truck.blinkerRightOn : false;
	
    // return changed data to the core for rendering
    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {    
}

Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {    
    utils.preloadImages(['images/air-warning.png', 'images/arrow.png', 'images/arrow-s.png', 'images/bg-on.jpg', 'images/bg-on-bright.jpg', 'images/bg-on-dark.jpg', 'images/blinker-left-on.png', 'images/blinker-right-on.png', 'images/cruise-on.png', 'images/fuel-warning.png', 'images/highbeam-on.png', 'images/infoDash.png', 'images/lowbeam-on.png', 'images/mBrake.png', 'images/parkingbrake.png', 'images/parklights-on.png', 'images/RestWarning.png', 'images/retarder.png']);
    //$(document).add('body').on('click', function () {
    //    window.history.back();
    //});
}