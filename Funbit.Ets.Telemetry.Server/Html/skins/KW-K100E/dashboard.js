Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {
    //
    // skinConfig - a copy of the skin configuration from config.json
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // this function is called before everything else, 
    // so you may perform any DOM or resource initializations / image preloading here

    utils.preloadImages([
        'images/bg-off.png', 'images/bg-on.png',
		 'images/ArrowL.png', 'images/ArrowM.png',
		 'images/ArrowS.png', 'images/ArrowH.png',
		 'images/kph.png', 'images/mph.png',
    ]);

}

Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {
    //
    // data - telemetry data JSON object
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // This filter is used to change telemetry data 
    // before it is displayed on the dashboard.
    // You may convert km/h to mph, kilograms to tons, etc.
	
	if (localStorage.timeDisplay == "st") {
		var d = new Date();
		if (d.getHours() >= 12) {
			Hours = (d.getHours() - 12);
		} else {
			Hours = d.getHours();
		}
		data.game.timeHours = (Hours * 3600) + (d.getMinutes() * 60);
		data.game.timeMinutes = (d.getMinutes() * 60) + (d.getSeconds());
		data.game.timeDisplay = "St";
	} else if (localStorage.timeDisplay == "gt") {
			var d = new Date(data.game.time);
		if (d.getUTCHours() >= 12) {
			Hours = (d.getUTCHours() - 12);
		} else {
			Hours = d.getUTCHours();
		}
		data.game.timeHours = ((Hours * 3600) + (d.getUTCMinutes() * 60));
		data.game.timeMinutes = (d.getUTCMinutes() * 60) + (d.getUTCSeconds());
		data.game.timeDisplay = "Gt";
	}
	if (localStorage.showId == "Kph") {
		$('.speedDailkph').css('visibility', 'visible');
		$('.speedDailmph').css('visibility', 'hidden');
		$('.truck-cruiseControlMph').css('visibility', 'hidden');
		if (data.truck.cruiseControlOn == true) {
			$('.truck-cruiseControlSpeedRounded').css('visibility', 'visible');
			$('.truck-cruiseControlKph').css('visibility', 'visible');
		} else {
			$('.truck-cruiseControlSpeedRounded').css('visibility', 'hidden');
			$('.truck-cruiseControlSpeedRoundedMph').css('visibility', 'hidden');
			$('.truck-cruiseControlKph').css('visibility', 'hidden');
		}
		data.truck.odometer = utils.formatFloat(data.truck.odometer, 1);
	} else if (localStorage.showId == "Mph") {
		$('.speedDailkph').css('visibility', 'hidden');
		$('.speedDailmph').css('visibility', 'visible');
		$('.truck-cruiseControlKph').css('visibility', 'hidden');
		if (data.truck.cruiseControlOn == true) {
			$('.truck-cruiseControlSpeedRoundedMph').css('visibility', 'visible');
			$('.truck-cruiseControlMph').css('visibility', 'visible');
		} else {
			$('.truck-cruiseControlSpeedRounded').css('visibility', 'hidden');
			$('.truck-cruiseControlSpeedRoundedMph').css('visibility', 'hidden');
			$('.truck-cruiseControlMph').css('visibility', 'hidden');
		}
		data.truck.odometer = utils.formatFloat(data.truck.odometer * 0.621371, 1);
	}

	//Convert Celsius to Fernheid
	data.truck.oilTemperature = (data.truck.oilTemperature * 9/5) + 32; // = 32°F
	data.truck.waterTemperature = (data.truck.waterTemperature * 9/5) + 32;

	if (data.truck.electricOn == true) {
		$('.dashboard').css('opacity', '1');
		$('.speedDailmph', '.speedDailkph').css('opacity', '1');
		data.truck.batteryVoltage = data.truck.batteryVoltage;
		data.truck.oilPressure = data.truck.oilPressure;
		data.truck.oilTemperature = data.truck.oilTemperature;
		data.truck.waterTemperature = data.truck.waterTemperature;
		data.truck.fuel = data.truck.fuel;
		data.truck.airPressure = data.truck.airPressure;
		data.truck.brakePressure = data.truck.brakePressure;
		data.truck.suspPressure = data.truck.airPressure;
		data.truck.brakePressure = Math.abs(data.truck.airPressure * data.truck.gameBrake);
		data.truck.transTemperature = Math.abs(data.truck.oilTemperature * 1.2);
		data.truck.rraxleTemp = Math.abs(data.truck.transTemperature * 0.8);
		data.truck.rfaxleTemp = Math.abs(data.truck.transTemperature * 0.9);
		$('.truck-wearCabin').css('visibility', 'visible');
		$('.truck-wearEngine').css('visibility', 'visible');
		$('.truck-wearTransmission').css('visibility', 'visible');
		$('.truck-wearChassis').css('visibility', 'visible');
		$('.truck-wearWheels').css('visibility', 'visible');
		$('.trailer-wearChassis').css('visibility', 'visible');
		$('.trailer-wearWheels').css('visibility', 'visible');
		$('.truck-wipersOn').css('visibility', 'visible');
		$('.truck-lightsParkingOn').css('visibility', 'visible');
		$('.truck-lightsBeamLowOn').css('visibility', 'visible');
		$('.truck-cruiseControlOn').css('visibility', 'visible');
	} else if (data.truck.electricOn == false) {
		$('.dashboard').css('opacity', '0.5');
		$('.speedDailmph', '.speedDailkph').css('opacity', '0.5');
		data.truck.batteryVoltage =0;
		data.truck.oilPressure = 0;
		data.truck.oilTemperature = 0;
		data.truck.waterTemperature = 0;
		data.truck.fuel = 0;
		data.truck.airPressure = 0;
		data.truck.brakePressure = 0;
		data.truck.suspPressure = 0;
		data.truck.brakePressure = 0;
		data.truck.transTemperature = 0;
		data.truck.rraxleTemp = 0;
		data.truck.rfaxleTemp = 0;
		$('.truck-wearCabin').css('visibility', 'hidden');
		$('.truck-wearEngine').css('visibility', 'hidden');
		$('.truck-wearTransmission').css('visibility', 'hidden');
		$('.truck-wearChassis').css('visibility', 'hidden');
		$('.truck-wearWheels').css('visibility', 'hidden');
		$('.trailer-wearChassis').css('visibility', 'hidden');
		$('.trailer-wearWheels').css('visibility', 'hidden');
		$('.truck-wipersOn').css('visibility', 'hidden');
		$('.truck-lightsParkingOn').css('visibility', 'hidden');
		$('.truck-lightsBeamLowOn').css('visibility', 'hidden');
		$('.truck-cruiseControlOn').css('visibility', 'hidden');
	}

	if (data.trailer.attached === true) {
		data.truck.trailerPressure = data.truck.airPressure;
	} else {
		data.truck.trailerPressure = 0;
	}

 	if (data.truck.batteryVoltageWarningValue < 12) {
		data.truck.batteryVoltage = data.truck.batteryVoltage;
	} else {
		data.truck.batteryVoltage = data.truck.batteryVoltage / 2;
	}


	// Turbo boost simulation //	Barometric pressure asl less altetude(ft) times RPM times trottle pressure. NB!! This is for simulation and not real//
 	if (data.truck.gameThrottle >= 0.1) {
		data.truck.turboBoost = ((14.706 - ((data.truck.placement.y / 0.0481 / 0.3048) * 0.000408)) * data.truck.engineRpm / 1000 * data.truck.gameThrottle);
	} else if (data.truck.gameThrottle <= 0 && data.truck.motorBrakeOn == true && data.truck.speed > 0.1) {
		data.truck.turboBoost = ((14.706 - ((data.truck.placement.y / 0.0481 / 0.3048) * 0.000408)) * data.truck.engineRpm / 1000 * 1);
	} else {
		data.truck.turboBoost = 0;
	}

	// convert actule fuel consumption //
	if (sessionStorage.lastKm == null) {
		kmLast = Math.abs(data.truck.odometer);
		fuelLast = Math.abs(data.truck.fuel);
		sessionStorage.setItem("lastKm", kmLast);
		sessionStorage.setItem("lastFuel", fuelLast);
		sessionStorage.setItem("conSump", 0);
	}
	var kmNow = Math.round(data.truck.odometer);
	var fuelNow = data.truck.fuel;
	var conSumption = Math.abs(sessionStorage.conSump);
	data.truck.fuelConsumption = conSumption;
	var kmLast = Math.abs(sessionStorage.lastKm);
	var fuelLast = Math.abs(sessionStorage.lastFuel);
	if (kmLast == undefined || kmLast > 0) {
		if (kmNow > kmLast) {
			conSumption = ((fuelLast - fuelNow) / (kmNow - kmLast)) * 100;
			fuelLast = fuelNow;
			kmLast = kmNow;
			sessionStorage.setItem("conSump", conSumption);
			sessionStorage.setItem("lastKm", kmLast);
			sessionStorage.setItem("lastFuel", fuelLast);
		} else {
			conSumption = 0;
		}
	}

    // round truck speed
    data.truck.speedRounded = Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed));
    data.truck.cruiseControlSpeedRounded = data.truck.cruiseControlOn
        ? Math.round(data.truck.cruiseControlSpeed)
        : 0;
    data.truck.cruiseControlSpeedRoundedMph = data.truck.cruiseControlOn
        ? Math.round(data.truck.cruiseControlSpeed * 0.621371)
        : 0;
    // format odometer data as: 00000.0
    data.truck.odometer = utils.formatFloat(data.truck.odometer, 1);
    // convert rpm to rpm * 100
    data.truck.engineRpm = data.truck.engineRpm / 100;
    // return changed data to the core for rendering
    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {
    //
    // data - same data object as in the filter function
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // we don't have anything custom to render in this skin,
    // but you may use jQuery here to update DOM or CSS
    if (data.truck.wearCabin > 0 && data.truck.wearCabin < 0.05) {
        $('.truck-wearCabin').css('backgroundColor', '#28281E');
        $('.truck-wearCabin').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearCabin >= 0.05 && data.truck.wearCabin < 0.1) {
        $('.truck-wearCabin').css('backgroundColor', 'yellow');
        $('.truck-wearCabin').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearCabin >= 0.1 && data.truck.wearCabin < 0.15) {
        $('.truck-wearCabin').css('backgroundColor', 'orange');
        $('.truck-wearCabin').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearCabin >= 0.15) {
        $('.truck-wearCabin').css('backgroundColor', 'red');
        $('.truck-wearCabin').css('animation', 'myreserve 1s linear infinite');
    } else {
        $('.truck-wearCabin').css('backgroundColor', '#28281E');
        $('.truck-wearCabin').css('animation', 'myreserve 0s linear infinite');
    }
    if (data.truck.wearEngine > 0 && data.truck.wearEngine < 0.05) {
        $('.truck-wearEngine').css('backgroundColor', '#28281E');
        $('.truck-wearEngine').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearEngine >= 0.05 && data.truck.wearEngine < 0.1) {
        $('.truck-wearEngine').css('backgroundColor', 'yellow');
        $('.truck-wearEngine').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearEngine >= 0.1 && data.truck.wearEngine < 0.15) {
        $('.truck-wearEngine').css('backgroundColor', 'orange');
        $('.truck-wearEngine').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearEngine >= 0.15) {
        $('.truck-wearEngine').css('backgroundColor', 'red');
        $('.truck-wearEngine').css('animation', 'myreserve 1s linear infinite');
    } else {
        $('.truck-wearEngine').css('backgroundColor', '#28281E');
        $('.truck-wearEngine').css('animation', 'myreserve 0s linear infinite');
    }
    if (data.truck.wearTransmission > 0 && data.truck.wearTransmission < 0.05) {
        $('.truck-wearTransmission').css('backgroundColor', '#28281E');
        $('.truck-wearTransmission').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearTransmission >= 0.05 && data.truck.wearTransmission < 0.1) {
        $('.truck-wearTransmission').css('backgroundColor', 'yellow');
        $('.truck-wearTransmission').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearTransmission >= 0.1 && data.truck.wearTransmission < 0.15) {
        $('.truck-wearTransmission').css('backgroundColor', 'orange');
        $('.truck-wearTransmission').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearTransmission >= 0.15) {
        $('.truck-wearTransmission').css('backgroundColor', 'red');
        $('.truck-wearTransmission').css('animation', 'myreserve 1s linear infinite');
    } else {
        $('.truck-wearTransmission').css('backgroundColor', '#28281E');
        $('.truck-wearTransmission').css('animation', 'myreserve 0s linear infinite');
    }
    if (data.truck.wearChassis > 0 && data.truck.wearChassis < 0.05) {
        $('.truck-wearChassis').css('backgroundColor', '#28281E');
        $('.truck-wearChassis').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearChassis >= 0.05 && data.truck.wearChassis < 0.1) {
        $('.truck-wearChassis').css('backgroundColor', 'yellow');
        $('.truck-wearChassis').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearChassis >= 0.1 && data.truck.wearChassis < 0.15) {
        $('.truck-wearChassis').css('backgroundColor', 'orange');
        $('.truck-wearChassis').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearChassis >= 0.15) {
        $('.truck-wearChassis').css('backgroundColor', 'red');
        $('.truck-wearChassis').css('animation', 'myreserve 1s linear infinite');
    } else {
        $('.truck-wearChassis').css('backgroundColor', '#28281E');
        $('.truck-wearChassis').css('animation', 'myreserve 0s linear infinite');
    }
    if (data.truck.wearWheels > 0 && data.truck.wearWheels < 0.1) {
        $('.truck-wearWheels').css('backgroundColor', '#28281E');
        $('.truck-wearWheels').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearWheels >= 0.1 && data.truck.wearWheels < 0.25) {
        $('.truck-wearWheels').css('backgroundColor', 'yellow');
        $('.truck-wearWheels').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearWheels >= 0.25 && data.truck.wearWheels < 0.4) {
        $('.truck-wearWheels').css('backgroundColor', 'orange');
        $('.truck-wearWheels').css('animation', 'myreserve 0s linear infinite');
    } else if (data.truck.wearWheels >= 0.4) {
        $('.truck-wearWheels').css('backgroundColor', 'red');
        $('.truck-wearWheels').css('animation', 'myreserve 1s linear infinite');
    } else {
        $('.truck-wearWheels').css('backgroundColor', '#28281E');
        $('.truck-wearWheels').css('animation', 'myreserve 0s linear infinite');
    }

 	var connectedTrailers = 0;
	var wearSumChassis = 0;
	var wearSumWheels = 0;
		for (var i = 0; i <= data.trailerCount; i++) {
			if (data.trailers[i] !== undefined) {
				connectedTrailers++;
				wearSumChassis += data.trailers[i].wearChassis;
				wearSumWheels += data.trailers[i].wearWheels;
			}
		}

	var trailerWearChassis = wearSumChassis / connectedTrailers;
	var trailerWearWheels = wearSumWheels / connectedTrailers;

    if (trailerWearChassis > 0 && trailerWearChassis < 0.05) {
        $('.trailer-wearChassis').css('backgroundColor', '#28281E');
        $('.trailer-wearChassis').css('animation', 'myreserve 0s linear infinite');
    } else if (trailerWearChassis >= 0.05 && trailerWearChassis < 0.1) {
        $('.trailer-wearChassis').css('backgroundColor', 'yellow');
        $('.trailer-wearChassis').css('animation', 'myreserve 0s linear infinite');
    } else if (trailerWearChassis >= 0.1 && trailerWearChassis < 0.15) {
        $('.trailer-wearChassis').css('backgroundColor', 'orange');
        $('.trailer-wearChassis').css('animation', 'myreserve 0s linear infinite');
    } else if (trailerWearChassis >= 0.15) {
        $('.trailer-wearChassis').css('backgroundColor', 'red');
        $('.trailer-wearChassis').css('animation', 'myreserve 1s linear infinite');
    } else {
        $('.trailer-wearChassis').css('backgroundColor', '#28281E');
        $('.trailer-wearChassis').css('animation', 'myreserve 0s linear infinite');
    }

    if (trailerWearWheels > 0 && trailerWearWheels < 0.1) {
        $('.trailer-wearWheels').css('backgroundColor', '#28281E');
        $('.trailer-wearWheels').css('animation', 'myreserve 0s linear infinite');
    } else if (trailerWearWheels >= 0.1 && trailerWearWheels < 0.25) {
        $('.trailer-wearWheels').css('backgroundColor', 'yellow');
        $('.trailer-wearWheels').css('animation', 'myreserve 0s linear infinite');
    } else if (trailerWearWheels >= 0.25 && trailerWearWheels < 0.4) {
        $('.trailer-wearWheels').css('backgroundColor', 'orange');
        $('.trailer-wearWheels').css('animation', 'myreserve 0s linear infinite');
    } else if (trailerWearWheels >= 0.4) {
        $('.trailer-wearWheels').css('backgroundColor', 'red');
        $('.trailer-wearWheels').css('animation', 'myreserve 1s linear infinite');
    } else {
        $('.trailer-wearWheels').css('backgroundColor', '#28281E');
        $('.trailer-wearWheels').css('animation', 'myreserve 0s linear infinite');
    }

}
function changeTime(dispId, dispValue) {
var dispId = "timeDisplay";
	if (localStorage.timeDisplay === undefined) {
		var dispValue = "gt";
		localStorage.setItem(dispId, dispValue);
	} else if (localStorage.timeDisplay == "gt" || localStorage.timeDisplay == "st") {
		var dispValue = localStorage.timeDisplay.value;
	}
	if (localStorage.timeDisplay == "gt") {
		var dispValue = "st";
		localStorage.setItem(dispId, dispValue);
	} else if (localStorage.timeDisplay == "st") {
		var dispValue = "gt";
		localStorage.setItem(dispId, dispValue);
	}
}
function changeSpeedo(dispId, dispValue) {
var dispId = "showId";
	if (localStorage.showId == undefined) {
		var dispValue = "Kph";
		localStorage.setItem(dispId, dispValue);
	} else if (localStorage.showId == "Kph" || localStorage.showId == "Mph") {
		var dispValue = localStorage.showId.value;
	}
	if (localStorage.showId == "Kph") {
		var dispValue = "Mph";
		localStorage.setItem(dispId, dispValue);
	} else if (localStorage.showId == "Mph") {
		var dispValue = "Kph";
		localStorage.setItem(dispId, dispValue);
	}
}
	