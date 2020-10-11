Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {
    utils.preloadImages([
        'images/_bigDial.png',
        'images/_smallDial.png',
        'images/_speedLimit.png',
        'images/_symbol.png',
        'images/_tipsTap.png',
        'images/_truckBrand.png',
        'images/_truckBrandDaf.png',
        'images/_truckBrandFreightliner.png',
        'images/_truckBrandInternational.png',
        'images/_truckBrandIveco.png',
        'images/_truckBrandKenworth.png',
        'images/_truckBrandMack.png',
        'images/_truckBrandMan.png',
        'images/_truckBrandMercedesBenz.png',
        'images/_truckBrandPeterbilt.png',
        'images/_truckBrandRenault.png',
        'images/_truckBrandScania.png',
        'images/_truckBrandTesla.png',
        'images/_truckBrandVolvo.png',
        'images/_truckBrandWesternStar.png',
        'images/_truckBrandFord.png',
        'images/_truckBrandSisu.png',
        'images/_truckBrandKamaz.png',
        'images/_truckBrandHino.png'
    ]);

    $(document).ready(function() {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var ratio = windowHeight / 1152;
        if ((windowHeight / 1152) > (windowWidth / 2048)) {
            ratio = windowWidth / 2048;
        }
        var scale = 'scale(' + ratio + ')';
        var dashboardWidth = windowWidth / ratio;
        var dashboardHeight = windowHeight / ratio;
        $('body').css('transform', scale);
        $('.dashboard').css('width', dashboardWidth);
        $('.dashboard').css('height', dashboardHeight);

        var a = 0;
        var b = 0;
        var c = 0;
        var d = 0;
        var e = 0;
        var $noticeShifter = $('._noticeShifter');
        var $noticeDial = $('._noticeDial');
        var $noticeSpeed = $('._noticeSpeed');
        var $switchButton = $('._switchButton');
        var $bigDial = $('._bigDial');
        $('._switchShifter').click(function() {
            $('._displayedGearD').toggle();
            $('._displayedGearH').toggle();
            a = (a + 1) % $noticeShifter.length;
            $noticeShifter.hide(0).eq(a).show(0);
            $noticeShifter.delay(3000).hide(0);
        });
        $('._switchDial').click(function() {
            b = (b + 1) % $switchButton.length;
            c = (c + 1) % $bigDial.length;
            d = (d + 1) % $noticeDial.length;
            $switchButton.css('left', '1544px').eq(b).css('left', '154px');
            $bigDial.css('left', '1390px').eq(c).css('left', '0px');
            $noticeDial.hide(0).eq(d).show(0);
            $noticeDial.delay(3000).hide(0);
        });
        $('._switchSpeed').click(function() {
            $('._speedRoundedKMH').toggle();
            $('._speedRoundedMPH').toggle();
            $('._speedRoundedSymbolKMH').toggle();
            $('._speedRoundedSymbolMPH').toggle();
            $('._cruiseControlKMH').toggle();
            $('._cruiseControlMPH').toggle();
            $('._odometerKMH').toggle();
            $('._odometerMPH').toggle();
            $('._estimatedDistanceKMH').toggle();
            $('._estimatedDistanceMPH').toggle();
            $('._speedLimitKMH').toggle();
            $('._speedLimitMPH').toggle();
            $('._dialScaleKMH').toggle();
            $('._dialScaleMPH').toggle();
            $('._speedKMH').toggle();
            $('._speedMPH').toggle();
            e = (e + 1) % $noticeSpeed.length;
            $noticeSpeed.hide(0).eq(e).show(0);
            $noticeSpeed.delay(3000).hide(0);
        });
        $('._tips').delay(6000).hide(0);
        $('._closeTips').delay(6000).hide(0);
        $('._closeTips').click(function() {
            $('._tips').hide();
            $('._closeTips').hide();
        });

        $('title').html(skinConfig.title);
        $('link[rel="apple-touch-icon"]').attr('href', 'skins/' + skinConfig.name + '/images/apple-touch-icon.png');
        $('link[rel="shortcut icon"]').attr('href', 'skins/' + skinConfig.name + '/images/android-icon.png');
        $('head').append('<link rel="manifest" href="skins/' + skinConfig.name + '/manifest.json">');
    });

    $(window).resize(function () {
        window.location.reload();
    });
};

Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {
    data._electricOn = data.truck.electricOn;
    data._gameATS = data.game.gameName == 'ATS';

    data.truck.speed      = Math.abs(data.truck.speed);
    data._speedRoundedKMH = Math.round(data.truck.speed);
    data._speedRoundedMPH = Math.round(data.truck.speed * 0.621371192);

    data._cruiseControlOn  = data.truck.cruiseControlOn;
    data._cruiseControlKMH = Math.round(data.truck.cruiseControlSpeed);
    data._cruiseControlMPH = Math.round(data.truck.cruiseControlSpeed * 0.621371192);
    
    data._shifterType = data.truck.shifterType == 'automatic' ? 'A'
                      : data.truck.shifterType == 'manual' ? 'M'
                      : data.truck.shifterType == 'hshifter' ? ''
                      : '';
    data._hShifterOn  = data._shifterType == '';

    data.truck.gear = data.truck.displayedGear;

    if (data.truck.forwardGears == 18 && data.truck.reverseGears == 4) {
        data._displayedGearH = data.truck.gear  > 17 ? '8H'  : data.truck.gear > 16 ? '8L'
                             : data.truck.gear  > 15 ? '7H'  : data.truck.gear > 14 ? '7L'
                             : data.truck.gear  > 13 ? '6H'  : data.truck.gear > 12 ? '6L'
                             : data.truck.gear  > 11 ? '5H'  : data.truck.gear > 10 ? '5L'
                             : data.truck.gear  >  9 ? '4H'  : data.truck.gear >  8 ? '4L'
                             : data.truck.gear  >  7 ? '3H'  : data.truck.gear >  6 ? '3L'
                             : data.truck.gear  >  5 ? '2H'  : data.truck.gear >  4 ? '2L'
                             : data.truck.gear  >  3 ? '1H'  : data.truck.gear >  2 ? '1L'
                             : data.truck.gear  >  1 ? 'LH'  : data.truck.gear >  0 ? 'LL'
                             : (data.truck.gear < -3 ? 'R2H' : data.truck.gear < -2 ? 'R2L'
                             : data.truck.gear  < -1 ? 'R1H' : data.truck.gear <  0 ? 'R1L'
                             : 'N');
        data._displayedGearD = data.truck.gear  >  0 ? '' + data.truck.gear
                             : (data.truck.gear <  0 ? 'R' + Math.abs(data.truck.gear)
                             : 'N');
    } else if (data.truck.forwardGears == 13 && data.truck.reverseGears == 3) {
        data._displayedGearH = data.truck.gear  > 12 ? '8H' : data.truck.gear > 11 ? '8L'
                             : data.truck.gear  > 10 ? '7H' : data.truck.gear >  9 ? '7L'
                             : data.truck.gear  >  8 ? '6H' : data.truck.gear >  7 ? '6L'
                             : data.truck.gear  >  6 ? '5H' : data.truck.gear >  5 ? '5L'
                             : data.truck.gear  >  1 ? '' + Math.abs(data.truck.gear - 1)
                             : data.truck.gear  >  0 ? 'L'
                             : (data.truck.gear < -1 ? 'RH' : data.truck.gear <  0 ? 'RL'
                             : 'N');
        data._displayedGearD = data.truck.gear  >  0 ? '' + data.truck.gear
                             : (data.truck.gear <  0 ? 'R' + Math.abs(data.truck.gear)
                             : 'N');
    } else if (data.truck.forwardGears == 10 && data.truck.reverseGears == 2) {
        data._displayedGearH = data.truck.gear  >  0 ? '' + data.truck.gear
                             : (data.truck.gear < -1 ? 'RH' : data.truck.gear < 0 ? 'RL'
                             : 'N');
        data._displayedGearD = data.truck.gear  >  0 ? '' + data.truck.gear
                             : (data.truck.gear <  0 ? 'R' + Math.abs(data.truck.gear)
                             : 'N');
    } else if (data.truck.forwardGears == 16 && data.truck.reverseGears == 2) {
        data._displayedGearH = data.truck.gear  > 15 ? '8H' : data.truck.gear > 14 ? '8L'
                             : data.truck.gear  > 13 ? '7H' : data.truck.gear > 12 ? '7L'
                             : data.truck.gear  > 11 ? '6H' : data.truck.gear > 10 ? '6L'
                             : data.truck.gear  >  9 ? '5H' : data.truck.gear >  8 ? '5L'
                             : data.truck.gear  >  7 ? '4H' : data.truck.gear >  6 ? '4L'
                             : data.truck.gear  >  5 ? '3H' : data.truck.gear >  4 ? '3L'
                             : data.truck.gear  >  3 ? '2H' : data.truck.gear >  2 ? '2L'
                             : data.truck.gear  >  1 ? '1H' : data.truck.gear >  0 ? '1L'
                             : (data.truck.gear < -1 ? 'RH' : data.truck.gear <  0 ? 'RL'
                             : 'N');
        data._displayedGearD = data.truck.gear  >  0 ? '' + data.truck.gear
                             : (data.truck.gear <  0 ? 'R' + Math.abs(data.truck.gear)
                             : 'N');
    } else if (data.truck.forwardGears == 12 && data.truck.reverseGears == 2) {
        data._displayedGearH = data.truck.gear  > 11 ? '6H' : data.truck.gear > 10 ? '6L'
                             : data.truck.gear  >  9 ? '5H' : data.truck.gear >  8 ? '5L'
                             : data.truck.gear  >  7 ? '4H' : data.truck.gear >  6 ? '4L'
                             : data.truck.gear  >  5 ? '3H' : data.truck.gear >  4 ? '3L'
                             : data.truck.gear  >  3 ? '2H' : data.truck.gear >  2 ? '2L'
                             : data.truck.gear  >  1 ? '1H' : data.truck.gear >  0 ? '1L'
                             : (data.truck.gear < -1 ? 'RH' : data.truck.gear <  0 ? 'RL'
                             : 'N');
        data._displayedGearD = data.truck.gear  >  0 ? '' + data.truck.gear
                             : (data.truck.gear <  0 ? 'R' + Math.abs(data.truck.gear)
                             : 'N');
    } else if (data.truck.forwardGears == 14 && data.truck.reverseGears == 2) {
        data._displayedGearH = data.truck.gear  > 13 ? '6H' : data.truck.gear > 12 ? '6L'
                             : data.truck.gear  > 11 ? '5H' : data.truck.gear > 10 ? '5L'
                             : data.truck.gear  >  9 ? '4H' : data.truck.gear >  8 ? '4L'
                             : data.truck.gear  >  7 ? '3H' : data.truck.gear >  6 ? '3L'
                             : data.truck.gear  >  5 ? '2H' : data.truck.gear >  4 ? '2L'
                             : data.truck.gear  >  3 ? '1H' : data.truck.gear >  2 ? '1L'
                             : data.truck.gear  >  1 ? 'C2' : data.truck.gear >  0 ? 'C1'
                             : (data.truck.gear < -1 ? 'RH' : data.truck.gear <  0 ? 'RL'
                             : 'N');
        data._displayedGearD = data.truck.gear  >  2 ? '' + Math.abs(data.truck.gear - 2)
                             : data.truck.gear  >  0 ? 'C' + data.truck.gear
                             : (data.truck.gear <  0 ? 'R' + Math.abs(data.truck.gear)
                             : 'N');
    } else if (data.truck.forwardGears == 14 && data.truck.reverseGears == 4) {
        data._displayedGearH = data.truck.gear  > 13 ? '6H'  : data.truck.gear > 12 ? '6L'
                             : data.truck.gear  > 11 ? '5H'  : data.truck.gear > 10 ? '5L'
                             : data.truck.gear  >  9 ? '4H'  : data.truck.gear >  8 ? '4L'
                             : data.truck.gear  >  7 ? '3H'  : data.truck.gear >  6 ? '3L'
                             : data.truck.gear  >  5 ? '2H'  : data.truck.gear >  4 ? '2L'
                             : data.truck.gear  >  3 ? '1H'  : data.truck.gear >  2 ? '1L'
                             : data.truck.gear  >  1 ? 'C2'  : data.truck.gear >  0 ? 'C1'
                             : (data.truck.gear < -3 ? 'RHH' : data.truck.gear < -2 ? 'RHL'
                             : data.truck.gear  < -1 ? 'RLH' : data.truck.gear <  0 ? 'RLL'
                             : 'N');
        data._displayedGearD = data.truck.gear  >  2 ? '' + Math.abs(data.truck.gear - 2)
                             : data.truck.gear  >  0 ? 'C' + data.truck.gear
                             : (data.truck.gear <  0 ? 'R' + Math.abs(data.truck.gear)
                             : 'N');
    } else if (data.truck.forwardGears == 6 && data.truck.reverseGears == 1) {
        data._displayedGearH = data.truck.gear  >  0 ? '' + data.truck.gear
                             : (data.truck.gear <  0 ? 'R'
                             : 'N');
        data._displayedGearD = data._displayedGearH;
    } else {
        data._displayedGearH = data.truck.gear  >  0 ? '' + data.truck.gear
                             : (data.truck.gear <  0 ? 'R' + Math.abs(data.truck.gear)
                             : 'N');
        data._displayedGearD = data._displayedGearH;
    }

    var language = navigator.language.substring(0, 2);

    if (language == 'de') {
        data._gearIndicatorA   = 'Automatikgetriebe Ganganzeige';
        data._gearIndicatorM   = 'Schaltgetriebe Ganganzeige';
        data._speedometerL     = 'Speedometer (L) Tachometer (R)';
        data._speedometerR     = 'Tachometer (L) Speedometer (R)';
        data._kilometres       = 'Längeneinheiten: Kilometer';
        data._miles            = 'Längeneinheiten: Meilen';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsDE(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsDE(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Spezialtransport' : 'Akt. Auftrag';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsDE(data.job.income) + ',-'
                               : data.job.income != 0
                               ? this.numberToThousandsDE(data.job.income) + ',- €'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableStringDE(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableStringDE(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableStringDE(data.game.nextRestStopTime);
    } else if (language == 'fr') {
        data._gearIndicatorA   = 'Automatic Gear Indicator';
        data._gearIndicatorM   = 'Manual Gear Indicator';
        data._speedometerL     = 'Speedometer (L) Tachometer (R)';
        data._speedometerR     = 'Tachometer (L) Speedometer (R)';
        data._kilometres       = 'Unités de distance : Kilomètres';
        data._miles            = 'Unités de distance : Miles';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsFR(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsFR(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Transport exceptionnel' : 'Mission en cours';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsFR(data.job.income) + ',-'
                               : data.job.income != 0
                               ? this.numberToThousandsFR(data.job.income) + ',- €'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableString(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableString(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableString(data.game.nextRestStopTime);
    } else if (language == 'it') {
        data._gearIndicatorA   = 'Indicatore cambio automatico';
        data._gearIndicatorM   = 'Indicatore cambio manuale';
        data._speedometerL     = 'Speedometer (L) Tachometer (R)';
        data._speedometerR     = 'Tachometer (L) Speedometer (R)';
        data._kilometres       = 'Unità - lunghezza: Chilometri';
        data._miles            = 'Unità - lunghezza: Miglia';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsDE(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsDE(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Trasporti Speciali' : 'Lavoro attuale';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsDE(data.job.income) + ',-'
                               : data.job.income != 0
                               ? '€ ' + this.numberToThousandsDE(data.job.income) + ',-'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableString(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableString(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableString(data.game.nextRestStopTime);
    } else if (language == 'pl') {
        data._gearIndicatorA   = 'Wskaźnik automatycznej skrzyni biegów';
        data._gearIndicatorM   = 'Wskaźnik manualnej skrzyni biegów';
        data._speedometerL     = 'Prędkościomierz (L) Tachometr (R)';
        data._speedometerR     = 'Tachometr (L) Prędkościomierz (R)';
        data._kilometres       = 'Jednostki długości: kilometry';
        data._miles            = 'Jednostki długości: mile';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsFR(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsFR(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Transporty specjalne' : 'Aktualne zlecenie';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsFR(data.job.income) + ',-'
                               : data.job.income != 0
                               ? this.numberToThousandsFR(data.job.income) + ',- €'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableString(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableString(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableString(data.game.nextRestStopTime);
    } else if (language == 'cz') {
        data._gearIndicatorA   = 'Indikátor automatické převodovky';
        data._gearIndicatorM   = 'Ukazatel manuální převodovky';
        data._speedometerL     = 'Speedometer (L) Tachometer (R)';
        data._speedometerR     = 'Tachometer (L) Speedometer (R)';
        data._kilometres       = 'Jednotky délky: kilometry';
        data._miles            = 'Jednotky délky: míle';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsFR(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsFR(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Speciální přeprava' : 'Aktuální zakázka';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsFR(data.job.income) + ',-'
                               : data.job.income != 0
                               ? this.numberToThousandsFR(data.job.income) + ',- €'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableString(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableString(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableString(data.game.nextRestStopTime);
    } else if (language == 'no') {
        data._gearIndicatorA   = 'Automatisk girkasse girindikator';
        data._gearIndicatorM   = 'Manuell girkasse Girindikator';
        data._speedometerL     = 'Speedometer (L) Turteller (R)';
        data._speedometerR     = 'Turteller (L) Speedometer (R)';
        data._kilometres       = 'Avstandsenheter: kilometer';
        data._miles            = 'Avstandsenheter: miles';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsFR(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsFR(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Spesialtransport' : 'Nåværende jobb';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsFR(data.job.income) + ',-'
                               : data.job.income != 0
                               ? '€ ' + this.numberToThousandsFR(data.job.income) + ',-'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableStringNO(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableStringNO(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableStringNO(data.game.nextRestStopTime);
    } else if (language == 'sv') {
        data._gearIndicatorA   = 'Automatisk växellåda kugghjuls indikator';
        data._gearIndicatorM   = 'Manuell växellåda kugghjuls indikator';
        data._speedometerL     = 'Hastighetsmätare (L) Varvräknare (R)';
        data._speedometerR     = 'Varvräknare (L) Hastighetsmätare (R)';
        data._kilometres       = 'Längdenheter: kilometer';
        data._miles            = 'Längdenheter: miles';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsDE(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsDE(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Specialtransport' : 'Nuvarande jobb';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsDE(data.job.income) + ',-'
                               : data.job.income != 0
                               ? this.numberToThousandsDE(data.job.income) + ',- €'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableStringNO(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableStringNO(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableStringNO(data.game.nextRestStopTime);
    } else if (language == 'da') {
        data._gearIndicatorA   = 'Automatisk gearkasse Gearindikator';
        data._gearIndicatorM   = 'Manuel gearkasse Gearindikator';
        data._speedometerL     = 'Speedometer (L) Tachometer (R)';
        data._speedometerR     = 'Tachometer (L) Speedometer (R)';
        data._kilometres       = 'Længdeenheder: kilometer';
        data._miles            = 'Længdeenheder: mil';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsDE(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsDE(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Særlig Transport' : 'Nuværende job';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsDE(data.job.income) + ',-'
                               : data.job.income != 0
                               ? '€ ' + this.numberToThousandsDE(data.job.income) + ',-'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableStringNO(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableStringNO(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableStringNO(data.game.nextRestStopTime);
    } else if (language == 'tr') {
        data._gearIndicatorA   = 'Otomatik Şanzıman Dişli Göstergesi';
        data._gearIndicatorM   = 'Manuel Şanzıman Dişli Göstergesi';
        data._speedometerL     = 'Speedometer (L) Tachometer (R)';
        data._speedometerR     = 'Tachometer (L) Speedometer (R)';
        data._kilometres       = 'Uzunluk Birimleri: Kilometre';
        data._miles            = 'Uzunluk Birimleri: Mil';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsDE(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsDE(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Özel Nakliye' : 'Mevcut iş';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsDE(data.job.income) + ',-'
                               : data.job.income != 0
                               ? this.numberToThousandsDE(data.job.income) + ',- €'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableStringTR(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableStringTR(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableStringTR(data.game.nextRestStopTime);
    } else if (language == 'nl') {
        data._gearIndicatorA   = 'Automatische versnellingsindicator';
        data._gearIndicatorM   = 'Handmatige versnellingsindicator';
        data._speedometerL     = 'Speedometer (L) Tachometer (R)';
        data._speedometerR     = 'Tachometer (L) Speedometer (R)';
        data._kilometres       = 'Lengte eenheden: kilometers';
        data._miles            = 'Lengte eenheden: mijlen';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousandsDE(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousandsDE(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Uitzonderlijk vervoer' : 'Huidige opdracht';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousandsDE(data.job.income) + ',-'
                               : data.job.income != 0
                               ? '€ ' + this.numberToThousandsDE(data.job.income) + ',-'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableStringNL(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableStringNL(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableStringNL(data.game.nextRestStopTime);
    } else {
        data._gearIndicatorA   = 'Automatic Gear Indicator';
        data._gearIndicatorM   = 'Manual Gear Indicator';
        data._speedometerL     = 'Speedometer (L) Tachometer (R)';
        data._speedometerR     = 'Tachometer (L) Speedometer (R)';
        data._kilometres       = 'Length Units: Kilometres';
        data._miles            = 'Length Units: Miles';
        data.cargo.mass        = data.game.gameName == 'ATS'
                               ? this.numberToThousands(Math.floor(data.cargo.mass * 2.20462262)) + ' lb'
                               : this.numberToThousands(Math.floor(data.cargo.mass / 1000.0)) + ' t';
        data._jobTitle         = data.job.specialTransport ? 'Special Transport' : 'Current Job';
        data._jobIncome        = (data.job.income != 0 && data.game.gameName == 'ATS')
                               ? '$ ' + this.numberToThousands(data.job.income) + '.-'
                               : data.job.income != 0
                               ? '€ ' + this.numberToThousands(data.job.income) + '.-'
                               : '';
        data._jobRemains       = (data.job.jobMarket == 'external_contracts' || data.job.jobMarket == 'external_market') ? ''
                               : this.timeDifferenceToReadableString(data.job.remainingTime);
        data._estimatedTime    = this.timeDifferenceToReadableString(data.navigation.estimatedTime);
        data._nextRestStopTime = this.timeDifferenceToReadableString(data.game.nextRestStopTime);
    }

    data._jobCargo       = data.cargo.cargo != ''
                         ? data.cargo.cargo + ' (' + data.cargo.mass + ')' : '';
    data._jobOrigin      = (data.job.sourceCity != '' && data.job.sourceCompany != '')
                         ? data.job.sourceCity + ' - ' + data.job.sourceCompany
                         : data.job.sourceCity != '' ? data.job.sourceCity : '';
    data._jobDestination = (data.job.destinationCity != '' && data.job.destinationCompany != '')
                         ? data.job.destinationCity + ' - ' + data.job.destinationCompany
                         : data.job.destinationCity != '' ? data.job.destinationCity : '';

    data._estimatedDistanceKMH = data.navigation.estimatedDistance > 999
                               ? Math.floor(data.navigation.estimatedDistance / 1000) + ' km, ' + data._estimatedTime
                               : data.navigation.estimatedDistance > 0
                               ? Math.floor(data.navigation.estimatedDistance) + ' m, ' + data._estimatedTime
                               : '';
    data._estimatedDistanceMPH = data.navigation.estimatedDistance > 1609
                               ? Math.floor(data.navigation.estimatedDistance * 0.000621371192) + ' mi, ' + data._estimatedTime
                               : data.navigation.estimatedDistance > 0
                               ? Math.floor(data.navigation.estimatedDistance * 1.0936133) + ' yd, ' + data._estimatedTime
                               : '';

    data.truck.wearEngine       = Math.floor(data.truck.wearEngine * 100);
    data.truck.wearTransmission = Math.floor(data.truck.wearTransmission * 100);
    data.truck.wearCabin        = Math.floor(data.truck.wearCabin * 100);
    data.truck.wearChassis      = Math.floor(data.truck.wearChassis * 100);
    data.truck.wearWheels       = Math.floor(data.truck.wearWheels * 100);
    data._truckWear = Math.max(data.truck.wearEngine,
                               data.truck.wearTransmission,
                               data.truck.wearCabin,
                               data.truck.wearChassis,
                               data.truck.wearWheels) + '%';
    data._trailerWear = data.trailer.attached ? Math.floor(data.trailer.wear * 100) + '%' : '';

    data._speedLimit    = data.navigation.speedLimit > 0;
    data._speedLimitKMH = data.navigation.speedLimit > 0 ? data.navigation.speedLimit : '';
    data._speedLimitMPH = data.navigation.speedLimit > 0 ? Math.round(data.navigation.speedLimit * 0.621371192) : '';
    data._speedLimitFontKMH = data._speedLimitKMH == 100 ? 'Highway Gothic'
                            : data._speedLimitKMH == 121 ? 'Highway Gothic Expanded'
                            : data._speedLimitKMH == 131 ? 'Highway Gothic Expanded'
                            : data._speedLimitKMH == 141 ? 'Highway Gothic Expanded'
                            : data._speedLimitKMH == 151 ? 'Highway Gothic Expanded'
                            : data._speedLimitKMH > 119 ? 'Highway Gothic'
                            : 'Highway Gothic Expanded';
    data._speedLimitFontMPH = data._speedLimitMPH == 100 ? 'Highway Gothic'
                            : data._speedLimitMPH == 121 ? 'Highway Gothic Expanded'
                            : data._speedLimitMPH == 131 ? 'Highway Gothic Expanded'
                            : data._speedLimitMPH == 141 ? 'Highway Gothic Expanded'
                            : data._speedLimitMPH == 151 ? 'Highway Gothic Expanded'
                            : data._speedLimitMPH > 119 ? 'Highway Gothic'
                            : 'Highway Gothic Expanded';

    data._odometerKMH = data.truck.electricOn
                      ? Math.floor(data.truck.odometer) + ' km'
                      : data.truck.make + ' ' + data.truck.model;
    data._odometerMPH = data.truck.electricOn
                      ? Math.floor(data.truck.odometer * 0.621371192) + ' mi'
                      : data.truck.make + ' ' + data.truck.model;
    data._time = this.timeToReadableString(data.game.time);

    data._blinkerLeftOn        = data.truck.blinkerLeftOn;
    data._blinkerRightOn       = data.truck.blinkerRightOn;
    data._fuelWarningOn        = data.truck.fuelWarningOn;
    data._airPressureWarningOn = (data.truck.airPressureWarningOn || data.truck.airPressureEmergencyOn);
    data._retarderOn           = data.truck.retarderBrake > 0;
    data._motorBrakeOn         = data.truck.motorBrakeOn;
    data._parkBrakeOn          = data.truck.parkBrakeOn;
    data._lightsBeamHighOn     = data.truck.lightsBeamHighOn;
    data._lightsBeamLowOn      = data.truck.lightsBeamLowOn;
    data._lightsParkingOn      = data.truck.lightsParkingOn;
    data._lightsBeaconOn       = data.truck.lightsBeaconOn;
    data._wipersOn             = data.truck.wipersOn;

    data._speedKMH = data.truck.speed;
    data._speedMPH = data.truck.speed * 0.621371192;
    data.truck.fuel = data.truck.electricOn ? data.truck.fuel : 0;
    data.truck.airPressure = data.truck.electricOn ? data.truck.airPressure : 0;
    data.truck.airPressureMaxValue = Math.round(data.truck.airPressureWarningValue / 2 * 5);
    data.truck.oilPressure = data.truck.electricOn ? data.truck.oilPressure : 0;
    data.truck.waterTemperature = data.truck.electricOn ? data.truck.waterTemperature : 0;
    data.truck.waterTemperatureMaxValue = Math.round(data.truck.waterTemperatureWarningValue
                                        + data.truck.waterTemperatureWarningValue / 3 * 1.2857);

    data._atsClass = data.game.gameName == 'ATS' ? ' _truckBrandATS ' : ' ';

    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {
    if (data.game.gameName == 'ATS') {
        $('._speedLimitKMH').css('font-family', data._speedLimitFontKMH);
        $('._speedLimitMPH').css('font-family', data._speedLimitFontMPH);
    } else {
        $('._speedLimitKMH').css('font-family', 'Khand Bold');
        $('._speedLimitMPH').css('font-family', 'Khand Bold');
    }

    if (data.truck.electricOn && data.job.jobMarket != '') {
        $('._truckBrand').hide();
        $('._currentJob').show();
    } else {
        $('._truckBrand').show();
        $('._currentJob').hide();
    }

    if (data.truck.electricOn && data.truck.engineRpm > 2000) {
        $('._dialscaleRPM').css('background-position', '0px -658px');
    } else if (data.truck.electricOn && data.truck.engineRpm > 1500) {
        $('._dialscaleRPM').css('background-position', '-658px -658px');
    } else if (data.truck.electricOn) {
        $('._dialscaleRPM').css('background-position', '-658px 0px');
    } else {
        $('._dialscaleRPM').css('background-position', '0px 0px');
    }

    if (data.truck.electricOn && data._speedKMH > 80) {
        $('._dialScaleKMH').css('background-position', '0px -658px');
    } else if (data.truck.electricOn && data._speedKMH > 60) {
        $('._dialScaleKMH').css('background-position', '-658px -658px');
    } else if (data.truck.electricOn) {
        $('._dialScaleKMH').css('background-position', '-658px 0px');
    } else {
        $('._dialScaleKMH').css('background-position', '0px 0px');
    }

    if (data.truck.electricOn && data._speedMPH > 60) {
        $('._dialScaleMPH').css('background-position', '0px -658px');
    } else if (data.truck.electricOn && data._speedMPH > 45) {
        $('._dialScaleMPH').css('background-position', '-658px -658px');
    } else if (data.truck.electricOn) {
        $('._dialScaleMPH').css('background-position', '-658px 0px');
    } else {
        $('._dialScaleMPH').css('background-position', '0px 0px');
    }

    if (data.truck.id == 'renault') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Renault');
    } else if (data.truck.id == 'scania') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Scania');
    } else if (data.truck.id == 'volvo') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Volvo');
    } else if (data.truck.id == 'daf') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Daf');
    } else if (data.truck.id == 'iveco') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Iveco');
    } else if (data.truck.id == 'man') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Man');
    } else if (data.truck.id == 'mercedes') {
        $('._truckBrand').removeClass().addClass('_truckBrand _MercedesBenz');
    } else if (data.truck.id == 'peterbilt') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Peterbilt');
    } else if (data.truck.id == 'kenworth') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Kenworth');
    } else if (data.truck.id == 'international') {
        $('._truckBrand').removeClass().addClass('_truckBrand _International');
    } else if (data.truck.id == 'freightliner') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Freightliner');
    } else if (data.truck.id == 'mack') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Mack');
    } else if (data.truck.id == 'westernstar') {
        $('._truckBrand').removeClass().addClass('_truckBrand _WesternStar');
    } else if (data.truck.id == 'tesla') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Tesla');
    } else if (data.truck.id == 'ford') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Ford');
    } else if (data.truck.id == 'sisu') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Sisu');
    } else if (data.truck.id == 'kamaz') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Kamaz');
    } else if (data.truck.id == 'hino') {
        $('._truckBrand').removeClass().addClass('_truckBrand _Hino');
    } else {
        $('._truckBrand').removeClass().addClass('_truckBrand' + data._atsClass);
    }

    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.numberToThousands = function (num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};

Funbit.Ets.Telemetry.Dashboard.prototype.numberToThousandsDE = function (num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1.');
};

Funbit.Ets.Telemetry.Dashboard.prototype.numberToThousandsFR = function (num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1 ');
};

Funbit.Ets.Telemetry.Dashboard.prototype.isIso8601 = function (date) {
    return /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})Z/.test(date);
};

Funbit.Ets.Telemetry.Dashboard.prototype.formatInteger = function (num, digits) {
    var output = num + "";
    while (output.length < digits)
        output = "0" + output;
    return output;
};

Funbit.Ets.Telemetry.Dashboard.prototype.timeToReadableString = function (date) {
    if (this.isIso8601(date)) {
        var d = new Date(date);
        return this.formatInteger(d.getUTCHours(), 2) + ':' + this.formatInteger(d.getUTCMinutes(), 2);
    }
    return date;
};

Funbit.Ets.Telemetry.Dashboard.prototype.timeDifferenceToReadableString = function (date) {
    if (this.isIso8601(date)) {
        var d = new Date(date);
        var dys = d.getUTCDate() - 1;
        var hrs = d.getUTCHours() + (dys * 24);
        var mnt = d.getUTCMinutes();
        return hrs > 0 ? hrs + ' h ' + mnt + ' min' : mnt + ' min';
    }
    return date;
};

Funbit.Ets.Telemetry.Dashboard.prototype.timeDifferenceToReadableStringDE = function (date) {
    if (this.isIso8601(date)) {
        var d = new Date(date);
        var dys = d.getUTCDate() - 1;
        var hrs = d.getUTCHours() + (dys * 24);
        var mnt = d.getUTCMinutes();
        return hrs > 0 ? hrs + ' Std. ' + mnt + ' Min.' : mnt + ' Min.';
    }
    return date;
};

Funbit.Ets.Telemetry.Dashboard.prototype.timeDifferenceToReadableStringNO = function (date) {
    if (this.isIso8601(date)) {
        var d = new Date(date);
        var dys = d.getUTCDate() - 1;
        var hrs = d.getUTCHours() + (dys * 24);
        var mnt = d.getUTCMinutes();
        return hrs > 0 ? hrs + ' t ' + mnt + ' min' : mnt + ' min';
    }
    return date;
};

Funbit.Ets.Telemetry.Dashboard.prototype.timeDifferenceToReadableStringTR = function (date) {
    if (this.isIso8601(date)) {
        var d = new Date(date);
        var dys = d.getUTCDate() - 1;
        var hrs = d.getUTCHours() + (dys * 24);
        var mnt = d.getUTCMinutes();
        return hrs > 0 ? hrs + ' sa ' + mnt + ' dk' : mnt + ' dk';
    }
    return date;
};

Funbit.Ets.Telemetry.Dashboard.prototype.timeDifferenceToReadableStringNL = function (date) {
    if (this.isIso8601(date)) {
        var d = new Date(date);
        var dys = d.getUTCDate() - 1;
        var hrs = d.getUTCHours() + (dys * 24);
        var mnt = d.getUTCMinutes();
        return hrs > 0 ? hrs + ' u ' + mnt + ' min' : mnt + ' min';
    }
    return date;
};