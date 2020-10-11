Funbit.Ets.Telemetry.Dashboard.prototype.internalFilter = function (data) {
    //overwriting the original function in dashboard-core.js
    return data;
};
var unit = '';
var preventDefault = true;
var tablePage = 0;
var startX = 0;
var distX = 0;
Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {
    //
    // skinConfig - a copy of the skin configuration from config.json
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // this function is called before everything else, 
    // so you may perform any DOM or resource initializations / image preloading here
    utils.preloadImages([
        'images/bg.png', 'images/page.png', 'images/indicator.png',
        'images/speedlimitwarningoff.png', 'images/speedlimitwarningon.png', 'images/speedlimitwarningofftownon.png', 'images/speedlimitwarningontownon.png',
        'images/speedupwarning0.png', 'images/speedupwarning1.png', 'images/speedupwarning2.png',
        'images/truckwearoff.png', 'images/truckwearon.png', 'images/truckwheelwearoff.png', 'images/truckwheelwearon.png', 'images/trailerwearoff.png', 'images/trailerwearon.png',
        'images/fatigueguage.png', 'images/fatigue.png', 'images/fatigue0.png', 'images/fatigue1.png', 'images/fatigue2.png', 'images/fatigue3.png'
    ]);

    //unit control
    document.getElementById("unit").addEventListener('click', function (e) {
        unit = (unit === 'km') ? 'mi' : 'km';
        e.preventDefault();
    }, true);
    document.getElementById("unit").addEventListener('touchend', function (e) {
        unit = (unit === 'km') ? 'mi' : 'km';
        e.preventDefault();
    }, true);

    document.getElementById("speedLimit").addEventListener('click', function (e) {
        unit = (unit === 'km') ? 'mi' : 'km';
        e.preventDefault();
    }, true);
    document.getElementById("speedLimit").addEventListener('touchend', function (e) {
        unit = (unit === 'km') ? 'mi' : 'km';
        e.preventDefault();
    }, true);


    //Warnings take precedent and do not change pages
    document.getElementById("scrollWarnings").addEventListener('wheel', function (e) {
        preventDefault = false;
    }, true);
    document.getElementById("scrollWarnings").addEventListener('touchstart', function (e) {
        preventDefault = false;
    }, true);
    document.getElementById("scrollWarnings").addEventListener('touchmove', function (e) {
        preventDefault = false;
    }, true);
    document.getElementById("scrollWarnings").addEventListener('touchend', function (e) {
        preventDefault = false;
    }, true);
    document.getElementById("scrollLastWarnings").addEventListener('wheel', function (e) {
        preventDefault = false;
    }, true);
    document.getElementById("scrollLastWarnings").addEventListener('touchstart', function (e) {
        preventDefault = false;
    }, true);
    document.getElementById("scrollLastWarnings").addEventListener('touchmove', function (e) {
        preventDefault = false;
    }, true);
    document.getElementById("scrollLastWarnings").addEventListener('touchend', function (e) {
        preventDefault = false;
    }, true);
    //body changes table pages and does nothing more
    document.body.addEventListener('wheel', function (e) {
        if (e.deltaX !== 0) { tablePage += e.deltaX / Math.abs(e.deltaX); }
        if (e.deltaY !== 0) { tablePage -= e.deltaY / Math.abs(e.deltaY); }
        if (tablePage < 0) { tablePage = 0; }
        if (tablePage > 3) { tablePage = 3; }
        if (preventDefault) { e.preventDefault(); }
        preventDefault = true;
    }, false);
    document.body.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        distX = 0;
    }, false);
    document.body.addEventListener('touchmove', function (e) {
        distX = e.touches[0].clientX - startX;
        if (distX > 45) {
            ++tablePage;
            startX = e.changedTouches[0].clientX;
        } else if (distX < -45) {
            --tablePage;
            startX = e.changedTouches[0].clientX;
        }
        if (tablePage > 3) { tablePage = 3; }
        if (tablePage < 0) { tablePage = 0; }
        if (preventDefault) { e.preventDefault(); }
        preventDefault = true;
    }, false);
    document.body.addEventListener('touchend', function (e) {
        if (distX === 0) {
            if (startX < 90) { --tablePage; }
            if (startX > 270) { ++tablePage; }
        }
        if (tablePage > 3) { tablePage = 3; }
        if (tablePage < 0) { tablePage = 0; }
        if (preventDefault) { e.preventDefault(); }
        preventDefault = true;
    }, false);
};
var indicatorStarted;
var indicatorStartedAt;
var previousTablePage = -1;
indicatorStarter = function (start, changePage) {
    if ((start !== true) && (indicatorStarted !== true)) {
        $('.indicator').css('opacity', '0');
        return false;
    }
    if (start === true) {
        indicatorStarted = true;
        indicatorStartedAt = new Date();
        $('.indicator').css('opacity', 1);
        previousTablePage = (previousTablePage === -1) ? tablePage : previousTablePage;
        tablePage = (changePage) ? 3 : tablePage;
        return true;
    }
    var presentTime = new Date();
    var factor = 10000;
    if ((presentTime - indicatorStartedAt) > factor) {
        indicatorStarted = false;
        tablePage = (tablePage === 3) ? previousTablePage : tablePage;
        previousTablePage = -1;
        return false;
    }
    $('.indicator').css('opacity', (factor - (presentTime - indicatorStartedAt)) / factor);
    return true;
};
minsToReadableTime = function (mins, utils) {
    return ((mins === '?') ? '--:--' : ((mins < 0) ? '-' : '') + utils.formatInteger(Math.floor(Math.abs(mins) / 60), 2) + ':' + utils.formatInteger(Math.floor(Math.abs(mins) % 60), 2));
};
unitConverter = function (value) {
    return (unit === 'mi') ? Math.round(value * 0.621371) : value;
};
unitConverterBack = function (value) {
    return (unit === 'mi') ? Math.round(value / 0.621371) : value;
};
var warnings = '';
var truckWearWarning = false;
var truckWheelsWearWarning = false;
var driverFatigue = 0;
var lastTrailerWear = 0;
var lastWearDelta = 0.00;
var deliveryWarning = 0;
var roadTimeScale = 19;
var hasJob = false;
var fuelConsumption = 0;

Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {
    //
    // data - telemetry data JSON object
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // This filter is used to change telemetry data 
    // before it is displayed on the dashboard.
    // You may convert km/h to mph, kilograms to tons, etc.


    ////debug - put near bug
    //data.lastWarning = ' hi bug ';
    //return data;

    var t;                                       //temp vars
    var s;
    var t1;
    var t2;
    data.lastWarning = '';
    if (data.game.gameName === 'ATS') {
        if (unit === '') { unit = 'mi'; }
        data.driverWorkTime = (14 * 60);             // ATS times - checked
        data.driverSleepTime = (10 * 60);
        roadTimeScale = 20;
    } else {
        if (unit === '') { unit = 'km'; }
        data.driverWorkTime = (11 * 60);             // ETS standard times
        data.driverSleepTime = (9 * 60);
        //data.driverWorkTime = (17 * 60);            // ETS Brazilian times 
        //data.driverSleepTime = (7 * 60);            // Yes, we overwork a lot to have a decent income. That's a huge problem.
        roadTimeScale = 19;
    }
    var lb = '<br/>';                            // Linebreak
    var zDay = new Date('0001-01-01T00:00:00Z'); //day zero 
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    indicatorStarter(false, false);

    //some global used vars
    t = new Date();
    data.realNow = utils.formatInteger(t.getHours(), 2) + ':' + utils.formatInteger(t.getMinutes(), 2);
    data.unit = (unit === 'km') ? 'kilometers' : 'miles';

    //fake news...
    //data.lastWarning += data.game.timeScale + ' ' + roadTimeScale + lb;
    //return data;

    // quiting if not connected
    if (data.game.connected !== true) {
        data.fatigueIndicator = 0;
        data.truck.fuel = 0;
        data.game.time = '';
        data.truck.wearSum = '';
        data.truck.wearEngine = '';
        data.truck.wearTransmission = '';
        data.truck.wearCabin = '';
        data.truck.wearChassis = '';
        data.truck.wearWheels = '';
        data.trailer.wear = '';
        data.trailer.wearValue = '';
        data.job.sourceCity = '';
        data.job.sourceCompany = '';
        data.job.destinationCity = '';
        data.job.destinationCompany = '';
        data.trailer.name = '';
        data.trailer.mass = '';
        data.job.income = '';
        data.job.remainingTime = '';
        data.navigation.estimatedTime = '';
        data.driverFatigue = '';
        data.driverFatigueTime = '';
        data.navigation.estimatedDistance = '';
        data.navigation.stopToRest = '';
        data.navigation.cityLimits = 0;
        data.lastWarning = '';
        warnings = '';
        data.warnings = warnings;
        return data;
    }

    data.hasJob = (data.navigation.estimatedDistance !== 0);
    //data.lastWarning += data.trailer.attached;

    if (data.hasJob && !hasJob) {
        warnings = data.realNow + ' - Cargo picked' + lb + warnings;
    } else if (!data.hasJob && hasJob) {
        warnings = data.realNow + ' - Cargo delivered' + lb + warnings;
        deliveryWarning = 0;
    }
    hasJob = data.hasJob;

    if (!hasJob) {
        data.job.deadlineTime = '';
        data.job.sourceCity = '';
        data.job.sourceCompany = '';
        data.job.destinationCity = '';
        data.job.destinationCompany = '';
        data.trailer.name = '';
        data.trailer.mass = '';
        data.job.income = '';
        data.job.remainingTime = '';
    }

    data.navigation.estimatedDistance = unitConverter(data.navigation.estimatedDistance);
    data.truck.speed = unitConverter(data.truck.speed);
    data.navigation.speedLimit = unitConverter(data.navigation.speedLimit);

    //non job  stuff
    t = new Date(data.game.nextRestStopTime);
    data.fatigueIndicator = (t.getUTCHours() * 60) + t.getUTCMinutes();
    data.driverFatigueTime = minsToReadableTime(data.fatigueIndicator, utils);

    data.truck.wearEngine *= 1000;
    data.truck.wearTransmission *= 1000;
    data.truck.wearCabin *= 1000;
    data.truck.wearChassis *= 1000;
    data.truck.wearWheels *= 1000;
    data.trailer.wear *= 1000;

    // Fake news
    //data.trailer.wear = 120;

    var wearSumPercent = data.truck.wearEngine + data.truck.wearTransmission + data.truck.wearCabin + data.truck.wearChassis;
    var h = Math.min(wearSumPercent / 250, 1);
    $('.truck-wearOff').css('height', (128 - (h * 111)));
    h = Math.min(data.truck.wearWheels / 150, 1);
    $('.truck-wearWheelOff').css('height', (150 - (h * 39)));
    h = Math.min(data.trailer.wear / 250, 1);
    $('.trailer-wearOff').css('height', (103 - (h * 86)));

    //warning
    t = (data.truck.wearEngine > 50) || (data.truck.wearTransmission > 50) || (data.truck.wearCabin > 50) || (data.truck.wearChassis > 50) || (wearSumPercent > 100);
    if (t) {
        if (truckWearWarning !== true) {
            warnings = data.realNow + ' - ' + 'You should repair the truck' + lb + warnings;
            indicatorStarter(true, true);
        }
    }
    truckWearWarning = t;
    t = (data.truck.wearWheels > 125);
    if (t) {
        if (truckWheelsWearWarning !== true) {
            warnings = data.realNow + ' - ' + 'Your tyres are getting worn' + lb + warnings;
            indicatorStarter(true, true);
        }
    }
    truckWheelsWearWarning = t;

    wearSumPercent += data.truck.wearWheels;
    wearSumPercent = Math.min(wearSumPercent, 1000);

    // warning
    data.trailer.wear = utils.formatFloat(data.trailer.wear, 2);
    data.trailer.wearWarning = false;
    if (data.trailer.wear > 200) {
        $('.trailer-wearValue').css('color', '#ffe0e0');
        data.trailer.wearWarning = true;
    } else if (data.trailer.wear > 100) {
        $('.trailer-wearValue').css('color', '#ffeb9d');
    } else {
        $('.trailer-wearValue').css('color', '#333333');
    }



    var wearDelta = Math.floor(data.trailer.wear) - lastTrailerWear;
    if (wearDelta > 9) {
        lastWearDelta += wearDelta;
        warnings = data.realNow + ' - Trailer worn by ' + wearDelta + '‰' + lb + warnings;
        indicatorStarter(true, false);
        $('.trailer-wearDelta').css('transition', 'top 3s');
        $('.trailer-wearDelta').css('top', '1530px');
        $('.trailer-wearDelta').css('opacity', '1');
        lastTrailerWear = Math.floor(data.trailer.wear / 10) * 10;
    } else if (wearDelta < 0 && data.hasJob) {
        warnings = data.realNow + ' - Reloaded ' + lb + warnings;
        lastWearDelta = 0;
        lastTrailerWear = Math.floor(data.trailer.wear / 10) * 10;
    }

    if (indicatorStarted === false) {
        $('.trailer-wearDelta').css('opacity', '0');
        $('.trailer-wearDelta').css('transition', 'top 0s');
        $('.trailer-wearDelta').css('top', '1610px');
        lastWearDelta = 0;
    }
    data.trailer.wearDelta = utils.formatFloat(lastWearDelta, 2);

    //warning
    var vTop = (unit === 'km') ? 5 : 3;
    data.navigation.cityLimits = (data.game.timeScale !== roadTimeScale) ? 2 : 0;
    if (data.navigation.speedLimit !== 0) {
        if (Math.floor(data.truck.speed) > data.navigation.speedLimit + vTop) {
            data.navigation.speedWarning = true;
            data.navigation.cityLimits += 1;
            data.lastWarning += 'Slow down' + lb;
            if (data.hasJob) { indicatorStarter(true, false); }
            $('.navigation-speedWarningOn').css('transition', 'opacity 0.5s');
            $('.navigation-speedWarningOn').css('opacity', '1');
        }
        if (Math.floor(data.truck.speed) < data.navigation.speedLimit) {
            data.navigation.speedWarning = false;
            $('.navigation-speedWarningOn').css('transition', 'opacity 10s');
            $('.navigation-speedWarningOn').css('opacity', '0');
        } else {
            $('.navigation-speedWarningOn').css('transition', 'opacity 0.5s');
            $('.navigation-speedWarningOn').css('opacity', (Math.floor(data.truck.speed) - data.navigation.speedLimit) / (vTop + 1));
        }
    } else {
        $('.navigation-speedWarningOn').css('transition', 'opacity 0.5s');
        $('.navigation-speedWarningOn').css('opacity', '0');
    }

    // job stuff

    // calculating job viability
    var remTime = new Date(data.job.remainingTime);
    remTime = Math.round((remTime - zDay) / 60000);
    var resTime = new Date(data.game.nextRestStopTime);
    resTime = Math.round((resTime - zDay) / 60000);

    // at averange speed
    data.navigation.averageSpeed = '';
    data.navigation.averageEstimatedTime = '?';
    data.navigation.averageStopsNeeded = '-';
    data.navigation.averageStopsAvailable = '-';
    data.navigation.averageRemainingTime = '?';
    data.navigation.averageLeavingTime = '?';
    if (data.navigation.estimatedDistance > 0) {
        var estTime = new Date(data.navigation.estimatedTime);
        estTime = Math.round((estTime - zDay) / 60000);
        var idleTime = remTime - estTime;
        var overTime = estTime - resTime;
        if ((data.hasJob) && (estTime > 0)) {
            data.navigation.averageEstimatedTime = estTime;
            data.navigation.averageSpeed = Math.round((3 * data.navigation.estimatedDistance) / (50 * estTime));
            data.navigation.averageStopsNeeded = (overTime < 0) ? 0 : Math.ceil(overTime / data.driverWorkTime);
            data.navigation.averageStopsAvailable = (idleTime < 0) ? 0 : Math.floor(idleTime / data.driverSleepTime);
            data.navigation.averageRemainingTime = idleTime - (data.navigation.averageStopsNeeded * data.driverSleepTime);
            if (overTime < 0) { overTime += data.driverWorkTime; }
            data.navigation.averageLeavingTime = (data.driverWorkTime - (overTime % data.driverWorkTime)) % data.driverWorkTime;
        }
        data.realEstimateTime = estTime / roadTimeScale;
    }

    // at actual speed
    data.navigation.actualEstimatedTime = '?';
    data.navigation.actualStopsNeeded = '-';
    data.navigation.actualStopsAvailable = '-';
    data.navigation.actualRemainingTime = '?';
    data.navigation.actualLeavingTime = '?';
    if (Math.round(data.truck.speed) === 0) {
        data.navigation.actualSpeed = 'stopped';
    } else {
        data.navigation.actualSpeed = Math.round(data.truck.speed / 5) * 5;
        data.navigation.actualSpeed = data.navigation.actualSpeed < 5 ? 5 : data.navigation.actualSpeed;
        if (data.navigation.estimatedDistance > 0) {
            estTime = Math.round((3 * data.navigation.estimatedDistance) / (50 * data.navigation.actualSpeed));
            data.navigation.actualEstimatedTime = estTime;
            overTime = estTime - resTime;
            idleTime = remTime - estTime;
            if (data.hasJob) {
                data.navigation.actualStopsNeeded = (overTime < 0) ? 0 : Math.ceil(overTime / data.driverWorkTime);
                data.navigation.actualStopsAvailable = (idleTime < 0) ? 0 : Math.floor(idleTime / data.driverSleepTime);
                data.navigation.actualRemainingTime = idleTime - (data.navigation.actualStopsNeeded * data.driverSleepTime);
            } else {
                data.navigation.actualStopsNeeded = '-';
                data.navigation.actualStopsAvailable = '-';
                data.navigation.actualRemainingTime = '?';
            }
            if (overTime < 0) { overTime += data.driverWorkTime; }
            data.navigation.actualLeavingTime = (data.driverWorkTime - (overTime % data.driverWorkTime)) % data.driverWorkTime;
        }
        data.realEstimateTime = estTime / roadTimeScale;
    }

    //at minimal speed
    data.navigation.minimalSpeed = '';
    data.navigation.minimalEstimatedTime = '?';
    data.navigation.minimalStopsNeeded = '-';
    data.navigation.minimalStopsAvailable = '-';
    data.navigation.minimalRemainingTime = '?';
    data.navigation.minimalLeavingTime = '?';
    if (data.navigation.estimatedDistance > 3000 && data.hasJob) {
        var minsToPark = 45;
        var minThreshold = (remTime - resTime) % (data.driverWorkTime + data.driverSleepTime);
        if (minThreshold < 0) { minThreshold += (data.driverWorkTime + data.driverSleepTime); } //Solving negative modulus
        var estAdjust = (minThreshold > data.driverSleepTime) ? (minThreshold) - (data.driverWorkTime + data.driverSleepTime) : 0;
        var minStopsNeeded = Math.floor((remTime - resTime) / (data.driverSleepTime + data.driverWorkTime));
        if (estAdjust < 0) { ++minStopsNeeded; }
        estTime = resTime + (minStopsNeeded * data.driverWorkTime) + estAdjust - minsToPark;
        if (estTime < minsToPark) { estTime += (minsToPark - estTime) / 2; } // getting close but not enough to deliver under 45 min
        overTime = estTime - resTime;
        idleTime = remTime - estTime;
        if ((data.hasJob) && (estTime > 0)) {
            data.navigation.minimalEstimatedTime = estTime;
            data.navigation.minimalStopsNeeded = minStopsNeeded;
            data.navigation.minimalStopsAvailable = (idleTime < 0) ? 0 : Math.floor(idleTime / data.driverSleepTime);
            data.navigation.minimalSpeed = Math.round((3 * data.navigation.estimatedDistance) / (50 * estTime));
            data.navigation.minimalRemainingTime = idleTime - (data.navigation.minimalStopsNeeded * data.driverSleepTime);
            if (overTime < 0) { overTime += data.driverWorkTime; }
            data.navigation.minimalLeavingTime = (data.driverWorkTime - (overTime % data.driverWorkTime)) % data.driverWorkTime;
        }
    }

    //the new minimal speed, if you stop now to sleep
    var newMinSpeed = '-';
    var newMinStopsAvailable = '-';
    var newMinStopsNeeded = '-';
    var newMinRemainingTime = '?';
    var newMinLeavingTime = '?';
    if ((data.navigation.estimatedDistance > 3000) && (data.navigation.minimalStopsAvailable > 0)) {
        minThreshold = (remTime - data.driverSleepTime - data.driverWorkTime) % (data.driverWorkTime + data.driverSleepTime);
        if (minThreshold < 0) { minThreshold += (data.driverWorkTime + data.driverSleepTime); }
        estAdjust = (minThreshold > data.driverSleepTime) ? (minThreshold) - (data.driverWorkTime + data.driverSleepTime) : 0;
        newMinStopsNeeded = Math.floor((remTime - data.driverSleepTime - data.driverWorkTime) / (data.driverSleepTime + data.driverWorkTime));
        if (estAdjust < 0) { ++newMinStopsNeeded; }
        estTime = data.driverWorkTime + (newMinStopsNeeded * data.driverWorkTime) + estAdjust - minsToPark;
        if (estTime < minsToPark) { estTime += (minsToPark - estTime) / 2; }
        overTime = estTime - data.driverWorkTime;
        idleTime = remTime - data.driverSleepTime - estTime;
        newMinStopsAvailable = (idleTime < 0) ? 0 : Math.floor(idleTime / data.driverSleepTime);
        newMinSpeed = Math.round((3 * data.navigation.estimatedDistance) / (50 * estTime));
        newMinRemainingTime = idleTime - (newMinStopsAvailable * data.driverSleepTime);
        if (overTime < 0) { overTime += data.driverWorkTime; }
        newMinLeavingTime = (data.driverWorkTime - (overTime % data.driverWorkTime)) % data.driverWorkTime;
    }

    //debuging
    //data.lastWarning += newMinSpeed + ((unit==='mi') ? ' mph ' : ' km/h ') + "<font style='font-size:50px;'> S: " + newMinStopsNeeded + '/' + newMinStopsAvailable + ' E: ' + minsToReadableTime(estTime, utils);
    //data.lastWarning += ' R: ' + minsToReadableTime(newMinRemainingTime, utils) + ' L: ' + minsToReadableTime(newMinLeavingTime, utils) + '</font>' + lb;
    data.navigation.newMinimalSpeed = "<font style='font-size:60px;'>" + ((newMinSpeed === 'Infinity') ? '-' : newMinSpeed) + '</font>' + ((unit === 'mi') ? ' mph ' : ' km/h ');

    //warning
    if (data.navigation.estimatedDistance > 0 && data.navigation.estimatedDistance < 30000 && data.hasJob && data.job.destinationCompany !== '') {
        data.lastWarning += "Deliver it to <font style='color: #00bdff'>" + data.job.destinationCompany + '</font>' + lb;
    }

    //warning
    vTop = unitConverter(60);
    var vBase = unitConverter(50);
    t = (newMinSpeed - vBase) / (vTop - vBase);
    var r = Math.round((t * (221 - 72)) + 72);
    var g = Math.round((t * (221 - 222)) + 222);
    var b = Math.round((t * (221 - 22)) + 22);
    $('.navigation-newMinimalSpeed').css('color', 'rgb(' + r + ', ' + g + ', ' + b + ')');
    if (data.fatigueIndicator > 120) {
        $('.driverFatigueTime').css('color', '#dddddd');
        if ((newMinSpeed < 0) || (newMinSpeed > vTop)) {
            data.driverFatigue = 0;
            $('.fatigueIndicator').css('background-color', '#dddddd');
        } else if (newMinSpeed < vBase) {
            data.driverFatigue = 1;
            $('.fatigueIndicator').css('background-color', '#48de16');
        } else {
            data.driverFatigue = 0;
            $('.fatigueIndicator').css('background-color', 'rgb(' + r + ', ' + g + ', ' + b + ')');
        }
    } else if (data.fatigueIndicator <= 60) {
        if (data.driverFatigue !== 3) {
            s = 'Stop at the next place to rest' + lb;
            data.lastWarning += (data.truck.engineRpm !== 0) ? s : '';
            if (driverFatigue !== 3) {
                warnings = data.realNow + ' - ' + s + warnings;
                indicatorStarter(true, false);
                $('.fatigueIndicator').css('background-color', '#ef003a');
                $('.driverFatigueTime').css('color', '#ef003a');
            }
        }
        data.driverFatigue = 3;
    } else if (data.fatigueIndicator <= 120) {
        if (data.driverFatigue !== 2) {
            s = 'Find a place to rest' + lb;
            data.lastWarning += (data.truck.engineRpm !== 0) ? s : '';
            if (driverFatigue !== 2) {
                warnings = data.realNow + ' - ' + s + warnings;
                indicatorStarter(true, false);
                $('.fatigueIndicator').css('background-color', '#efbd3a');
                $('.driverFatigueTime').css('color', '#efbd3a');
            }
        }
        data.driverFatigue = 2;
    }
    driverFatigue = data.driverFatigue;


    // warning 
    vTop = unitConverter(70);
    vBase = unitConverter(60);
    if ((data.truck.engineRpm === 0) && (data.hasJob) && (data.navigation.estimatedDistance > 3000)) {
        s = (estTime < 0) ? "<font style='font-size: 60px; color:#ef003a;'>You'll not be able to deliver it on time</font>" + lb
            : "<font style='font-size: 50px;'>If you sleep, the mininal speed will be <font style='" + ((newMinSpeed > 65) ? "color:#ef003a;'>" : "color:#48de16;'>") + newMinSpeed + ' ' + ((unit === 'km') ? 'km/h' : 'mph') + '</font>' + lb
            + "On arrival, it'll remain " + minsToReadableTime(newMinRemainingTime, utils) + ' before deadline,' + lb + "and you'll have " + minsToReadableTime(newMinLeavingTime, utils) + ' of working time.' + lb;
        if (data.fatigueIndicator > 600) {
            s = "<font style='color:#ef003a; font-size: 100px;'><b>Do NOT sleep</b></font>";
        } else if (data.fatigueIndicator > 210) {
            s = ((newMinSpeed > vTop) ? "<font style='color:#ef003a; font-size: 80px;'><b>Do NOT sleep</b></font>"
                : "<font font-size: 80px;'><b>You don't need to sleep</b></font>") + lb + s;
        } else {
            s = ((newMinSpeed < vBase) ? "<font style='font-size: 75px; color:#48de16;'><b>Good time to sleep</b></font>"
                : "<font style='font-size: 65px; color:#ef003a;'><b>After sleeping, you'll have to speed up</b></font>") + lb + s;
        }
        data.lastWarning = s + data.lastWarning;
    }

    // warning 
    data.truck.speedUpWarning = 0;
    if ((data.game.timeScale === roadTimeScale) && (data.truck.speed > 5) && (data.truck.speed < data.navigation.minimalSpeed)) {
        data.truck.speedUpWarning = (data.truck.speed < data.navigation.speedLimit) ? 1 : 2;
    }

    // warning
    t1 = new Date(data.game.time);
    t2 = new Date(data.job.deadlineTime);
    if (t2 > zDay) {
        t = (t2 - t1) / 60000;
        if (t < 0) {
            t = Math.abs(t);
            data.lastWarning += 'Delivery is late by: <font style="color:#ef003a;">' + minsToReadableTime(t, utils) + '</font>' + lb;
            if (deliveryWarning !== 2) {
                $('.job-remainingTime').css('color', '#ef003a');
                warnings = data.realNow + ' - Delivery is late' + lb + warnings;
                indicatorStarter(true, true);
            }
            deliveryWarning = 2;
        } else if (t < 120) {
            if (deliveryWarning !== 1) {
                $('.job-remainingTime').css('color', '#efbd3a');
                warnings = data.realNow + ' - You need to deliver in: ' + minsToReadableTime(t, utils) + lb + warnings;
                indicatorStarter(true, true);
            }

            deliveryWarning = 1;
        } else {
            $('.job-remainingTime').css('color', '#d2ffc5');
            deliveryWarning = 0;
        }
    }

    //adding some formating  
    if (data.navigation.actualSpeed === 'stopped') {
        $('.navigation-actualSpeed').css('color', '#aaa');
    } else if (data.navigation.actualSpeed < data.navigation.minimalSpeed) {
        $('.navigation-actualSpeed').css('color', '#ff9d9d');
    } else if (data.navigation.actualSpeed < data.navigation.averageSpeed) {
        $('.navigation-actualSpeed').css('color', '#ffeb9d');
    } else {
        $('.navigation-actualSpeed').css('color', '#b4ff9d');
    }

    data.truck.wearSum = utils.formatFloat(wearSumPercent, 2) + '‰';
    data.truck.wearEngine = utils.formatFloat(data.truck.wearEngine, 2) + '‰';
    data.truck.wearTransmission = utils.formatFloat(data.truck.wearTransmission, 2) + '‰';
    data.truck.wearCabin = utils.formatFloat(data.truck.wearCabin, 2) + '‰';
    data.truck.wearChassis = utils.formatFloat(data.truck.wearChassis, 2) + '‰';
    data.truck.wearWheels = utils.formatFloat(data.truck.wearWheels, 2) + '‰';
    data.truck.fuelLiters = utils.formatFloat(data.truck.fuel, 0) + 'l';

    data.game.time = weekday[t1.getUTCDay()] + ', ' + utils.formatInteger(t1.getUTCHours(), 2) + ':' + utils.formatInteger(t1.getUTCMinutes(), 2);
    data.job.deadlineTime = (t2 > zDay) ? weekday[t2.getUTCDay()] + ', ' + utils.formatInteger(t2.getUTCHours(), 2) + ':' + utils.formatInteger(t2.getUTCMinutes(), 2) : '';
    data.trailer.wearValue = data.trailer.wear + "<font style='font-size: 50px;'>‰</font>";
    data.trailer.wearDelta = '+' + data.trailer.wearDelta + "<font style='font-size: 50px;'>‰</font>";
    data.trailer.wear = data.trailer.wear + '‰';
    data.cargo.damage = utils.formatFloat(data.cargo.damage * 1000, 2) + '‰';
    data.cargo.mass = (data.cargo.mass > 0) ? Math.round(data.cargo.mass / 1000) + ' tons' : '';
    data.job.income = (data.job.income > 0) ? '€ ' + data.job.income : '';
    if (data.hasJob) {
        if (deliveryWarning === 2) {
            t = (t1 - t2) / 60000;
            data.job.remainingTime = minsToReadableTime(t, utils);
        } else {
            t = new Date(data.job.remainingTime);
            data.job.remainingTime = (t >= zDay) ? ((t.getUTCDate() > 1) ? (t.getUTCDate() - 1) + 'd ' : '') + utils.formatInteger(t.getUTCHours(), 2) + ':' + utils.formatInteger(t.getUTCMinutes(), 2) : '';
        }
    } else {
        data.job.remainingTime = '';
    }
    data.navigation.estimatedDistance = (data.navigation.estimatedDistance > 0) ? Math.round(data.navigation.estimatedDistance / 1000) + ' ' + unit : '';


    data.navigation.actualSpeed = (data.navigation.actualSpeed > 0) ? data.navigation.actualSpeed + ((unit === 'km') ? ' km/h' : ' mph') : '';
    data.navigation.averageSpeed = (data.navigation.averageSpeed > 0) ? data.navigation.averageSpeed + ((unit === 'km') ? ' km/h' : ' mph') : '';
    data.navigation.minimalSpeed = (data.navigation.minimalSpeed > 0) ? data.navigation.minimalSpeed + ((unit === 'km') ? ' km/h' : ' mph') : '';

    data.navigation.actualEstimatedTime = minsToReadableTime(data.navigation.actualEstimatedTime, utils);
    data.navigation.averageEstimatedTime = minsToReadableTime(data.navigation.averageEstimatedTime, utils);
    data.navigation.minimalEstimatedTime = minsToReadableTime(data.navigation.minimalEstimatedTime, utils);

    data.navigation.actualStopsAvailable = 'of ' + data.navigation.actualStopsAvailable;
    data.navigation.averageStopsAvailable = 'of ' + data.navigation.averageStopsAvailable;
    data.navigation.minimalStopsAvailable = 'of ' + data.navigation.minimalStopsAvailable;

    data.navigation.actualRemainingTime = minsToReadableTime(data.navigation.actualRemainingTime, utils);
    data.navigation.actualLeavingTime = minsToReadableTime(data.navigation.actualLeavingTime, utils);
    data.navigation.averageRemainingTime = minsToReadableTime(data.navigation.averageRemainingTime, utils);
    data.navigation.averageLeavingTime = minsToReadableTime(data.navigation.averageLeavingTime, utils);
    data.navigation.minimalRemainingTime = minsToReadableTime(data.navigation.minimalRemainingTime, utils);
    data.navigation.minimalLeavingTime = minsToReadableTime(data.navigation.minimalLeavingTime, utils);

    if (data.realEstimateTime > 0) {
        t = new Date();
        data.realEstimateTime = data.realEstimateTime + (t.getHours() * 60) + t.getMinutes();
        data.realEstimateTime = data.realEstimateTime % (24 * 60);
        data.realEstimateTime = minsToReadableTime(data.realEstimateTime, utils);
    } else {
        data.realEstimateTime = '';
    }
    data.realEstimateTime = (data.game.paused) ? "<font style='font-size: 75px;'>Paused</font>" : data.realEstimateTime;

    //data.lastWarning = data.lastWarning + 'km/l: ' + utils.formatFloat(fuelConsumption,4) + ' l: ' + Math.floor(data.truck.fuel);
    fuelConsumption = (data.truck.fuelAverageConsumption === 0) ? fuelConsumption : data.truck.fuelAverageConsumption;
    data.truck.estimatedFuelRange = (fuelConsumption === 0) ? '' : Math.round(data.truck.fuel / fuelConsumption) + ' ' + unit;

    data.warnings = warnings;
    // return changed data to the core for rendering
    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {

    if (data.game.connected === true) {
        $('.navigation-speedWarning').css('visibility', 'visible');
        $('.navigation-speedWarningOn').css('visibility', 'visible');
        $('.truck-wearOff').css('visibility', 'visible');
        $('.truck-wearOn').css('visibility', 'visible');
        $('.trailer-wearOff').css('visibility', 'visible');
        $('.trailer-wearOn').css('visibility', 'visible');
        $('.truck-wearWheelOff').css('visibility', 'visible');
        $('.truck-wearWheelOn').css('visibility', 'visible');
        $('.fatigueGuage').css('visibility', 'visible');
        $('.fatigueIndicator').css('visibility', 'visible');
    } else {
        $('.navigation-speedWarning').css('visibility', 'hidden');
        $('.navigation-speedWarningOn').css('visibility', 'hidden');
        $('.truck-wearOff').css('visibility', 'hidden');
        $('.truck-wearOn').css('visibility', 'hidden');
        $('.trailer-wearOff').css('visibility', 'hidden');
        $('.trailer-wearOn').css('visibility', 'hidden');
        $('.truck-wearWheelOff').css('visibility', 'hidden');
        $('.truck-wearWheelOn').css('visibility', 'hidden');
        $('.fatigueGuage').css('visibility', 'hidden');
        $('.fatigueIndicator').css('visibility', 'hidden');
    }
    if (data.navigation.speedLimit === 0) {
        $('.navigation-speedLimit').css('visibility', 'hidden');
    } else {
        $('.navigation-speedLimit').css('visibility', 'visible');
    }

    if (data.navigation.actualSpeed === 'stopped') {
        $('.realEstimateTime').css('color', '#0077a0');
    } else {
        $('.realEstimateTime').css('color', '#00bdff');
    }

    if (tablePage === 0) {
        $('.basicDataTable').css('visibility', 'visible');
        $('.page').css('left', '0px');
    } else {
        $('.basicDataTable').css('visibility', 'hidden');
    }
    if (tablePage === 1) {
        $('.progressTable').css('visibility', 'visible');
        $('.progressTable2').css('visibility', 'visible');
        $('.page').css('left', '270px');
    } else {
        $('.progressTable').css('visibility', 'hidden');
        $('.progressTable2').css('visibility', 'hidden');
    }
    if (tablePage === 2) {
        $('.wearTable').css('visibility', 'visible');
        $('.page').css('left', '540px');
    } else {
        $('.wearTable').css('visibility', 'hidden');
    }
    if (tablePage === 3) {
        $('.warningsTable').css('visibility', 'visible');
        $('.page').css('left', '810px');
    } else {
        $('.warningsTable').css('visibility', 'hidden');
    }
};