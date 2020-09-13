using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Funbit.Ets.Telemetry.Server.Data.Reader;
using Funbit.Ets.Telemetry.Server.Helpers;

namespace Funbit.Ets.Telemetry.Server.Data
{
    class Ets2TelemetryData : IEts2TelemetryData
    {
        Box<Ets2TelemetryStructure> _rawData;
        
        public void Update(Ets2TelemetryStructure rawData)
        {
            _rawData = new Box<Ets2TelemetryStructure>(rawData);
        }

        internal static DateTime SecondsToDate(int seconds)
        {
            if (seconds < 0) seconds = 0;
            return new DateTime((long)seconds * 10000000, DateTimeKind.Utc);
        }

        internal static DateTime MinutesToDate(int minutes)
        {
            return SecondsToDate(minutes * 60);
        }

        internal static string BytesToString(byte[] bytes)
        {
            if (bytes == null)
                return string.Empty;
            return Encoding.UTF8.GetString(bytes, 0, Array.FindIndex(bytes, b => b == 0));
        }

        public IEts2Game Game => new Ets2Game(_rawData);
        public IEts2Truck Truck => new Ets2Truck(_rawData);
        public IEts2Shifter Shifter => new Ets2Shifter(_rawData);
        public int TrailerCount
        {
            get {
                for (int i = 9; i >=0; i--)
                    if (!string.IsNullOrEmpty(Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType().GetField($"trailer{i}id").GetValue(_rawData.Struct))))
                        return i + 1;
                return 0;
            }
        }
        public IEts2Trailer[] Trailers
        {
            get
            {
                IEts2Trailer[] array;
                if (TrailerCount == 0)
                {
                    array = new IEts2Trailer[1];
                    array[0] = new Ets2Trailer(_rawData, 0);
                    return array;
                } else
                {
                    array = new IEts2Trailer[TrailerCount];
                    for (int i = 0; i < array.Length; i++)
                        array[i] = new Ets2Trailer(_rawData, i);
                    
                }
                return array;
            }
        }
        public IEts2Trailer Trailer
        {
            get
            {
                IEts2Trailer t = new Ets2Trailer(_rawData, 0);
                if (TrailerCount != 0)
                {
                    float m = 0f;
                    for (int i = 0; i < TrailerCount; i++)
                        m += Trailers[0].Wear;
                    t.Wear = (float)m / TrailerCount;
                }
                return t;
            }
        }
        public IEts2Job Job => new Ets2Job(_rawData);
        public IEts2Cargo Cargo => new Ets2Cargo(_rawData);
        public IEts2Navigation Navigation => new Ets2Navigation(_rawData);
        public IEts2FinedGameplayEvent FinedEvent => new Ets2FinedGameplayEvent(_rawData);
        public IEts2JobGameplayEvent JobEvent => new Ets2JobGameplayEvent(_rawData);
        public IEts2TollgateGameplayEvent TollgateEvent => new Ets2TollgateGameplayEvent(_rawData);
        public IEts2FerryGameplayEvent FerryEvent => new Ets2FerryGameplayEvent(_rawData);
        public IEts2TrainGameplayEvent TrainEvent => new Ets2TrainGameplayEvent(_rawData);
    }

    class Ets2Game : IEts2Game
    {
        readonly Box<Ets2TelemetryStructure> _rawData;

        public Ets2Game(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }

        public bool Connected => _rawData.Struct.ets2_telemetry_plugin_revision != 0 &&
                                 Ets2ProcessHelper.IsEts2Running &&
                                 _rawData.Struct.timeAbsolute != 0;

        public string GameName => Ets2ProcessHelper.LastRunningGameName;
        public bool Paused => _rawData.Struct.paused != 0;
        public DateTime Time => Ets2TelemetryData.MinutesToDate(_rawData.Struct.timeAbsolute);
        public float TimeScale => _rawData.Struct.localScale;
        public DateTime NextRestStopTime => Ets2TelemetryData.MinutesToDate(_rawData.Struct.nextRestStop);
        public string Version => $"{_rawData.Struct.ets2_version_major}.{_rawData.Struct.ets2_version_minor}";
        public string TelemetryPluginVersion => _rawData.Struct.ets2_telemetry_plugin_revision.ToString();
        public string TelemetryServerVersion => Assembly.GetEntryAssembly().GetName().Version.ToString();
        public int MaxTrailerCount => _rawData.Struct.maxTrailerCount;
    }

    class Ets2Vector : IEts2Vector
    {
        public float X { get; }
        public float Y { get; }
        public float Z { get; }

        public Ets2Vector(float x, float y, float z)
        {
            X = x;
            Y = y;
            Z = z;
        }
    }

    class Ets2Placement : IEts2Placement
    {
        public double X { get; }
        public double Y { get; }
        public double Z { get; }
        public double Heading { get; }
        public double Pitch { get; }
        public double Roll { get; }

        public Ets2Placement(double x, double y, double z,
            double heading, double pitch, double roll)
        {
            X = x;
            Y = y;
            Z = z;
            Heading = heading;
            Pitch = pitch;
            Roll = roll;
        }
    }

    class Ets2Truck : IEts2Truck
    {
        readonly Box<Ets2TelemetryStructure> _rawData;

        public Ets2Truck(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }

        public string Id => Ets2TelemetryData.BytesToString(_rawData.Struct.truckMakeId);
        public string Make => Ets2TelemetryData.BytesToString(_rawData.Struct.truckMake);
        public string Model => Ets2TelemetryData.BytesToString(_rawData.Struct.truckModel);

        /// <summary>
        /// Truck speed in km/h.
        /// </summary>
        public float Speed => _rawData.Struct.speed * 3.6f;

        /// <summary>
        /// Cruise control speed in km/h.
        /// </summary>
        public float CruiseControlSpeed => _rawData.Struct.cruiseControlSpeed * 3.6f;
        public bool CruiseControlOn => _rawData.Struct.cruiseControl != 0;
        public float Odometer => _rawData.Struct.truckOdometer;

        public string ShifterType => Ets2TelemetryData.BytesToString(_rawData.Struct.shifterType);
        public int ForwardGears => (int)_rawData.Struct.gearsForward;
        public int ReverseGears => (int)_rawData.Struct.gearsReverse;
        public int Gear => _rawData.Struct.gear;
        public int DisplayedGear => _rawData.Struct.displayedGear;
        public float EngineRpm => _rawData.Struct.engineRpm;
        public float EngineRpmMax => _rawData.Struct.engineRpmMax;

        public float Fuel => _rawData.Struct.fuel;
        public float FuelCapacity => _rawData.Struct.fuelCapacity;
        public float FuelAverageConsumption => _rawData.Struct.fuelAvgConsumption;
        public float FuelWarningFactor => _rawData.Struct.fuelWarningFactor;
        public bool FuelWarningOn => _rawData.Struct.fuelWarning != 0;
        public float WearEngine => _rawData.Struct.wearEngine;
        public float WearTransmission => _rawData.Struct.wearTransmission;
        public float WearCabin => _rawData.Struct.wearCabin;
        public float WearChassis => _rawData.Struct.wearChassis;
        public float WearWheels => _rawData.Struct.wearWheels;
        public float UserSteer => _rawData.Struct.userSteer;
        public float UserThrottle => _rawData.Struct.userThrottle;
        public float UserBrake => _rawData.Struct.userBrake;
        public float UserClutch => _rawData.Struct.userClutch;
        public float GameSteer => _rawData.Struct.gameSteer;
        public float GameThrottle => _rawData.Struct.gameThrottle;
        public float GameBrake => _rawData.Struct.gameBrake;
        public float GameClutch => _rawData.Struct.gameClutch;

        public bool EngineOn => _rawData.Struct.engineEnabled != 0;
        public bool ElectricOn => _rawData.Struct.electricEnabled != 0;
        public bool WipersOn => _rawData.Struct.wipers != 0;
        public int RetarderBrake => (int)_rawData.Struct.retarderBrake;
        public int RetarderStepCount => (int)_rawData.Struct.retarderStepCount;
        public bool ParkBrakeOn => _rawData.Struct.parkBrake != 0;
        public bool MotorBrakeOn => _rawData.Struct.motorBrake != 0;
        public float BrakeTemperature => _rawData.Struct.brakeTemperature;
        public float Adblue => _rawData.Struct.adblue;
        public float AdblueCapacity => _rawData.Struct.adblueCapacity;
        public float AdblueAverageConsumption => 0.0F; // Removed in SDK 1.9
        public bool AdblueWarningOn => _rawData.Struct.adblueWarning != 0;
        public float AirPressure => _rawData.Struct.airPressure;
        public bool AirPressureWarningOn => _rawData.Struct.airPressureWarning != 0;
        public float AirPressureWarningValue => _rawData.Struct.airPressureWarningValue;
        public bool AirPressureEmergencyOn => _rawData.Struct.airPressureEmergency != 0;
        public float AirPressureEmergencyValue => _rawData.Struct.airPressureEmergencyValue;
        public float OilTemperature => _rawData.Struct.oilTemperature;
        public float OilPressure => _rawData.Struct.oilPressure;
        public bool OilPressureWarningOn => _rawData.Struct.oilPressureWarning != 0;
        public float OilPressureWarningValue => _rawData.Struct.oilPressureWarningValue;
        public float WaterTemperature => _rawData.Struct.waterTemperature;
        public bool WaterTemperatureWarningOn => _rawData.Struct.waterTemperatureWarning != 0;
        public float WaterTemperatureWarningValue => _rawData.Struct.waterTemperatureWarningValue;
        public float BatteryVoltage => _rawData.Struct.batteryVoltage;
        public bool BatteryVoltageWarningOn => _rawData.Struct.batteryVoltageWarning != 0;
        public float BatteryVoltageWarningValue => _rawData.Struct.batteryVoltageWarningValue;
        public float LightsDashboardValue => _rawData.Struct.lightsDashboard;
        public bool LightsDashboardOn => _rawData.Struct.lightsDashboard > 0;
        public bool BlinkerLeftActive => _rawData.Struct.blinkerLeftActive != 0;
        public bool BlinkerRightActive => _rawData.Struct.blinkerRightActive != 0;
        public bool BlinkerLeftOn => _rawData.Struct.blinkerLeftOn != 0;
        public bool BlinkerRightOn => _rawData.Struct.blinkerRightOn != 0;
        public bool LightsParkingOn => _rawData.Struct.lightsParking != 0;
        public bool LightsBeamLowOn => _rawData.Struct.lightsBeamLow != 0;
        public bool LightsBeamHighOn => _rawData.Struct.lightsBeamHigh != 0;
        public bool LightsAuxFrontOn => _rawData.Struct.lightsAuxFront != 0;
        public bool LightsAuxRoofOn => _rawData.Struct.lightsAuxRoof != 0;
        public bool LightsBeaconOn => _rawData.Struct.lightsBeacon != 0;
        public bool LightsBrakeOn => _rawData.Struct.lightsBrake != 0;
        public bool LightsReverseOn => _rawData.Struct.lightsReverse != 0;

        public IEts2Placement Placement => new Ets2Placement(
            _rawData.Struct.coordinateX,
            _rawData.Struct.coordinateY,
            _rawData.Struct.coordinateZ,
            _rawData.Struct.rotationX,
            _rawData.Struct.rotationY,
            _rawData.Struct.rotationZ);

        public IEts2Vector Acceleration => new Ets2Vector(
            _rawData.Struct.accelerationX,
            _rawData.Struct.accelerationY,
            _rawData.Struct.accelerationZ);

        public IEts2Vector Head => new Ets2Vector(
            _rawData.Struct.headPositionX,
            _rawData.Struct.headPositionY,
            _rawData.Struct.headPositionZ);

        public IEts2Vector Cabin => new Ets2Vector(
            _rawData.Struct.cabinPositionX,
            _rawData.Struct.cabinPositionY,
            _rawData.Struct.cabinPositionZ);

        public IEts2Vector Hook => new Ets2Vector(
            _rawData.Struct.hookPositionX,
            _rawData.Struct.hookPositionY,
            _rawData.Struct.hookPositionZ);

        public string LicensePlate => Ets2TelemetryData.BytesToString(_rawData.Struct.truckLicensePlate);

        public string LicensePlateCountryId =>
            Ets2TelemetryData.BytesToString(_rawData.Struct.truckLicensePlateCountryId);

        public string LicensePlateCountry => Ets2TelemetryData.BytesToString(_rawData.Struct.truckLicensePlateCountry);

        public int WheelCount => (int)_rawData.Struct.truckWheelCount;

        public IEts2Wheel[] Wheels
        {
            get
            {
                var array = new IEts2Wheel[_rawData.Struct.truckWheelCount];
                for (int i = 0; i < array.Length; i++)
                    array[i] = new Ets2TruckWheel(_rawData, i);
                Array.Sort(array, new Ets2WheelSorter());
                return array;
            }
        }
    }

    class Ets2Shifter : IEts2Shifter
    {
        readonly Box<Ets2TelemetryStructure> _rawData;
        public Ets2Shifter(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }
        public string Type => Ets2TelemetryData.BytesToString(_rawData.Struct.shifterType);
        public int ForwardGears => (int)_rawData.Struct.gearsForward;
        public int ReverseGears => (int)_rawData.Struct.gearsReverse;
        public int Gear => _rawData.Struct.gear;
        public int DisplayedGear => _rawData.Struct.displayedGear;
        private string[] ForwardGearNames
        {
            get
            {
                string[] fwGears = new string[ForwardGears + 1];
                switch (ForwardGears)
                {
                    case 18:
                        fwGears = (Type == "hshifter")
                            ? new string[] { "N", "CL", "CH", "1L", "1H", "2L", "2H", "3L", "3H", "4L", "4H", "5L", "5H", "6L", "6H", "7L", "7H", "8L", "8H" }
                            : new string[] { "N", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18" };
                        break;
                    case 16:
                        fwGears = (Type == "hshifter")
                            ? new string[] { "N", "1L", "1H", "2L", "2H", "3L", "3H", "4L", "4H", "5L", "5H", "6L", "6H", "7L", "7H", "8L", "8H" }
                            : new string[] { "N", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16" };
                        break;
                    case 14:
                        fwGears = (Type == "hshifter")
                            ? new string[] { "N", "CL", "CH", "1", "2", "3", "4", "5L", "5H", "6L", "6H", "7L", "7H", "8L", "8H" }
                            : new string[] { "N", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14" };
                        break;
                    case 13:
                        fwGears = (Type == "hshifter")
                            ? new string[] { "N", "L", "1", "2", "3", "4", "5L", "5H", "6L", "6H", "7L", "7H", "8L", "8H" }
                            : new string[] { "N", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13" };
                        break;
                    case 12:
                        fwGears = (Type == "hshifter")
                            ? new string[] { "N", "1", "2", "3", "4", "5L", "5H", "6L", "6H", "7L", "7H", "8L", "8H" }
                            : new string[] { "N", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" };
                        break;
                    case 10:
                        fwGears = new string[] { "N", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10" };
                        break;
                    case 9:
                        fwGears = new string[] { "N", "L", "1", "2", "3", "4", "5", "6", "7", "8" };
                        break;
                }
                return fwGears;
            }
        }
        private string[] ReverseGearNames
        {
            get
            {
                string[] rvGears = new string[ReverseGears + 1];
                switch (ReverseGears)
                {
                    case 4:
                        rvGears = (Type == "hshifter")
                            ? new string[] { "N", "R1L", "R1H", "R2L", "R2H" }
                            : new string[] { "N", "R1", "R2", "R3", "R4" };
                        break;
                    case 3:
                        rvGears = (Type == "hshifter")
                            ? new string[] { "N", "RL", "RH", "RO" }
                            : new string[] { "N", "R1", "R2", "R3" };
                        break;
                    case 2:
                        rvGears = new string[] { "N", "RL", "RH" };
                        break;
                    case 1:
                        rvGears = new string[] { "N", "R" };
                        break;
                }

                return rvGears;
            }
        }
        public string DisplayedGearName => (DisplayedGear < 0) 
            ? ReverseGearNames[Math.Abs(DisplayedGear)] 
            : ForwardGearNames[DisplayedGear];
        public float DifferentialRatio => (float)_rawData.Struct.gearDifferential;
        public float GearRatio => (Gear == 0) ? 0 : (Gear < 0)
                ? (float)_rawData.Struct.gearRatiosReverse[Math.Abs(Gear) - 1]
                : (float)_rawData.Struct.gearRatiosForward[Gear - 1];
        public int SlotCount => _rawData.Struct.hshifterPosition == null ? 0 : (int)_rawData.Struct.hshifterPosition[_rawData.Struct.hshifterPosition.Length - 1] + 1;
        public int SelectorCount => _rawData.Struct.selectorCount == null ? 0 : (int)Math.Pow(2, _rawData.Struct.selectorCount);
        public int Slot => (int)_rawData.Struct.shifterSlot;
        public int Selector
        {
            get
            {
                int selectors = 0;
                if (_rawData.Struct.shifterToggle != null)
                    for (int i = 0; i < _rawData.Struct.shifterToggle.Length; i++)
                        selectors += (int)Math.Pow(2, (double)i) * ((int)Math.Pow(2, (double)_rawData.Struct.shifterToggle[i]) - 1);
                return selectors;
            }
        }
        public IEts2ShifterSlot[] Slots
        {
            get
            {
                if (SlotCount == 0) return null;
                var slots = new IEts2ShifterSlot[SlotCount];
                for (int slot = 0; slot < slots.Length; slot++)
                    slots[slot] = new Ets2ShifterSlot(_rawData, SelectorCount, slot, ForwardGearNames, ReverseGearNames);
                return slots;
            }
        }

        private int[] BestG
        { 
            get 
            {
                int r;
                int gap=1500;
                int[] gear = { 0, 0 };
                if (Gear == 0) return gear;
                
                for (int slot = 0; slot < Slots.Length; slot++)
                {
                    for (int selector = 0; selector < SelectorCount; selector++)
                    {
                        if (Math.Sign(Slots[slot].Seletors[selector].Gear) != 0) {
                            r = Slots[slot].Seletors[selector].RpmAtCurrentSpeed;
                            if (Gear < 0) {
                                if (gap > Math.Abs(r + 1300))
                                {
                                    gear[0] = slot;
                                    gear[1] = selector;
                                    gap = Math.Abs(r + 1300);
                                }
                            }
                            else {
                                if (gap > Math.Abs(r - 1300))
                                {
                                    gear[0] = slot;
                                    gear[1] = selector;
                                    gap = Math.Abs(r - 1300);
                                }

                            }
                        }
                    }

                }
                return gear;
            }
        }

        public int BestGear => Slots == null ? 0 : (int)Slots[BestG[0]].Seletors[BestG[1]].Gear;
        public string BestGearName => Slots == null ? "" : (string)Slots[BestG[0]].Seletors[BestG[1]].GearName;

        public float[] GearRatiosForward => (float[])_rawData.Struct.gearRatiosForward;
        public float[] GearRatiosReverse => (float[])_rawData.Struct.gearRatiosReverse;
        //public uint[] HshifterPosition => _rawData.Struct.hshifterPosition;
        //public uint[] HshifterBitmask => _rawData.Struct.hshifterBitmask;
        //public int[] HshifterResulting => _rawData.Struct.hshifterResulting;


    }

    class Ets2ShifterSlot : IEts2ShifterSlot
    {
        public Ets2ShifterSlot(Box<Ets2TelemetryStructure> rawData, int selectorCount, int slot, string[] fwGearNames, string[] rvGearNames)
        {
            int i = selectorCount * slot;
            Slot = (int)rawData.Struct.hshifterPosition[i];
            Seletors = new IEts2ShifterSelector[selectorCount];
            for (int selector = 0; selector < Seletors.Length; selector++)
                Seletors[selector] = new Ets2ShifterSelector(rawData, selectorCount, slot, selector, fwGearNames, rvGearNames);
        }
        public int Slot { get; private set; }
        public IEts2ShifterSelector[] Seletors { get; private set; }
    }
    class Ets2ShifterSelector : IEts2ShifterSelector
    {
        public Ets2ShifterSelector(Box<Ets2TelemetryStructure> rawData, int selectorCount, int slot, int selector, string[] fwGearNames, string[] rvGearNames)
        {
            int i = selectorCount * slot + selector;
            Selector = (int)rawData.Struct.hshifterBitmask[i];
            Gear = rawData.Struct.hshifterResulting[i];
            GearName = (Gear < 0) ? rvGearNames[Math.Abs(Gear)] : fwGearNames[Gear];
            GearRatio = (Gear == 0) ? 0 : (Gear < 0)
                ? (float)rawData.Struct.gearRatiosReverse[Math.Abs(Gear)-1]
                : (float)rawData.Struct.gearRatiosForward[Gear-1];
            double tc = 2 * Math.PI; 
            if (rawData.Struct.truckWheelCount > 4)
                tc *= rawData.Struct.truckWheelPowered[4] == 1
                    ? rawData.Struct.truckWheelRadius[4]
                    : rawData.Struct.truckWheelRadius[2];
            else
                tc *= rawData.Struct.truckWheelRadius[2];
            if (GearRatio != 0) 
            {
                SpeedAt1500Rpm = (int)Math.Round(90 * tc / (rawData.Struct.gearDifferential * GearRatio));
                RpmAtCurrentSpeed = (int)Math.Round(60 * Math.Abs(rawData.Struct.speed) * rawData.Struct.gearDifferential * GearRatio / tc);
            }
        }
        public int Selector { get; private set; }
        public int Gear { get; private set; }
        public string GearName { get; private set; }
        public float GearRatio { get; private set; }
        public int SpeedAt1500Rpm { get; private set; }
        public int RpmAtCurrentSpeed { get; private set; }
    }


    class Ets2Trailer : IEts2Trailer
    {
        readonly Box<Ets2TelemetryStructure> _rawData;
        readonly int _trailerNumber;

        public Ets2Trailer(Box<Ets2TelemetryStructure> rawData, int trailerNumber)
        {
            if (trailerNumber < 0 && trailerNumber > 9)
            {
                throw new ArgumentException($"trailerNumber must be between 0-9. Found: {trailerNumber}");
            }

            _rawData = rawData;
            _trailerNumber = trailerNumber;
        }

        public int Number => _trailerNumber;

        public bool Attached => _rawData.Struct.trailer0attached != 0 &&
                                (byte)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}attached").GetValue(_rawData.Struct) != 0;

        public bool Present => !string.IsNullOrEmpty(Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}id").GetValue(_rawData.Struct)));

        // ReSharper disable once PossibleNullReferenceException
        public string Id => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}id").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public string Name => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}name").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public float WearWheels => (float)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}wearWheels").GetValue(_rawData.Struct);

        // ReSharper disable once PossibleNullReferenceException
        public float WearChassis => (float)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}wearChassis").GetValue(_rawData.Struct);
        
        private float _wear;
        public float Wear
        {
            get => (_wear == 0) ? Math.Max(WearWheels, WearChassis) : _wear;
            set => _wear = value;
        }

        // ReSharper disable once PossibleNullReferenceException
        public float CargoDamage => (float)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}cargoDamage").GetValue(_rawData.Struct);

        // ReSharper disable once PossibleNullReferenceException
        public string CargoAccessoryId => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType()
            .GetField($"trailer{_trailerNumber}CargoAccessoryId").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public string BrandId => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType()
            .GetField($"trailer{_trailerNumber}brandId").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public string Brand => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType()
            .GetField($"trailer{_trailerNumber}brand").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public string BodyType => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType()
            .GetField($"trailer{_trailerNumber}bodyType").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public string Cargo => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType()
            .GetField($"trailer{_trailerNumber}bodyType").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public string LicensePlate => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType()
            .GetField($"trailer{_trailerNumber}licensePlate").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public string LicensePlateCountry => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType()
            .GetField($"trailer{_trailerNumber}licensePlateCountry").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public string LicensePlateCountryId => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType()
            .GetField($"trailer{_trailerNumber}licensePlateCountryId").GetValue(_rawData.Struct));

        // ReSharper disable once PossibleNullReferenceException
        public string ChainType => Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType()
            .GetField($"trailer{_trailerNumber}chainType").GetValue(_rawData.Struct));

        public IEts2Placement Placement => new Ets2Placement(
            (double)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}worldX").GetValue(_rawData.Struct),
            (double)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}worldY").GetValue(_rawData.Struct),
            (double)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}worldZ").GetValue(_rawData.Struct),
            (double)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}rotationX").GetValue(_rawData.Struct),
            (double)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}rotationY").GetValue(_rawData.Struct),
            (double)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}rotationZ").GetValue(_rawData.Struct));
        public float Distance
        {
            get
            {
                if (string.IsNullOrEmpty(Ets2TelemetryData.BytesToString((byte[])_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}id").GetValue(_rawData.Struct))))
                    return 0;
                return (float)Math.Sqrt(
                    Math.Pow((_rawData.Struct.coordinateX - (double)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}worldX").GetValue(_rawData.Struct)), 2) +
                    Math.Pow((_rawData.Struct.coordinateY - (double)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}worldY").GetValue(_rawData.Struct)), 2) +
                    Math.Pow((_rawData.Struct.coordinateZ - (double)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}worldZ").GetValue(_rawData.Struct)), 2));
            }
        }
        public IEts2Vector Hook => new Ets2Vector(
            (float)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}hookPositionX").GetValue(_rawData.Struct),
            (float)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}hookPositionY").GetValue(_rawData.Struct),
            (float)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}hookPositionZ").GetValue(_rawData.Struct));

        public uint WheelCount => (uint)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}wheelCount").GetValue(_rawData.Struct);

        public IEts2Wheel[] Wheels
        {
            get
            {
                uint wheelCount = (uint)_rawData.Struct.GetType().GetField($"trailer{_trailerNumber}wheelCount").GetValue(_rawData.Struct);
                var array = new IEts2Wheel[wheelCount];
                if (wheelCount > 0)
                {
                    for (int i = 0; i < array.Length; i++)
                        array[i] = new Ets2TrailerWheel(_rawData, _trailerNumber, i);
                    Ets2WheelSorter sorter = new Ets2WheelSorter();
                    Array.Sort(array, sorter);
                }
                return array;
            }
        }

    }

    class Ets2Navigation : IEts2Navigation
    {
        readonly Box<Ets2TelemetryStructure> _rawData;
        
        public Ets2Navigation(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }
        
        public DateTime EstimatedTime => Ets2TelemetryData.SecondsToDate((int)_rawData.Struct.navigationTime);
        public int EstimatedDistance => (int)_rawData.Struct.navigationDistance;
        public int SpeedLimit => _rawData.Struct.navigationSpeedLimit > 0 ? (int)Math.Round(_rawData.Struct.navigationSpeedLimit * 3.6f) : 0;
    }

    class Ets2Job : IEts2Job
    {
        readonly Box<Ets2TelemetryStructure> _rawData;

        public Ets2Job(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }

        public int Income => (int)_rawData.Struct.jobIncome;
        public DateTime DeadlineTime => Ets2TelemetryData.MinutesToDate((int)_rawData.Struct.jobDeadline);
        public DateTime RemainingTime 
        {
            get
            {
                if (_rawData.Struct.jobDeadline > 0)
                    return Ets2TelemetryData.MinutesToDate((int)(_rawData.Struct.jobDeadline - _rawData.Struct.timeAbsolute));
                return Ets2TelemetryData.MinutesToDate(0);
            }
        }

        public string SourceCity => Ets2TelemetryData.BytesToString(_rawData.Struct.jobCitySource);
        public string SourceCompany => Ets2TelemetryData.BytesToString(_rawData.Struct.jobCompanySource);
        public string DestinationCity => Ets2TelemetryData.BytesToString(_rawData.Struct.jobCityDestination);
        public string DestinationCompany => Ets2TelemetryData.BytesToString(_rawData.Struct.jobCompanyDestination);

        public bool SpecialTransport => _rawData.Struct.specialJob != 0;

        public string JobMarket => Ets2TelemetryData.BytesToString(_rawData.Struct.jobMarket);
    }

    class Ets2Cargo : IEts2Cargo
    {
        readonly Box<Ets2TelemetryStructure> _rawData;

        public Ets2Cargo(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }

        public bool CargoLoaded => _rawData.Struct.isCargoLoaded != 0;
        public string CargoId => Ets2TelemetryData.BytesToString(_rawData.Struct.cargoId);
        public string Cargo => Ets2TelemetryData.BytesToString(_rawData.Struct.cargo);
        public float Mass => _rawData.Struct.cargoMass;
        public float UnitMass => _rawData.Struct.unitMass;
        public int UnitCount => _rawData.Struct.unitCount;
        public float Damage => _rawData.Struct.cargoDamage;
    }

    class Ets2FinedGameplayEvent : IEts2FinedGameplayEvent
    {
        readonly Box<Ets2TelemetryStructure> _rawData;

        public Ets2FinedGameplayEvent(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }

        public string FineOffense => Ets2TelemetryData.BytesToString(_rawData.Struct.fineOffence);
        public int FineAmount => (int) _rawData.Struct.fineAmount;
        public bool Fined => _rawData.Struct.fined != 0;
    }

    class Ets2JobGameplayEvent : IEts2JobGameplayEvent
    {
        readonly Box<Ets2TelemetryStructure> _rawData;

        public Ets2JobGameplayEvent(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }

        public bool JobFinished => _rawData.Struct.jobFinished != 0;
        public bool JobCancelled => _rawData.Struct.jobCancelled != 0;
        public bool JobDelivered => _rawData.Struct.jobDelivered != 0;
        public int CancelPenalty => (int)_rawData.Struct.jobCancelledPenalty;
        public int Revenue => (int)_rawData.Struct.jobDeliveredRevenue;
        public int EarnedXp => _rawData.Struct.jobDeliveredEarnedXp;
        public float CargoDamage => _rawData.Struct.cargoDamage;
        public int Distance => (int)_rawData.Struct.navigationDistance;
        public DateTime DeliveryTime => Ets2TelemetryData.MinutesToDate((int)_rawData.Struct.jobDeliveredDeliveryTime);
        public bool AutoparkUsed => _rawData.Struct.jobDelieveredAutoparkUsed != 0;
        public bool AutoloadUsed => _rawData.Struct.jobDeliveredAutoloadUsed != 0;
    }

    class Ets2TollgateGameplayEvent : IEts2TollgateGameplayEvent
    {
        readonly Box<Ets2TelemetryStructure> _rawData;

        public Ets2TollgateGameplayEvent(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }

        public bool TollgateUsed => _rawData.Struct.tollgate != 0;
        public int PayAmount => (int)_rawData.Struct.tollgatePayAmount;
    }

    class Ets2FerryGameplayEvent : IEts2FerryGameplayEvent
    {
        readonly Box<Ets2TelemetryStructure> _rawData;

        public Ets2FerryGameplayEvent(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }

        public bool FerryUsed => _rawData.Struct.ferry != 0;
        public string SourceName => Ets2TelemetryData.BytesToString(_rawData.Struct.ferrySourceName);
        public string TargetName => Ets2TelemetryData.BytesToString(_rawData.Struct.ferryTargetName);
        public string SourceId => Ets2TelemetryData.BytesToString(_rawData.Struct.ferrySourceId);
        public string TargetId => Ets2TelemetryData.BytesToString(_rawData.Struct.ferryTargetId);
        public int PayAmount => (int) _rawData.Struct.ferryPayAmount;
    }

    class Ets2TrainGameplayEvent : IEts2TrainGameplayEvent
    {
        readonly Box<Ets2TelemetryStructure> _rawData;

        public Ets2TrainGameplayEvent(Box<Ets2TelemetryStructure> rawData)
        {
            _rawData = rawData;
        }

        public bool TrainUsed => _rawData.Struct.train != 0;
        public string SourceName => Ets2TelemetryData.BytesToString(_rawData.Struct.trainSourceName);
        public string TargetName => Ets2TelemetryData.BytesToString(_rawData.Struct.trainTargetName);
        public string SourceId => Ets2TelemetryData.BytesToString(_rawData.Struct.trainSourceId);
        public string TargetId => Ets2TelemetryData.BytesToString(_rawData.Struct.trainTargetId);
        public int PayAmount => (int)_rawData.Struct.trainPayAmount;
    }
    public class Ets2WheelSorter : IComparer<IEts2Wheel>
    {
        public int Compare(IEts2Wheel x, IEts2Wheel y) => (int)(x.Position.Z - y.Position.Z);
    }
    class Ets2TruckWheel : IEts2Wheel
    {
        public Ets2TruckWheel(Box<Ets2TelemetryStructure> rawData, int wheelIndex)
        {
            Simulated = rawData.Struct.truckWheelSimulated[wheelIndex] != 0;
            Steerable = rawData.Struct.truckWheelSteerable[wheelIndex] != 0;
            Radius = rawData.Struct.truckWheelRadius[wheelIndex];
            Position = new Ets2Vector(
                rawData.Struct.wheelPositionX[wheelIndex],
                rawData.Struct.wheelPositionY[wheelIndex],
                rawData.Struct.wheelPositionZ[wheelIndex]);
            Powered = rawData.Struct.truckWheelPowered[wheelIndex] != 0;
            Liftable = rawData.Struct.truckWheelLiftable[wheelIndex] != 0;
            Lifted = rawData.Struct.truck_wheelLift[wheelIndex] != 0;
        }

        public bool Simulated { get; private set; }
        public bool Steerable { get; private set; }
        public bool Powered { get; private set; }
        public bool Liftable { get; private set; }
        public bool Lifted { get; private set; }
        public float Radius { get; private set; }
        public IEts2Vector Position { get; private set; }
    }

    class Ets2TrailerWheel : IEts2Wheel
    {
        public Ets2TrailerWheel(Box<Ets2TelemetryStructure> rawData, int trailerNumber, int wheelIndex)
        {
            byte[] b;
            float[] f;
            b = (byte[])rawData.Struct.GetType().GetField($"trailer{trailerNumber}wheelSimulated").GetValue(rawData.Struct);
            Simulated = b[wheelIndex] != 0;
            b = (byte[])rawData.Struct.GetType().GetField($"trailer{trailerNumber}wheelSteerable").GetValue(rawData.Struct);
            Steerable = b[wheelIndex] != 0;
            f = (float[])rawData.Struct.GetType().GetField($"trailer{trailerNumber}wheelRadius").GetValue(rawData.Struct);
            Radius = f[wheelIndex];
            float[] pX = (float[])rawData.Struct.GetType().GetField($"trailer{trailerNumber}wheelPositionX").GetValue(rawData.Struct);
            float[] pY = (float[])rawData.Struct.GetType().GetField($"trailer{trailerNumber}wheelPositionY").GetValue(rawData.Struct);
            float[] pZ = (float[])rawData.Struct.GetType().GetField($"trailer{trailerNumber}wheelPositionZ").GetValue(rawData.Struct);
            Position = new Ets2Vector(
                pX[wheelIndex],
                pY[wheelIndex],
                pZ[wheelIndex]);
            b = (byte[])rawData.Struct.GetType().GetField($"trailer{trailerNumber}wheelPowered").GetValue(rawData.Struct);
            Powered = b[wheelIndex] != 0;
            b = (byte[])rawData.Struct.GetType().GetField($"trailer{trailerNumber}wheelLiftable").GetValue(rawData.Struct);
            Liftable = b[wheelIndex] != 0;
            f = (float[])rawData.Struct.GetType().GetField($"trailer{trailerNumber}wheelLift").GetValue(rawData.Struct);
            Lifted = f[wheelIndex] != 0;
        }

        public bool Simulated { get; private set; }
        public bool Steerable { get; private set; }
        public bool Powered { get; private set; }
        public bool Liftable { get; private set; }
        public bool Lifted { get; private set; }
        public float Radius { get; private set; }
        public IEts2Vector Position { get; private set; }
    }

    class Box<T> where T : struct 
    {
        public T Struct { get; set; }

        public Box(T @struct)
        {
            Struct = @struct;
        }
    }
}