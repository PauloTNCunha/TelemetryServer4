//I'd like to thank specially the following people from SCS message board
// Funbit for his clean to read program and very smart way to use the SCS telemetry API: https://github.com/Funbit/ets2-telemetry-server/releases/tag/3.2.5
// Mike for porting the Telemetry server to SCS SDK 1.10: https://github.com/mike-koch/ets2-telemetry-server/releases/tag/4.0.0
// Jianqun for his amazing T Dashboard skin: https://forum.scssoft.com/viewtopic.php?f=34&t=250736#p861086. Thanks for the class, you'll see bits and pieces of your work in my coding.
// Trinity4u for teaching me the physics of transmissions and speeds and how to use localStorage.

//skinConfig - a copy of the skin configuration from config.json
//data - same data object as in the filter function
//utils - an object containing several utility functions (see skin tutorial for more information)
Funbit.Ets.Telemetry.Dashboard.prototype.internalFilter = function (data) {
    //overwriting the original function in dashboard-core.js. 
    //data.game.time, data.job.deadlineTime, and data.job.remainingTime must remain dates.
    return data;
};

const lb = '<br/>';
var tPaused = 'Paused';
var tRetreived = 'Displaying data from the last game';
var tEMWarning1 = "Unfortunately, the jobs for the World of Truck don't update the remaining time, so we can't calculate speeds and rest stops.";
var tEMWarning2 = 'Please, pause the game, and enter above the Remaining Time shown in the top-left corner of the main screen.';
var tEMWarning3 = 'Tap elsewhere to close this table.';
var tOffLine1 = 'Start the game and get in a truck';
var tOffLine2 = "Check your wi-fi or relaunch the ETS2Telemetry if you're already driving";
var tSlowDown = 'Slow Down';
var tTo = 'To: ';
var tImpossibleSchedule = 'Undoable schedule';
var tScheduleCompromised = 'Schedule is compromised';
var tRestNextStop = 'Rest at next stop';
var tConsiderStop = 'Consider stop for rest';
var tScheduleSeemsGood = 'schedule seems good';
var tScheduleMayBeCompromised = 'schedule may be compromised';
var tWithinCityLimits = 'within city limits';
var tYouNeedRest = 'You NEED to rest';
var tGoodTimeRest = 'Good time to rest';
var tRestIfWish = 'Rest if you wish';
var tDontNeedRest = "You don't need to rest";
var tDoNotRest = 'Do NOT rest';
var tDeliveryOverdue = 'The delivery is overdue';
var tDeliveryLast1h = 'Last than 1h to deadline';
var tDeliveryLast2h = 'Last than 2h to deadline';
var tScheduleOk = 'Schedule seems ok';
var tSpeedUp = 'Better speed up';
var tRepairTheTruck = 'Repair the truck';
var tChangeTruckTyres = 'Change truck tyres';
var tKilometer = 'Kilometer';
var tMiles = 'Miles';
var tKPH = 'km/h';
var tMPH = 'mph';
var tWeeday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var zDay;           //day zero 
var jobWoT;
var deadlineTimeEM;
var actualTable = document.getElementById('Principal');
var driverWorkTime;
var driverSleepTime;
var hasJob = false;
var unit = '';
var roadTimeScale = 19;
var fuelConsumption = 0;
//global warnings
var message = '';
var speedWarning = false;

Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var ratio = windowHeight / skinConfig.height > windowWidth / skinConfig.width ? ratio = windowWidth / skinConfig.width : windowHeight / skinConfig.height;
    $('title').html(skinConfig.title);
    $('body').css('transform', 'scale(' + ratio + ')');
    $('.dashboard').css('width', windowWidth / ratio);
    $('.dashboard').css('height', windowHeight / ratio);
    $('div.PrincipalMessage').css('height', (windowHeight - document.getElementById('PrincipalMessage').getBoundingClientRect().top) / ratio + 'px');

    //Language switch
    //alert(navigator.language.toLowerCase());
    if (navigator.language.substring(0, 5).toLowerCase() === 'pt-br') {
        document.getElementById('tSummary').innerHTML = 'Resumo';
        document.getElementById('tNavDate').innerHTML = 'Data:';
        document.getElementById('tNavDeadline').innerHTML = 'Prazo:';
        document.getElementById('tNavCargo').innerHTML = 'Carga:';
        document.getElementById('tNavWeight').innerHTML = 'Peso:';
        document.getElementById('tNavFrom').innerHTML = 'De:';
        document.getElementById('tNavTo').innerHTML = 'Para:';
        document.getElementById('tNavDistance').innerHTML = 'Distância:';
        document.getElementById('tNavRange').innerHTML = 'Alcance:';
        document.getElementById('tNavRemaining').innerHTML = 'Restando:';
        document.getElementById('tNavRevenue').innerHTML = 'Receita:';
        document.getElementById('tNavUnit').innerHTML = 'Unidade:';
        document.getElementById('tEM').innerHTML = 'WoT';
        document.getElementById('tEMTime').innerHTML = 'Data:';
        document.getElementById('tEMDeadline').innerHTML = 'Prazo:';
        document.getElementById('tEMRemainingTime').innerHTML = 'Tempo Restante:';
        document.getElementById('tEMDays').innerHTML = 'Dias:';
        document.getElementById('tEMHours').innerHTML = 'Horas:';
        document.getElementById('tEMMinutes').innerHTML = 'Minutos:';
        document.getElementById('tEMSubmit').innerHTML = 'Enviar';
        document.getElementById('tDamage').innerHTML = 'Dano';
        document.getElementById('tDamageCargo').innerHTML = 'Carga:';
        document.getElementById('tDamageTrailer').innerHTML = 'Carreta';
        document.getElementById('tDamageTrailerChassis').innerHTML = 'Chassi:';
        document.getElementById('tDamageTrailerWheels').innerHTML = 'Pneus:';
        document.getElementById('tDamageTruck').innerHTML = 'Cavalo';
        document.getElementById('tDamageTruckEngine').innerHTML = 'Motor:';
        document.getElementById('tDamageTruckCabin').innerHTML = 'Cabine:';
        document.getElementById('tDamageTruckChassis').innerHTML = 'Chassi:';
        document.getElementById('tDamageTruckWheels').innerHTML = 'Pneus:';
        document.getElementById('tProgress').innerHTML = 'Progresso';
        document.getElementById('tProgressActual').innerHTML = 'Atual';
        document.getElementById('tProgressActualEstimated').innerHTML = 'Estimativa:';
        document.getElementById('tProgressActualStops').innerHTML = 'Paradas:';
        document.getElementById('tProgressActualRemaining').innerHTML = 'Restará:';
        document.getElementById('tProgressActualLeaving').innerHTML = 'Sobrará:';
        document.getElementById('tProgressMinimal').innerHTML = 'Mínima';
        document.getElementById('tProgressMinimalEstimated').innerHTML = 'Estimativa:';
        document.getElementById('tProgressMinimalStops').innerHTML = 'Paradas:';
        document.getElementById('tProgressMinimalRemaining').innerHTML = 'Restará:';
        document.getElementById('tProgressMinimalLeaving').innerHTML = 'Sobrará:';
        document.getElementById('tProgressResting').innerHTML = 'Se Parar';
        document.getElementById('tProgressRestingEstimated').innerHTML = 'Estimativa:';
        document.getElementById('tProgressRestingStops').innerHTML = 'Paradas:';
        document.getElementById('tProgressRestingRemaining').innerHTML = 'Restará:';
        document.getElementById('tProgressRestingLeaving').innerHTML = 'Sobrará:';

        tPaused = 'Pausa';
        tRetreived = 'Exibindo dados do último jogo';
        tEMWarning1 = 'Os trabalhos para o World of Truck infelizmente não indicam o tempo restante e, sem isso, não há como calcular as velocidades e as paradas.';
        tEMWarning2 = 'Pause o jogo e digite nos campos acima o Tempo Restante indicado no canto superior esquerdo da tela principal.';
        tEMWarning3 = 'Toque em qualquer outro lugar para fechar esta tela.';
        tOffLine1 = 'Inicie o jogo e entre na cabine';
        tOffLine2 = 'Verifique o wi-fi ou reinicie o ETS2Telemetry se já estiver dirigindo';
        tSlowDown = 'Devagar';
        tTo = 'Para: ';
        tImpossibleSchedule = 'Prazo irrealizável';
        tScheduleCompromised = 'Prazo apertado';
        tRestNextStop = 'Descanse na próxima parada';
        tConsiderStop = 'Pare para descançar';
        tScheduleSeemsGood = 'o prazo está bom';
        tScheduleMayBeCompromised = 'prazo em risco';
        tWithinCityLimits = 'dentro de cidade';
        tYouNeedRest = 'Você PRECISA descansar';
        tGoodTimeRest = 'Boa hora para descansar';
        tRestIfWish = 'Se quiser, descanse';
        tDontNeedRest = 'Não precisa descansar';
        tDoNotRest = 'NÃO DESCANSE';
        tDeliveryOverdue = 'Prazo não cumprido';
        tDeliveryLast1h = 'Menos de 1h para entrega';
        tDeliveryLast2h = 'Menos de 2h para entrega';
        tScheduleOk = 'O prazo está bom';
        tSpeedUp = 'Ganhe tempo';
        tRepairTheTruck = 'Conserte o caminhão';
        tChangeTruckTyres = 'Troque os pneus do caminhão';
        tKilometer = 'Quilômetros';
        tMiles = 'Milhas';
        tKPH = 'km/h';
        tMPH = 'mph';

        if (skinConfig.width > skinConfig.height) {
            document.getElementById('tNav').innerHTML = 'Navegação';
            document.getElementById('tDamageTruckTransmission').innerHTML = 'Transmissão:';
            tWeeday = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        } else {
            document.getElementById('tNav').innerHTML = 'Nav';
            document.getElementById('tDamageTruckTransmission').innerHTML = 'Transm.:';
            tWeeday = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        }

    } else {

        if (skinConfig.width > skinConfig.height) {
            document.getElementById('tNav').innerHTML = 'Navigation';
            document.getElementById('tDamageTruckTransmission').innerHTML = 'Transmission:';
            tWeeday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        } else {
            document.getElementById('tNav').innerHTML = 'Nav';
            document.getElementById('tDamageTruckTransmission').innerHTML = 'Transm.:';
            tWeeday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        }

    }

    zDay = new Date('0001-01-01T00:00:00Z');
    deadlineTimeEM = new Date(zDay);

    var d = document.getElementById('RemainingTimeD');
    var h = document.getElementById('RemainingTimeH');
    var m = document.getElementById('RemainingTimeM');
    for (i = 0; i < 8; i++) {
        o = document.createElement("option");
        o.text = utils.formatInteger(i, 2);
        o.className = "RemainingTimeForm";
        d.add(o);
    }
    for (i = 0; i < 24; i++) {
        o = document.createElement("option");
        o.text = utils.formatInteger(i, 2);
        o.className = "RemainingTimeForm";
        h.add(o);
    }
    for (i = 0; i < 60; i++) {
        o = document.createElement("option");
        o.text = utils.formatInteger(i, 2);
        o.className = "RemainingTimeForm";
        m.add(o);
    }

    document.getElementById("dashboard").addEventListener("click", function (ev) {
        var t;
        t = ev.target;
        while ((typeof t.title === "undefined" || t.title === "") && t.id !== "dashboard") {
            t = t.parentElement;
        }
        switch (t.title) {
            case 'Unit':
                unit = unit === 'km' ? 'mi' : 'km';
                break;
            case 'Submit Remaining Time':
                defExtMarketDeadlineTime(utils);
                $(actualTable).css('visibility', 'collapse');
                actualTable = document.getElementById('Principal');
                $(actualTable).css('visibility', 'visible');
                break;
            default:
                t = document.getElementById(t.title);
                if (t === null) t = document.getElementById('Principal');
                if (actualTable !== t) {
                    $(actualTable).css('visibility', 'collapse');
                    $(t).css('visibility', 'visible');
                    actualTable = t;
                }
                break;
        }
    }, false);
};

defExtMarketDeadlineTime = function (utils) {
    var d = document.getElementById('RemainingTimeD');
    var h = document.getElementById('RemainingTimeH');
    var m = document.getElementById('RemainingTimeM');
    var minutes = parseInt(d.options[d.selectedIndex].text) * 1440 + parseInt(h.options[h.selectedIndex].text) * 60 + parseInt(m.options[m.selectedIndex].text);
    deadlineTimeEM = new Date(Date.now());
    deadlineTimeEM.setUTCMinutes(deadlineTimeEM.getUTCMinutes() + minutes);
};

minsToReadableTime = function (mins, utils) {
    return mins === '?' ? '--:--' : (mins < 0 ? '-' : '') + utils.formatInteger(Math.floor(Math.abs(mins) / 60), 2) + ':' + utils.formatInteger(Math.floor(Math.abs(mins) % 60), 2);
};

unitConverter = function (value) {
    return unit === 'mi' ? Math.round(value * 0.621371) : value;
};

var trucklLicensePlate;
var truckWheelCount;
var truckActiveWheels;
SetTruck = function (data) {
    if (trucklLicensePlate === data.truck.licensePlate && truckWheelCount === data.truck.wheelCount)
        return;

    for (i = 0; i < 4; i++)
        $('#TruckWheel' + i)[0].setAttribute("style", "display:none");

    trucklLicensePlate = data.truck.licensePlate;
    truckWheelCount = data.truck.wheelCount;

    if (data.truck.wheelCount === 0)
        return;

    switch (data.truck.wheelCount) {
        case 8:
            truckActiveWheels = [0, 1, 2, 3];
            $('#TruckCover1')[0].setAttribute("style", "display:none");
            $('#TruckFender3')[0].setAttribute("style", "display:inline");
            $('#TruckFender3End')[0].setAttribute("style", "display:none");
            $('#TruckFender4End')[0].setAttribute("style", "display:inline");
            break;
        case 6:
            truckActiveWheels = [0, 2, 3];
            $('#TruckCover1')[0].setAttribute("style", "display:inline");
            $('#TruckFender3')[0].setAttribute("style", "display:inline");
            $('#TruckFender3End')[0].setAttribute("style", "display:none");
            $('#TruckFender4End')[0].setAttribute("style", "display:inline");
            break;
        default:
            truckActiveWheels = [0, 2];
            $('#TruckCover1')[0].setAttribute("style", "display:inline");
            $('#TruckFender3')[0].setAttribute("style", "display:none");
            $('#TruckFender3End')[0].setAttribute("style", "display:inline");
            $('#TruckFender4End')[0].setAttribute("style", "display:none");
            break;
    }



    var wheelStyle;
    for (i = 0; i < truckActiveWheels.length; i++) {
        if (data.truck.wheels[2 * i].steerable) {
            wheelStyle = data.truck.wheels[2 * i].liftable ? 'fill:url(#GradTruckWheelSteerable);opacity:0.5' : 'fill:url(#GradTruckWheelSteerable)';
        } else if (data.truck.wheels[2 * i].powered) {
            wheelStyle = data.truck.wheels[2 * i].liftable && i > 1 ? 'fill:url(#GradTruckWheelPowered);opacity:0.5' : 'fill:url(#GradTruckWheelPowered)';
        } else {
            wheelStyle = data.truck.wheels[2 * i].liftable ? 'fill:url(#GradTruckWheelNormal);opacity:0.5' : 'fill:url(#GradTruckWheelNormal)';
        }
        $('#TruckWheel' + truckActiveWheels[i])[0].setAttribute("style", wheelStyle);
    }

};

var trailer0LicensePlate;
var trailerWheelCount;
var trailerActiveWheels;
SetTrailer = function (data) {
    if (trailer0LicensePlate === data.trailers[0].licensePlate && trailerWheelCount === data.trailers[0].wheelCount)
        return;

    trailer0LicensePlate = data.trailers[0].licensePlate;

    for (i = 0; i < 4; i++)
        $('#TrailerWheel' + i)[0].setAttribute("style", "display:none");

    if (data.trailerCount === 0) return;
    trailerWheelCount = data.trailers[0].wheelCount;

    if (data.trailers[0].wheelCount === 0)
        return;

    if (data.trailers[0].wheelCount > 7) {
        trailerActiveWheels = [0, 1, 2, 3];
        $('#TrailerCover0')[0].setAttribute("style", "display:none");
        $('#TrailerCover1')[0].setAttribute("style", "display:none");
        $('#TrailerCover2')[0].setAttribute("style", "display:none");
        $('#TrailerCover3')[0].setAttribute("style", "display:none");
    } else if (data.trailers[0].wheelCount === 6) {
        if (data.trailers[0].wheels[5].position.z - data.trailers[0].wheels[3].position.z > 2) {
            trailerActiveWheels = [0, 1, 3];
            $('#TrailerCover0')[0].setAttribute("style", "display:none");
            $('#TrailerCover1')[0].setAttribute("style", "display:none");
            $('#TrailerCover2')[0].setAttribute("style", "display:inline");
            $('#TrailerCover3')[0].setAttribute("style", "display:none");
        } else {
            trailerActiveWheels = [1, 2, 3];
            $('#TrailerCover0')[0].setAttribute("style", "display:inline");
            $('#TrailerCover1')[0].setAttribute("style", "display:none");
            $('#TrailerCover2')[0].setAttribute("style", "display:none");
            $('#TrailerCover3')[0].setAttribute("style", "display:none");
        }
    } else if (data.trailers[0].wheelCount === 4) {
        trailerActiveWheels = [2, 3];
        $('#TrailerCover0')[0].setAttribute("style", "display:inline");
        $('#TrailerCover1')[0].setAttribute("style", "display:inline");
        $('#TrailerCover2')[0].setAttribute("style", "display:none");
        $('#TrailerCover3')[0].setAttribute("style", "display:none");
    } else if (data.trailers[0].wheelCount === 2) {
        trailerActiveWheels = [3];
        $('#TrailerCover0')[0].setAttribute("style", "display:inline");
        $('#TrailerCover1')[0].setAttribute("style", "display:inline");
        $('#TrailerCover2')[0].setAttribute("style", "display:inline");
        $('#TrailerCover3')[0].setAttribute("style", "display:none");
    } else {
        trailerActiveWheels = [1, 2, 3];
        $('#TrailerCover0')[0].setAttribute("style", "display:inline");
        $('#TrailerCover1')[0].setAttribute("style", "display:none");
        $('#TrailerCover2')[0].setAttribute("style", "display:none");
        $('#TrailerCover3')[0].setAttribute("style", "display:none");
    }

    
    var wheelStyle;
    var deltaR = 0;
    for (i = 0; i < trailerActiveWheels.length; i++) {
        if (data.trailers[0].wheels[2 * i].steerable) {
            wheelStyle = data.trailers[0].wheels[2 * i].liftable ? 'fill:url(#GradTrailerWheelSteerable);opacity:0.5' : 'fill:url(#GradTrailerWheelSteerable)';
        } else if (data.trailers[0].wheels[2 * i].powered) {
            wheelStyle = data.trailers[0].wheels[2 * i].liftable ? 'fill:url(#GradTrailerWheelPowered);opacity:0.5' : 'fill:url(#GradTrailerWheelPowered)'; 
        } else {
            wheelStyle = data.trailers[0].wheels[2 * i].liftable ? 'fill:url(#GradTrailerWheelNormal);opacity:0.5' : 'fill:url(#GradTrailerWheelNormal)';
        }
        $('#TrailerWheel' + trailerActiveWheels[i])[0].setAttribute("style", wheelStyle);
        deltaR = 5 - Math.round(10 * data.trailers[0].wheels[2 * i].radius);
        $('#TrailerFender' + trailerActiveWheels[i])[0].setAttribute("transform", "translate(0," + 2 * deltaR +")");
        $('#TrailerWheel' + trailerActiveWheels[i])[0].setAttribute("r", 18 - deltaR);
        $('#TrailerWheel' + trailerActiveWheels[i])[0].setAttribute("cy", 123 + deltaR);
    }
    $('#TrailerFender4End')[0].setAttribute("transform", "translate(0," + 2 * deltaR + ")");
};

CheckLiftables = function (data) {
    if (data.truck.wheelCount === 0) return;
    for (i = 0; i < truckActiveWheels.length; i++) {
        if (data.truck.wheels[2 * i].liftable)
            if (data.truck.wheels[2 * i].lifted) {
                $('#TruckWheel' + truckActiveWheels[i])[0].setAttribute("cy", "116");
            } else {
                $('#TruckWheel' + truckActiveWheels[i])[0].setAttribute("cy", "123");
            }
    }

    if (data.trailerCount === 0) return;
    for (i = 0; i < trailerActiveWheels.length; i++) {
        if (data.trailers[0].wheels[2 * i].liftable)
            if (data.trailers[0].wheels[2 * i].lifted) {
                $('#TrailerWheel' + trailerActiveWheels[i])[0].setAttribute("cy", "116");
            } else {
                $('#TrailerWheel' + trailerActiveWheels[i])[0].setAttribute("cy", "123");
            }
    }
};

Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {
    var t;
    var remTime;

    if (data.game.connected === false) {
        jobWoT = false;
        message += tOffLine1 + lb + '<font style="font-size: 50%;">' + tOffLine2 + '</font>' + lb;
        //Retrieving data
        if (localStorage.getItem("TelemetryData") !== null) data = JSON.parse(localStorage.getItem("TelemetryData"));
        data.retrieved = true;
        if (data.game.gameName === undefined) data.game.gameName = '';
        message += lb + '<font style="font-size: 75%; color: #e1b04c;">' + tRetreived + '</font>' + lb + lb;
    } else {
        //Saving data
        data.retrieved = false;
        localStorage.setItem("TelemetryData", JSON.stringify(data));
    }
    //localStorage.removeItem("TelemetryData");


    if (jobWoT) {
        //remtime computed from real time
        if (deadlineTimeEM > zDay) {
            remTime = new Date(zDay);
            remTime.setUTCMinutes(remTime.getUTCMinutes() + roadTimeScale * Math.floor((deadlineTimeEM - Date.now()) / 60000));
            data.job.remainingTime = JSON.stringify(remTime).replace(/"/g, '');
            var deadlineTime = new Date(data.game.time);
            deadlineTime.setUTCMinutes(deadlineTime.getUTCMinutes() + remTime.getUTCMinutes());
            data.job.deadlineTime = JSON.stringify(deadlineTime).replace(/"/g, '');
            data.realEstimatedTime = (deadlineTimeEM - Date.now()) / 60000;
        } else {
            data.navigation.message +=
                "<font color='#f6c050'>" + tEMWarning1 + "</font>" + lb +
                "<font color='#f0e6d2'>" + tEMWarning2 + "</font>" + lb +
                "<font color='#5e4d29'>" + tEMWarning3 + "</font>" + lb ;
        }
    }

    if (isNaN(driverWorkTime)) {
        if (data.game.gameName === 'ATS') {
            if (unit === '') { unit = 'mi'; }
            driverWorkTime = 14 * 60;             // ATS times - checked
            driverSleepTime = 10 * 60;
            roadTimeScale = 20;
        } else {
            if (unit === '') { unit = 'km'; }
            driverWorkTime = 11 * 60;             // ETS standard times
            driverSleepTime = 9 * 60;
            //driverWorkTime = 17 * 60;            // ETS Brazilian times 
            //driverSleepTime = 7 * 60;            // Yes, we overwork a lot to have a decent income. That's a huge problem.
            roadTimeScale = 19;
        }
    }
    data.navigation.cityLimits = data.game.timeScale !== roadTimeScale ? 2 : 0;


    if (data.game.connected === true) {
        SetTruck(data);
        SetTrailer(data);
        CheckLiftables(data);
    }

    if (data.job.jobMarket !== '' && !hasJob) {
        //Do something when job changed
        hasJob = true;
        if (actualTable !== document.getElementById('Navigation')) {
            $(actualTable).css('visibility', 'collapse');
            actualTable = document.getElementById('Navigation');
            $(actualTable).css('visibility', 'visible');
        }
        if (data.job.deadlineTime === '0001-01-01T00:00:00Z') {
            jobWoT = true;
            document.getElementById('PrincipalRemaining').setAttribute('title', 'Remaining Time');
            $(actualTable).css('visibility', 'collapse');
            actualTable = document.getElementById('Remaining Time');
            $(actualTable).css('visibility', 'visible');
        } else {
            setTimeout(function () {
                if (actualTable === document.getElementById('Navigation')) {
                    $(actualTable).css('visibility', 'collapse');
                    actualTable = document.getElementById('Principal');
                    $(actualTable).css('visibility', 'visible');
                }
            }, 10000);
        }
    } else if (data.job.jobMarket === '' && hasJob) {
        hasJob = false;
        jobWoT = false;
        document.getElementById('PrincipalRemaining').setAttribute('title', 'Navigation');
        deadlineTimeEM = new Date(zDay);
        $('td.PrincipalRemaining').css('animation', '');
        $('td.PrincipalRemaining').css('color', '#f0e6d2');
    }

    data.hasJob = hasJob;

    //Wear
    data.truck.wearEngine *= 1000;
    data.truck.wearTransmission *= 1000;
    data.truck.wearCabin *= 1000;
    data.truck.wearChassis *= 1000;
    data.truck.wearWheels *= 1000;
    data.cargo.damage = hasJob ? data.cargo.damage * 1000 : '--';
    data.trailerWearWheels = '--';
    data.trailerWearChassis = '--';
    data.trailerAttached = false;
    if (data.trailerCount > 0) {
        data.trailerWearWheels = 1000 * data.trailers[0].wearWheels;
        data.trailerWearChassis = 1000 * data.trailers[0].wearChassis;
        data.trailerAttached = data.trailers[0].attached;
    }
    var truckSum = data.truck.wearEngine + data.truck.wearTransmission + data.truck.wearCabin + data.truck.wearChassis;
    var trailerSum = data.trailerWearChassis;

    //JOB STUFF
    //Job viability
    remTime = new Date(data.job.remainingTime);
    remTime = Math.round((remTime - zDay) / 60000);
    var resTime = new Date(data.game.nextRestStopTime);
    resTime = Math.round((resTime - zDay) / 60000);
    var estTime = 0;
    var idleTime = 0;
    var overTime = 0;

    // at actual speed
    data.navigation.actualSpeed = '--';
    data.navigation.actualEstimatedTime = '?';
    data.navigation.actualStopsNeeded = '--';
    data.navigation.actualStopsAvailable = '--';
    data.navigation.actualRemainingTime = '?';
    data.navigation.actualLeavingTime = '?';
    if (Math.round(data.truck.speed) === 0) {
        data.navigation.actualSpeed = 'stopped';
    } else {
        data.navigation.actualSpeed = Math.round(data.truck.speed / 5) * 5;
        data.navigation.actualSpeed = data.navigation.actualSpeed < 5 ? 5 : data.navigation.actualSpeed;
        if (data.navigation.estimatedDistance > 0) {
            estTime = Math.round(3 * data.navigation.estimatedDistance / (50 * data.navigation.actualSpeed));
            data.navigation.actualEstimatedTime = estTime;
            overTime = estTime - resTime;
            idleTime = remTime - estTime;
            if (data.hasJob) {
                data.navigation.actualStopsNeeded = overTime < 0 ? 0 : Math.ceil(overTime / driverWorkTime);
                data.navigation.actualStopsAvailable = idleTime < 0 ? 0 : Math.floor(idleTime / driverSleepTime);
                data.navigation.actualRemainingTime = idleTime - data.navigation.actualStopsNeeded * driverSleepTime;
            } else {
                data.navigation.actualStopsNeeded = '--';
                data.navigation.actualStopsAvailable = '--';
                data.navigation.actualRemainingTime = '?';
            }
            if (overTime < 0) { overTime += driverWorkTime; }
            data.navigation.actualLeavingTime = (driverWorkTime - overTime % driverWorkTime) % driverWorkTime;
        }
        if (!jobWoT) data.realEstimatedTime = estTime / roadTimeScale;
    }

    //at minimal speed
    data.navigation.minimalSpeed = '--';
    data.navigation.minimalEstimatedTime = '?';
    data.navigation.minimalStopsNeeded = '--';
    data.navigation.minimalStopsAvailable = '--';
    data.navigation.minimalRemainingTime = '?';
    data.navigation.minimalLeavingTime = '?';
    if (data.navigation.estimatedDistance > 3000 && data.hasJob) {
        var minsToPark = 45;
        var minThreshold = (remTime - resTime) % (driverWorkTime + driverSleepTime);
        if (minThreshold < 0) { minThreshold += driverWorkTime + driverSleepTime; } //Solving negative modulus
        var estAdjust = minThreshold > driverSleepTime ? minThreshold - (driverWorkTime + driverSleepTime) : 0;
        var minStopsNeeded = Math.floor((remTime - resTime) / (driverSleepTime + driverWorkTime));
        if (estAdjust < 0) { ++minStopsNeeded; }
        estTime = resTime + minStopsNeeded * driverWorkTime + estAdjust - minsToPark;
        if (estTime < minsToPark) { estTime += (minsToPark - estTime) / 2; } // getting close but not enough to deliver under 45 min
        overTime = estTime - resTime;
        idleTime = remTime - estTime;
        if (data.hasJob && estTime > 0) {
            data.navigation.minimalEstimatedTime = estTime;
            data.navigation.minimalStopsNeeded = minStopsNeeded;
            data.navigation.minimalStopsAvailable = idleTime < 0 ? 0 : Math.floor(idleTime / driverSleepTime);
            data.navigation.minimalSpeed = Math.round(3 * data.navigation.estimatedDistance / (50 * estTime));
            data.navigation.minimalRemainingTime = idleTime - data.navigation.minimalStopsNeeded * driverSleepTime;
            if (overTime < 0) { overTime += driverWorkTime; }
            data.navigation.minimalLeavingTime = (driverWorkTime - overTime % driverWorkTime) % driverWorkTime;
        }
    }

    //the new minimal speed, if you stop now to rest
    data.navigation.newMinimalSpeed = '--';
    data.navigation.newMinimalEstimatedTime = '?';
    data.navigation.newMinimalStopsNeeded = '--';
    data.navigation.newMinimalStopsAvailable = '--';
    data.navigation.newMinimalRemainingTime = '?';
    data.navigation.newMinimalLeavingTime = '?';
    if (data.navigation.estimatedDistance > 3000 && data.hasJob) {
        remTime -= driverSleepTime;
        resTime = driverWorkTime;
        minThreshold = (remTime - resTime) % (driverWorkTime + driverSleepTime);
        if (minThreshold < 0) { minThreshold += driverWorkTime + driverSleepTime; } //Solving negative modulus
        estAdjust = minThreshold > driverSleepTime ? minThreshold - (driverWorkTime + driverSleepTime) : 0;
        minStopsNeeded = Math.floor((remTime - resTime) / (driverSleepTime + driverWorkTime));
        if (estAdjust < 0) { ++minStopsNeeded; }
        estTime = resTime + minStopsNeeded * driverWorkTime + estAdjust - minsToPark;
        if (estTime < minsToPark) { estTime += (minsToPark - estTime) / 2; } // getting close but not enough to deliver under 45 min
        overTime = estTime - resTime;
        idleTime = remTime - estTime;
        if (data.hasJob && estTime > 0) {
            data.navigation.newMinimalEstimatedTime = estTime;
            data.navigation.newMinimalStopsNeeded = minStopsNeeded;
            data.navigation.newMinimalStopsAvailable = idleTime < 0 ? 0 : Math.floor(idleTime / driverSleepTime);
            data.navigation.newMinimalSpeed = Math.round(3 * data.navigation.estimatedDistance / (50 * estTime));
            data.navigation.newMinimalRemainingTime = idleTime - data.navigation.newMinimalStopsNeeded * driverSleepTime;
            if (overTime < 0) { overTime += driverWorkTime; }
            data.navigation.newMinimalLeavingTime = (driverWorkTime - overTime % driverWorkTime) % driverWorkTime;
        }
    }

    //Fatigue
    t = new Date(data.game.nextRestStopTime);
    data.driverFatigueTime = t.getUTCHours() * 60 + t.getUTCMinutes();

    //Range
    fuelConsumption = data.truck.fuelAverageConsumption === 0 ? fuelConsumption : data.truck.fuelAverageConsumption;
    data.truck.estimatedFuelRange = fuelConsumption === 0 ? 0 : Math.round(data.truck.fuel / fuelConsumption);

    //WARNINGS
    //warning truck speed
    var vTop = 5; //unit === 'km' ? 5 : 3;
    if (data.navigation.speedLimit > 0) {
        if (Math.floor(data.truck.speed) > data.navigation.speedLimit + vTop) {
            if (!speedWarning) {
                $('circle.navigation-speedLimit').css('fill', '#f00');
                $('.dashboard').css('animation', 'RedAlert 1s ease infinite alternate');
            }
            message += '<font style="font-size: 100px;">' + tSlowDown + '</font>' + lb;
            speedWarning = true;
            data.navigation.cityLimits += 1;
        } else if (Math.floor(data.truck.speed) > data.navigation.speedLimit) {
            t = Math.floor(255 * (1 - (data.truck.speed - data.navigation.speedLimit) / (vTop + 1)));
            $('circle.navigation-speedLimit').css('fill', 'rgb(255,' + t + ',' + t + ')');
            if (speedWarning) $('.dashboard').css('animation', '');
            speedWarning = false;
        } else if (Math.floor(data.truck.speed) <= data.navigation.speedLimit) {
            $('circle.navigation-speedLimit').css('fill', '#fff');
            $('.dashboard').css('animation', '');
            speedWarning = false;
        }
    } else {
        $('circle.navigation-speedLimit').css('fill', '#fff');
        $('.dashboard').css('animation', '');
    }
    data.navigation.speedWarning = speedWarning;

    //warning close to destiny
    if (data.trailerAttached && hasJob) {
        if (data.navigation.estimatedDistance < 10000 && data.navigation.estimatedDistance > 0) {
            message += tTo + data.job.destinationCompany + lb;
        }
    }

    //Warning minimal speeds
    if (data.navigation.minimalSpeed !== '--') {
        if (data.truck.speed > data.navigation.minimalSpeed) {
            $('td.PrincipalSpeed').css('color', '#13ff00');
            $('th.ProgressSpeedActual').css('color', '#13ff00');
        } else {
            $('td.PrincipalSpeed').css('color', '#f00');
            $('th.ProgressSpeedActual').css('color', '#f00');
        }
        if (data.navigation.averageSpeed > data.navigation.minimalSpeed) {
            $('th.ProgressSpeedAverage').css('color', '#13ff00');
        } else {
            $('th.ProgressSpeedAverage').css('color', '#e3c895');
        }
        if (data.navigation.minimalSpeed > 120) {
            data.navigation.minimalSpeed = '--';
            data.navigation.minimalEstimatedTime = '?';
            data.navigation.minimalStopsNeeded = '--';
            data.navigation.minimalStopsAvailable = '--';
            data.navigation.minimalRemainingTime = '?';
            data.navigation.minimalLeavingTime = '?';
            $('th.ProgressSpeedMinimal').css('color', '#f00');
            $('.navigation-minimalSpeed').css('fill', '#f00');
            message += '<font style="color:#ff6b6b;">' + tImpossibleSchedule + '</font>' + lb;
        } else if (data.navigation.minimalSpeed > 70) {
            $('th.ProgressSpeedMinimal').css('color', '#fffa00');
            $('.navigation-minimalSpeed').css('fill', '#fffa00');
            message += '<font style="color:#ff6b6b;">' + tScheduleCompromised +' </font>' + lb;
        } else {
            $('th.ProgressSpeedMinimal').css('color', '#f0e6d2');
            $('.navigation-minimalSpeed').css('fill', '#f0e6d2');
        }

        if (data.navigation.newMinimalSpeed < 50) {
            $('th.ProgressSpeedNewMinimal').css('color', '#13ff00');
        } else if (data.navigation.newMinimalSpeed < 60) {
            $('th.ProgressSpeedNewMinimal').css('color', '#abdb30');
        } else {
            $('th.ProgressSpeedNewMinimal').css('color', '#ff6b6b');
        }
        var vrad = data.truck.speed * Math.PI / (data.navigation.minimalSpeed * 2);
        if (vrad > Math.PI) vrad = Math.PI;
        $('#GradMostrador')[0].setAttribute("x1", 200 - 100 * Math.sin(vrad));
        $('#GradMostrador')[0].setAttribute("y1", 270 - 100 * Math.cos(vrad));
        $('#GradMostrador')[0].setAttribute("x2", 200 + 100 * Math.sin(vrad));
        $('#GradMostrador')[0].setAttribute("y2", 270 + 100 * Math.cos(vrad));
    }
    if (data.navigation.newMinimalSpeed > 200) {
        data.navigation.newMinimalSpeed = '--';
        data.navigation.newMinimalEstimatedTime = '?';
        data.navigation.newMinimalStopsNeeded = '--';
        data.navigation.newMinimalStopsAvailable = '--';
        data.navigation.newMinimalRemainingTime = '?';
        data.navigation.newMinimalLeavingTime = '?';
        $('.navigation-newMinimalSpeed').css('fill', '#f00');
    }

    //warning close to deadline
    if (hasJob) {
        remTime = new Date(data.job.remainingTime);
        remTime = Math.round((remTime - zDay) / 60000);
        if (remTime === 0) {
            if (data.job.deadlineTime === '0001-01-01T00:00:00Z') {
                $('td.PrincipalRemaining').css('animation', '');
                $('td.PrincipalRemaining').css('color', '#f0e6d2');
            } else {
                remTime = new Date(zDay);
                t = (new Date(data.game.time) - new Date(data.job.deadlineTime)) / 60000;
                remTime.setUTCMinutes(remTime.getUTCMinutes() + (new Date(data.game.time) - new Date(data.job.deadlineTime)) / 60000);
                data.job.remainingTime = JSON.stringify(remTime).replace(/"/g, '');
                $('td.PrincipalRemaining').css('animation', '');
                $('td.PrincipalRemaining').css('color', '#a00');
                message += '<font style="color: #a00;">' + tDeliveryOverdue + '</font>' + lb;
            }
        } else if (remTime < 60) {
            $('td.PrincipalRemaining').css('animation', 'RedAlert 2s ease infinite alternate');
            $('td.PrincipalRemaining').css('color', '#a00');
            message += '<font style="color: #a00;">' + tDeliveryLast1h + '</font>' + lb;
            if (data.navigation.minimalSpeed > 0) {
                message += data.navigation.minimalSpeed < 60 ?
                    '<font style="color: #abdb30;">' + tScheduleOk + '</font>' + lb :
                    '<font style="color:#ff6b6b;">' + tSpeedUp + '</font>' + lb;
            }
        } else if (remTime < 120) {
            $('td.PrincipalRemaining').css('animation', 'YellowAlert 4s ease infinite');
            $('td.PrincipalRemaining').css('color', '#f7ff04');
            message += tDeliveryLast2h + lb;
            if (data.navigation.minimalSpeed > 0) {
                message += data.navigation.minimalSpeed < 60 ?
                    '<font style="color: #abdb30;">' + tScheduleOk + '</font>' + lb :
                    '<font style="color:#ff6b6b;">' + tSpeedUp + '</font>' + lb;
            }
        } else {
            $('td.PrincipalRemaining').css('animation', '');
            $('td.PrincipalRemaining').css('color', '#f0e6d2');
        }
    } else {
        $('td.PrincipalRemaining').css('animation', '');
        $('td.PrincipalRemaining').css('color', '#f0e6d2');
    }

    //warning fadigue
    if (data.driverFatigueTime < 60) {
        if (data.navigation.minimalStopsAvailable > 0) $('td.PrincipalFatigue').css('animation', 'RedAlert 2s ease infinite alternate');
        $('td.PrincipalFatigue').css('color', '#a00');
        $('g.PrincipalFatigue').css('fill', '#a00');
        if (data.truck.engineRpm !== 0 && data.navigation.minimalStopsAvailable > 0) {
            message += '<font style="color: #f00;">' + tRestNextStop + '</font>' + lb;
            if (data.navigation.newMinimalSpeed < 60) { message += '<font style="color: #abdb30;">' + tScheduleSeemsGood + '</font>' + lb; }
        }
    } else if (data.driverFatigueTime < 120) {
        if (data.navigation.minimalStopsAvailable > 0) $('td.PrincipalFatigue').css('animation', 'YellowAlert 2s ease infinite');
        $('td.PrincipalFatigue').css('color', '#aa0');
        $('g.PrincipalFatigue').css('fill', '#aa0');
        if (data.truck.engineRpm !== 0 && data.navigation.minimalStopsAvailable > 0) {
            message += tConsiderStop + lb;
            if (data.navigation.newMinimalSpeed < 60) { message += '<font style="color: #abdb30;">' + tScheduleSeemsGood + '</font>' + lb; }
        }
    } else {
        $('td.PrincipalFatigue').css('animation', '');
        $('td.PrincipalFatigue').css('color', '#f0e6d2');
        $('g.PrincipalFatigue').css('fill', '#00a000');
    }
    if (data.truck.engineRpm === 0 && data.hasJob) {
        if (data.driverFatigueTime < 60) {
            message += '<font style="color: #f00;">' + tYouNeedRest + '</font>' + lb;
        } else if (data.driverFatigueTime < 120) {
            message = tGoodTimeRest + lb + message;
        } else if (data.driverFatigueTime < 300) {
            message += '<font style="color: #f0e6d2;">' + tRestIfWish + '</font>' + lb;
        } else if (data.driverFatigueTime < 480) {
            message += '<font style="color: #f0e6d2;">' + tDontNeedRest + '</font>' + lb;
        } else {
            message += '<font style="font-size: 90px;">' + tDoNotRest + '</font>' + lb;
        }
        if (data.navigation.newMinimalSpeed < 50) {
            message += '<font style="color: #abdb30;">' + tScheduleSeemsGood + '</font>' + lb;
        } else {
            message += tScheduleMayBeCompromised + lb;
        }
        if (data.navigation.cityLimits > 1) { message += '<font style="color: #f0e6d2;">' + tWithinCityLimits + '</font>' + lb; }
    }

    //warning damage
    if (data.game.connected) {
        if (truckSum > 100) {
            message += tRepairTheTruck + lb;
        }
        if (data.truck.wearWheels > 200) {
            message += tChangeTruckTyres + lb;
        }

        var Ds = ["TruckWheelNormal", "TruckWheelSteerable", "TruckWheelPowered", "TrailerWheelNormal", "TrailerWheelSteerable", "TrailerWheelPowered"];
        var Vs = [data.truck.wearWheels, data.truck.wearWheels, data.truck.wearWheels, data.trailerWearWheels, data.trailerWearWheels, data.trailerWearWheels];
        var Ls = [200, 200, 200, 200, 200, 200];
        Ds.forEach(function (item, index) {

            if (isNaN(Vs[index])) {
                $('.' + item).css('fill', 'none');
            } else {
                var g = $('#Grad' + item).children('stop');
                var o = Vs[index] > Ls[index] ? 0 : 1 - Vs[index] / Ls[index];
                var d = o < .1 || o > .9 ? 0 : .1;
                g[0].setAttribute('offset', o - d);
                g[1].setAttribute('offset', o + d);
                $('.' + item).css('fill', 'url(#Grad' + item + ')');
            }
        });

        Ds = ["Trailer", "Truck", "Cargo"];
        Vs = [data.trailerWearChassis, truckSum, data.cargo.damage];
        Ls = [200, 200, 10];
        Ds.forEach(function (item, index) {
            if (isNaN(Vs[index])) {
                $('.' + item).css('fill', 'none');
            } else {
                var g = $('#Grad' + item).children('stop');
                var o = Vs[index] > Ls[index] ? 0 : 1 - Vs[index] / Ls[index];
                var d = o < .1 || o > .9 ? 0 : .1;
                g[0].setAttribute('offset', o - d);
                g[1].setAttribute('offset', o + d);
                $('.' + item).css('fill', 'url(#Grad' + item + ')');
            }
        });

        Ds = ["cargo-damage", "trailerWearChassis", "trailerWearWheels", "truck-wearEngine", "truck-wearTransmission", "truck-wearCabin", "truck-wearChassis", "truck-wearWheels"];
        Vs = [data.cargo.damage, data.trailerWearChassis, data.trailerWearWheels, data.truck.wearEngine, data.truck.wearTransmission, data.truck.wearCabin, data.truck.wearChassis, data.truck.wearWheels];
        Ls = [10, 200, 200, 50, 50, 100, 100, 200];
        Ds.forEach(function (item, index) {
            var o = Vs[index] > Ls[index] ? 0 : 1 - Vs[index] / Ls[index];
            $('.' + item).css('color', 'rgb(255, ' + 255 * o + ', ' + 255 * o + "'");
        });
    }
    //warning drive rest numbers
    data.driveRestNumbers = '--';
    if (data.truck.speed > data.navigation.minimalSpeed) {
        data.driveRestNumbers = data.navigation.actualStopsNeeded + '/' + data.navigation.actualStopsAvailable;
    } else {
        data.driveRestNumbers = data.navigation.minimalStopsNeeded + '/' + data.navigation.minimalStopsAvailable;
    }

    //convertions
    data.truck.speed = isNaN(data.truck.speed) ? '--' : unitConverter(data.truck.speed);
    data.navigation.estimatedDistance = isNaN(data.navigation.estimatedDistance) ? '--' : unitConverter(data.navigation.estimatedDistance);
    data.navigation.speedLimit = isNaN(data.navigation.speedLimit) ? '--' : unitConverter(data.navigation.speedLimit);
    data.navigation.actualSpeed = isNaN(data.navigation.actualSpeed) ? '--' : unitConverter(data.navigation.actualSpeed);
    data.navigation.averageSpeed = isNaN(data.navigation.averageSpeed) ? '--' : unitConverter(data.navigation.averageSpeed);
    data.navigation.minimalSpeed = isNaN(data.navigation.minimalSpeed) ? '--' : unitConverter(data.navigation.minimalSpeed);
    data.navigation.newMinimalSpeed = isNaN(data.navigation.newMinimalSpeed) ? '--' : unitConverter(data.navigation.newMinimalSpeed);
    data.truck.estimatedFuelRange = unitConverter(data.truck.estimatedFuelRange);

    //formating
    data.navigation.actualSpeed = data.navigation.actualSpeed > 0 ? data.navigation.actualSpeed : '--';
    data.navigation.averageSpeed = data.navigation.averageSpeed > 0 ? data.navigation.averageSpeed : '--';
    data.navigation.minimalSpeed = data.navigation.minimalSpeed > 0 ? data.navigation.minimalSpeed : '--';
    data.navigation.newMinimalSpeed = data.navigation.newMinimalSpeed > 0 ? data.navigation.newMinimalSpeed : '--';

    data.navigation.actualEstimatedTime = minsToReadableTime(data.navigation.actualEstimatedTime, utils);
    data.navigation.averageEstimatedTime = minsToReadableTime(data.navigation.averageEstimatedTime, utils);
    data.navigation.minimalEstimatedTime = minsToReadableTime(data.navigation.minimalEstimatedTime, utils);
    data.navigation.newMinimalEstimatedTime = minsToReadableTime(data.navigation.newMinimalEstimatedTime, utils);

    data.navigation.actualRemainingTime = minsToReadableTime(data.navigation.actualRemainingTime, utils);
    data.navigation.averageRemainingTime = minsToReadableTime(data.navigation.averageRemainingTime, utils);
    data.navigation.minimalRemainingTime = minsToReadableTime(data.navigation.minimalRemainingTime, utils);
    data.navigation.newMinimalRemainingTime = minsToReadableTime(data.navigation.newMinimalRemainingTime, utils);

    data.navigation.actualLeavingTime = minsToReadableTime(data.navigation.actualLeavingTime, utils);
    data.navigation.averageLeavingTime = minsToReadableTime(data.navigation.averageLeavingTime, utils);
    data.navigation.minimalLeavingTime = minsToReadableTime(data.navigation.minimalLeavingTime, utils);
    data.navigation.newMinimalLeavingTime = minsToReadableTime(data.navigation.newMinimalLeavingTime, utils);

    data.truck.estimatedFuelRange = data.truck.estimatedFuelRange === 0 ? '--' : data.truck.estimatedFuelRange + ' ' + unit;

    if (isNaN(data.realEstimatedTime)) {
        data.realEstimatedTime = "--:--";
    } else {
        t = new Date();
        data.realEstimatedTime = data.realEstimatedTime + t.getHours() * 60 + t.getMinutes();
        data.realEstimatedTime = data.realEstimatedTime % (24 * 60);
        data.realEstimatedTime = minsToReadableTime(data.realEstimatedTime, utils);
    }
    data.realEstimatedTime = data.retrieved ? "<font style='font-size: 85px;color: #cf9316;'>" + data.game.gameName + "</font>" : data.game.paused && !jobWoT ? "<font style='font-size: 75px;'>" + tPaused + "</font>" : data.realEstimatedTime;

    t = new Date();
    data.realNow = utils.formatInteger(t.getHours(), 2) + ':' + utils.formatInteger(t.getMinutes(), 2);
    data.unit = unit === 'km' ? tKilometer : tMiles;
    data.velUnit = unit === 'km' ? tKPH : tMPH;
    t = new Date(data.game.time);
    data.game.time = isNaN(t) ? '--' : tWeeday[t.getUTCDay()] + ', ' + utils.formatInteger(t.getUTCHours(), 2) + ':' + utils.formatInteger(t.getUTCMinutes(), 2);
    t = new Date(data.job.deadlineTime);
    data.job.deadlineTime = t >= zDay ? tWeeday[t.getUTCDay()] + ', ' + utils.formatInteger(t.getUTCHours(), 2) + ':' + utils.formatInteger(t.getUTCMinutes(), 2) : '--';
    t = new Date(data.job.remainingTime);
    data.job.remainingTime = t >= zDay ? (t.getUTCDate() > 1 ? t.getUTCDate() - 1 + 'd ' : '') + utils.formatInteger(t.getUTCHours(), 2) + ':' + utils.formatInteger(t.getUTCMinutes(), 2) : '--';

    data.cargo.cargo = data.cargo.cargo === '' ? '--' : data.cargo.cargo;
    data.cargo.mass = data.cargo.mass > 0 ? Math.round(data.cargo.mass / 1000) + ' tons' : '--';
    data.job.income = data.job.income > 0 ? '€ ' + data.job.income : '--';

    data.navigation.estimatedDistance = data.navigation.estimatedDistance > 300 ? Math.round(data.navigation.estimatedDistance / 1000) + ' ' + unit : '--';
    data.navigation.speedLimit = data.navigation.speedLimit > 0 ? data.navigation.speedLimit : '';

    data.job.sourceCompany = data.job.sourceCompany === '' ? '--' : data.job.sourceCompany;
    data.job.destinationCompany = data.job.destinationCompany === '' ? '--' : data.job.destinationCompany;
    data.cargoDamage = isNaN(data.cargo.damage) ? '' : utils.formatFloat(data.cargo.damage, 2) + '‰';
    data.cargo.damage = isNaN(data.cargo.damage) ? '--' : utils.formatFloat(data.cargo.damage, 4) + '‰';
    data.truckSum = isNaN(truckSum) ? '--' : utils.formatFloat(truckSum, 2) + '‰';
    data.trailerSum = isNaN(trailerSum) ? '--' : utils.formatFloat(trailerSum, 2) + '‰';
    data.trailerWearChassis = isNaN(data.trailerWearChassis) ? '--' : utils.formatFloat(data.trailerWearChassis, 2) + '‰';
    data.trailerWearWheels = isNaN(data.trailerWearWheels) ? '--' : utils.formatFloat(data.trailerWearWheels, 2) + '‰';
    data.truck.wearEngine = isNaN(data.truck.wearEngine) ? '--' : utils.formatFloat(data.truck.wearEngine, 2) + '‰';
    data.truck.wearTransmission = isNaN(data.truck.wearTransmission) ? '--' : utils.formatFloat(data.truck.wearTransmission, 2) + '‰';
    data.truck.wearCabin = isNaN(data.truck.wearCabin) ? '--' : utils.formatFloat(data.truck.wearCabin, 2) + '‰';
    data.truck.wearChassis = isNaN(data.truck.wearChassis) ? '--' : utils.formatFloat(data.truck.wearChassis, 2) + '‰';
    data.truck.wearWheels = isNaN(data.truck.wearWheels) ? '--' : utils.formatFloat(data.truck.wearWheels, 2) + '‰';

    data.driverFatigueTime = isNaN(data.driverFatigueTime) ? '--' : minsToReadableTime(data.driverFatigueTime, utils);
    data.jobRemainingTime = data.job.remainingTime;


    data.bestGear = "";
    if (data.truck.engineOn === true)
        if ((data.truck.engineRpm > 700 && data.truck.engineRpm < 900) || data.truck.engineRpm > 1600)
            if (data.shifter.gear !== data.shifter.bestGear)
                data.bestGear = ((data.shifter.gear > data.shifter.bestGear) ? "▼" : "▲") + data.shifter.bestGearName;

    //cityLimits
    if (data.navigation.cityLimits > 1 && actualTable === document.getElementById('Principal')) {
        $('g.cityLimits').css('visibility', 'visible');
    } else {
        $('g.cityLimits').css('visibility', 'hidden');
    }

    //retarderBrake
    //if (data.truck.retarderBrake > 0)
    //    message += 'Retarder: ' + data.truck.retarderBrake + '/' + data.truck.retarderStepCount + lb;
    if (data.truck.retarderBrake === 0) {
        $('g.retarderBrake').css('fill', 'rgb(53,53,53)');
    } else {
        let d = (data.truck.retarderBrake / data.truck.retarderStepCount);
        let r = Math.round(156 + 88 * d);
        let g = Math.round(145 + 77 * d);
        let b = Math.round( 72 - 72 * d);
        $('g.retarderBrake').css('fill', 'rgb(' + r + ',' + g + ',' + b + ')');
        //message += 'rgb(' + r + ',' + g + ',' + b + ')' + lb;
    }

    //lights
    if (data.truck.speed > 10 && data.truck.lightsBeamLowOn === false)
        message += 'Turn the lights on' + lb;
    if (data.truck.lightsBeamLowOn && data.truck.lightsBeamHighOn) {
        $('g.lightsBeamHigh').css('fill', '#edb02f');
    } else {
        $('g.lightsBeamHigh').css('fill', '#353535');
    }
    if (data.truck.lightsBeamLowOn) {
        $('g.lightsBeamLow').css('fill', '#edb02f');
    } else {
        $('g.lightsBeamLow').css('fill', '#353535');
    }
    if (data.truck.lightsAuxFrontOn || data.truck.lightsAuxRoofOn) {
        $('g.lightsAux').css('fill', '#edb02f');
    } else {
        $('g.lightsAux').css('fill', '#353535');
    }
    if (data.truck.lightsBeaconOn) {
        $('g.lightsBeacon').css('fill', '#edb02f');
    } else {
        $('g.lightsBeacon').css('fill', '#353535');
    }

    data.message = message;
    message = '';
	
    return data;
};

PushDataAlternative = function (data) {
    //Some cirilic data is falling to get on document. This will push data directly to ID.
    document.getElementById('realNow0').innerHTML = data.realNow;
	document.getElementById('realNow1').innerHTML = data.realNow;
	document.getElementById('realNow2').innerHTML = data.realNow;
	document.getElementById('realNow3').innerHTML = data.realNow;
	document.getElementById('realNow4').innerHTML = data.realNow;

	document.getElementById('realEstimatedTime0').innerHTML = data.realEstimatedTime;
	document.getElementById('realEstimatedTime1').innerHTML = data.realEstimatedTime;
	document.getElementById('realEstimatedTime2').innerHTML = data.realEstimatedTime;
	document.getElementById('realEstimatedTime3').innerHTML = data.realEstimatedTime;
	document.getElementById('realEstimatedTime4').innerHTML = data.realEstimatedTime;

    document.getElementById('job-destinationCity0').innerHTML = data.job.destinationCity;
    document.getElementById('navigation-estimatedDistance0').innerHTML = data.navigation.estimatedDistance;
    document.getElementById('driveRestNumbers').innerHTML = data.driveRestNumbers;
    document.getElementById('driverFatigueTime').innerHTML = data.driverFatigueTime;

    document.getElementById('CargoDamage').innerHTML = data.cargoDamage;
    document.getElementById('navigation-minimalSpeed0').innerHTML = data.navigation.minimalSpeed;
    document.getElementById('jobRemainingTime').innerHTML = data.jobRemainingTime;

    document.getElementById('navigation-speedLimit').innerHTML = data.navigation.speedLimit;
    document.getElementById('bestGear').innerHTML = data.bestGear;

    document.getElementById('PrincipalMessage').innerHTML = data.message;

    document.getElementById('game-time').innerHTML = data.game.time;
    document.getElementById('job-deadlineTime').innerHTML = data.job.deadlineTime;

    document.getElementById('cargo-cargo').innerHTML = data.cargo.cargo;
    document.getElementById('cargo-mass').innerHTML = data.cargo.mass;
    document.getElementById('job-income').innerHTML = data.job.income;

    document.getElementById('job-sourceCity').innerHTML = data.job.sourceCity;
    document.getElementById('job-destinationCity1').innerHTML = data.job.destinationCity;
    document.getElementById('job-sourceCompany').innerHTML = data.job.sourceCompany;
    document.getElementById('job-destinationCompany').innerHTML = data.job.destinationCompany;

    document.getElementById('navigation-estimatedDistance1').innerHTML = data.navigation.estimatedDistance;
    document.getElementById('truck-estimatedFuelRange').innerHTML = data.truck.estimatedFuelRange;
    document.getElementById('job-remainingTime').innerHTML = data.job.remainingTime;

    document.getElementById('unit').innerHTML = data.unit;

    document.getElementById('cargo-damage').innerHTML = data.cargo.damage;
    document.getElementById('trailerWearChassis').innerHTML = data.trailerWearChassis;
    document.getElementById('trailerWearWheels').innerHTML = data.trailerWearWheels;
    document.getElementById('truck-wearEngine').innerHTML = data.truck.wearEngine;
    document.getElementById('truck-wearTransmission').innerHTML = data.truck.wearTransmission;
    document.getElementById('truck-wearCabin').innerHTML = data.truck.wearCabin;
    document.getElementById('truck-wearChassis').innerHTML = data.truck.wearChassis;
    document.getElementById('truck-wearWheels').innerHTML = data.truck.wearWheels;

    document.getElementById('navigation-actualSpeed').innerHTML = data.navigation.actualSpeed;
    document.getElementById('velUnit0').innerHTML = data.velUnit;
    document.getElementById('navigation-actualEstimatedTime').innerHTML = data.navigation.actualEstimatedTime;
    document.getElementById('navigation-actualStopsNeeded').innerHTML = data.navigation.actualStopsNeeded;
    document.getElementById('navigation-actualStopsAvailable').innerHTML = data.navigation.actualStopsAvailable;
    document.getElementById('navigation-actualRemainingTime').innerHTML = data.navigation.actualRemainingTime;
    document.getElementById('navigation-actualLeavingTime').innerHTML = data.navigation.actualLeavingTime;

    document.getElementById('navigation-minimalSpeed1').innerHTML = data.navigation.minimalSpeed;
    document.getElementById('velUnit1').innerHTML = data.velUnit;
    document.getElementById('navigation-minimalEstimatedTime').innerHTML = data.navigation.minimalEstimatedTime;
    document.getElementById('navigation-minimalStopsNeeded').innerHTML = data.navigation.minimalStopsNeeded;
    document.getElementById('navigation-minimalStopsAvailable').innerHTML = data.navigation.minimalStopsAvailable;
    document.getElementById('navigation-minimalRemainingTime').innerHTML = data.navigation.minimalRemainingTime;
    document.getElementById('navigation-minimalLeavingTime').innerHTML = data.navigation.minimalLeavingTime;

    document.getElementById('navigation-newMinimalSpeed').innerHTML = data.navigation.minimalSpeed;
    document.getElementById('velUnit2').innerHTML = data.velUnit;
    document.getElementById('navigation-newMinimalEstimatedTime').innerHTML = data.navigation.newMinimalEstimatedTime;
    document.getElementById('navigation-newMinimalStopsNeeded').innerHTML = data.navigation.newMinimalStopsNeeded;
    document.getElementById('navigation-newMinimalStopsAvailable').innerHTML = data.navigation.newMinimalStopsAvailable;
    document.getElementById('navigation-newMinimalRemainingTime').innerHTML = data.navigation.newMinimalRemainingTime;
    document.getElementById('navigation-newMinimalLeavingTime').innerHTML = data.navigation.newMinimalLeavingTime;
}

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {

    if (data.navigation.actualSpeed === 'stopped' || data.game.paused) {
        $('th.Estimated').css('color', '#cf9316');
    } else {
        $('th.Estimated').css('color', '#f0e6d2');
    }

    if (data.trailerAttached) {
        $('#TrailerWheels').css('opacity', '1');
        $('#Trailer').css('opacity', '1');
        $('#Cargo').css('opacity', '1');
    } else {
        $('#TrailerWheels').css('opacity', '0.25');
        $('#Trailer').css('opacity', '0.25');
        $('#Cargo').css('opacity', '0.25');
    }

    if (jobWoT) {
        $('.realEstimatedTime').css('color', '#71abf7');
        $('td.PrincipalRemaining').css('background-color', 'rgba(113, 171, 247, 0.20)');
    } else {
        $('.realEstimatedTime').css('color', '#f0e6d2');
        $('td.PrincipalRemaining').css('background-color', 'transparent');
    }

};