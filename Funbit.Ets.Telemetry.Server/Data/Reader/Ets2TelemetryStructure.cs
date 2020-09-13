using System.Drawing;
using System.Dynamic;
using System.Runtime.InteropServices;
using Microsoft.Owin.Security;

namespace Funbit.Ets.Telemetry.Server.Data.Reader
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
    public struct Ets2TelemetryStructure
    {
        const int GeneralStringSize = 64;
        private const int MaxWheelCount = 16;

        public int time;
        public byte paused;

        // 35 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 35)]
        private readonly byte[] padding0;

        public int ets2_telemetry_plugin_revision;
        public int ets2_version_major;
        public int ets2_version_minor;
        public int game;
        public int telemetry_version_game_major;
        public int telemetry_version_game_minor; // scs_values
        public int timeAbsolute;                 // common_ui

        public int gearsForward;
        public int gearsReverse;
        public int retarderStepCount;
        public int truckWheelCount;
        public int selectorCount;
        public int jobDeadline;
        public int maxTrailerCount;
        public int unitCount;                    // config_ui

        public int shifterSlot;
        public int retarderBrake;
        public int lightsAuxFront;
        public int lightsAuxRoof;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] truck_wheelSubstance;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 32)]
        public uint[] hshifterPosition;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 32)]
        public uint[] hshifterBitmask;            // truck_ui

        public uint jobDeliveredDeliveryTime;     // gameplay_ui;

        // 60 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 60)]
        private readonly byte[] padding1;         // buffer_ui

        public int nextRestStop;                  // common_i

        public int gear;
        public int displayedGear;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 32)]
        public int[] hshifterResulting;             // truck_i

        public int jobDeliveredEarnedXp;          // gameplay_i

        // 56 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 56)]
        private readonly byte[] padding2;         // buffer_i

        public float localScale;                  // common_f

        public float fuelCapacity;
        public float fuelWarningFactor;
        public float adblueCapacity;
        public float adblueWarningFactor;
        public float airPressureWarningValue;
        public float airPressureEmergencyValue;
        public float oilPressureWarningValue;
        public float waterTemperatureWarningValue;
        public float batteryVoltageWarningValue;
        public float engineRpmMax;
        public float gearDifferential;
        public float cargoMass;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] truckWheelRadius;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 24)]
        public float[] gearRatiosForward;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 8)]
        public float[] gearRatiosReverse;
        public float unitMass;                    // config_f

        public float speed;
        public float engineRpm;
        public float userSteer;
        public float userThrottle;
        public float userBrake;
        public float userClutch;
        public float gameSteer;
        public float gameThrottle;
        public float gameBrake;
        public float gameClutch;
        public float cruiseControlSpeed;
        public float airPressure;
        public float brakeTemperature;
        public float fuel;
        public float fuelAvgConsumption;
        public float fuelRate;
        public float adblue;
        public float oilPressure;
        public float oilTemperature;
        public float waterTemperature;
        public float batteryVoltage;
        public float lightsDashboard;
        public float wearEngine;
        public float wearTransmission;
        public float wearCabin;
        public float wearChassis;
        public float wearWheels;
        public float truckOdometer;
        public float navigationDistance;
        public float navigationTime;
        public float navigationSpeedLimit;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] truck_wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] truck_wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] truck_wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] truck_wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] truck_wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] truck_wheelLiftOffset;     // truck_f

        public float jobDeliveredCargoDamage;
        public float jobDeliveredDistanceKm;      // gameplay_f

        public float cargoDamage;                 // job_f

        // 32 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 32)]
        private readonly byte[] padding3;         // buffer_f

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] truckWheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] truckWheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] truckWheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] truckWheelLiftable;

        public byte isCargoLoaded;
        public byte specialJob;                   // config_b

        public byte parkBrake;
        public byte motorBrake;
        public byte airPressureWarning;
        public byte airPressureEmergency;
        public byte fuelWarning;
        public byte adblueWarning;
        public byte oilPressureWarning;
        public byte waterTemperatureWarning;
        public byte batteryVoltageWarning;
        public byte electricEnabled;
        public byte engineEnabled;
        public byte wipers;
        public byte blinkerLeftActive;
        public byte blinkerRightActive;
        public byte blinkerLeftOn;
        public byte blinkerRightOn;
        public byte lightsParking;
        public byte lightsBeamLow;
        public byte lightsBeamHigh;
        public byte lightsBeacon;
        public byte lightsBrake;
        public byte lightsReverse;
        public byte cruiseControl;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] truckWheelOnGround;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)]
        public byte[] shifterToggle;              // truck_b

        public byte jobDelieveredAutoparkUsed;
        public byte jobDeliveredAutoloadUsed;     // gameplay_b

        // 31 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 31)]
        private readonly byte[] padding4;         // buffer_b

        public float cabinPositionX;
        public float cabinPositionY;
        public float cabinPositionZ;
        public float headPositionX;
        public float headPositionY;
        public float headPositionZ;
        public float hookPositionX;
        public float hookPositionY;
        public float hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] wheelPositionZ;            // config_fv

        public float lvAccelerationX;
        public float lvAccelerationY;
        public float lvAccelerationZ;
        public float avAccelerationX;
        public float avAccelerationY;
        public float avAccelerationZ;
        public float accelerationX;
        public float accelerationY;
        public float accelerationZ;
        public float aaAccelerationX;
        public float aaAccelerationY;
        public float aaAccelerationZ;
        public float cabinAVX;
        public float cabinAVY;
        public float cabinAVZ;
        public float cabinAAX;
        public float cabinAAY;
        public float cabinAAZ;                    // truck_fv

        // 60 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 60)]
        private readonly byte[] padding5;         // buffer_fv

        public float cabinOffsetX;
        public float cabinOffsetY;
        public float cabinOffsetZ;
        public float cabinOffsetRotationX;
        public float cabinOffsetRotationY;
        public float cabinOffsetRotationZ;
        public float headOffsetX;
        public float headOffsetY;
        public float headOffsetZ;
        public float headOffsetRotationX;
        public float headOffsetRotationY;
        public float headOffsetRotationZ;          // truck_fp

        // 152 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 152)]
        private readonly byte[] padding6;         // buffer_fp

        public double coordinateX;
        public double coordinateY;
        public double coordinateZ;
        public double rotationX;
        public double rotationY;
        public double rotationZ;

        // 52 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 52)]
        private readonly byte[] padding7;         // buffer_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] truckMakeId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] truckMake;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] truckId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] truckModel;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] cargoId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] cargo;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] jobCityDestinationId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] jobCityDestination;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] jobCompanyDestinationId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] jobCompanyDestination;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] jobCitySourceId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] jobCitySource;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] jobCompanySourceId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] jobCompanySource;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 16)]
        public byte[] shifterType;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] truckLicensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] truckLicensePlateCountryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] truckLicensePlateCountry;

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 32)]
        public byte[] jobMarket;                  // config_s


        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 16)]
        public byte[] fineOffence;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] ferrySourceName;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] ferryTargetName;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] ferrySourceId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] ferryTargetId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trainSourceName;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trainTargetName;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trainSourceId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trainTargetId;              // gameplay_s

        // 36 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 36)]
        private readonly byte[] padding8;         // buffer_s

        public ulong jobIncome;                   // config_ull

        // 192 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 192)]
        private readonly byte[] padding9;         // buffer_ull

        public long jobCancelledPenalty;
        public long jobDeliveredRevenue;
        public long fineAmount;
        public long tollgatePayAmount;
        public long ferryPayAmount;
        public long trainPayAmount;               // gameplay_ll

        // 52 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 52)]
        private readonly byte[] padding10;        // buffer_ll

        public byte trailer_attached;
        public byte jobFinished;
        public byte jobCancelled;
        public byte jobDelivered;
        public byte fined;
        public byte tollgate;
        public byte ferry;
        public byte train;                        // special_b

        // 92 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 92)]
        private readonly byte[] padding11;        // buffer_ll

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 1600)]
        public byte[] padding12;                // substances

        #region Trailers
        // If anyone can make this cleaner, please do!

        #region Trailer0
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer0wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer0wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer0wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer0wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer0wheelOnGround;
        public byte trailer0attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer0padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer0wheelSubstance;             // com_ui
        public uint trailer0wheelCount;                   // con_ui

        public float trailer0cargoDamage;
        public float trailer0wearChassis;
        public float trailer0wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelRadius;               // con_f

        public float trailer0linearVelocityX;
        public float trailer0linearVelocityY;
        public float trailer0linearVelocityZ;
        public float trailer0angularVelocityX;
        public float trailer0angularVelocityY;
        public float trailer0angularVelocityZ;
        public float trailer0linearAccelerationX;
        public float trailer0linearAccelerationY;
        public float trailer0linearAccelerationZ;
        public float trailer0angularAccelerationX;
        public float trailer0angularAccelerationY;
        public float trailer0angularAccelerationZ;        // com_fv
        public float trailer0hookPositionX;
        public float trailer0hookPositionY;
        public float trailer0hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer0wheelPositionZ;            // con_fv

        public double trailer0worldX;
        public double trailer0worldY;
        public double trailer0worldZ;
        public double trailer0rotationX;
        public double trailer0rotationY;
        public double trailer0rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer0licensePlateCountryId;      // con_s
        #endregion

        #region Trailer1
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer1wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer1wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer1wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer1wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer1wheelOnGround;
        public byte trailer1attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer1padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer1wheelSubstance;             // com_ui
        public uint trailer1wheelCount;                   // con_ui

        public float trailer1cargoDamage;
        public float trailer1wearChassis;
        public float trailer1wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelRadius;               // con_f

        public float trailer1linearVelocityX;
        public float trailer1linearVelocityY;
        public float trailer1linearVelocityZ;
        public float trailer1angularVelocityX;
        public float trailer1angularVelocityY;
        public float trailer1angularVelocityZ;
        public float trailer1linearAccelerationX;
        public float trailer1linearAccelerationY;
        public float trailer1linearAccelerationZ;
        public float trailer1angularAccelerationX;
        public float trailer1angularAccelerationY;
        public float trailer1angularAccelerationZ;        // com_fv
        public float trailer1hookPositionX;
        public float trailer1hookPositionY;
        public float trailer1hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer1wheelPositionZ;            // con_fv

        public double trailer1worldX;
        public double trailer1worldY;
        public double trailer1worldZ;
        public double trailer1rotationX;
        public double trailer1rotationY;
        public double trailer1rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer1licensePlateCountryId;      // con_s
        #endregion

        #region Trailer2
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer2wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer2wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer2wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer2wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer2wheelOnGround;
        public byte trailer2attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer2padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer2wheelSubstance;             // com_ui
        public uint trailer2wheelCount;                   // con_ui

        public float trailer2cargoDamage;
        public float trailer2wearChassis;
        public float trailer2wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelRadius;               // con_f

        public float trailer2linearVelocityX;
        public float trailer2linearVelocityY;
        public float trailer2linearVelocityZ;
        public float trailer2angularVelocityX;
        public float trailer2angularVelocityY;
        public float trailer2angularVelocityZ;
        public float trailer2linearAccelerationX;
        public float trailer2linearAccelerationY;
        public float trailer2linearAccelerationZ;
        public float trailer2angularAccelerationX;
        public float trailer2angularAccelerationY;
        public float trailer2angularAccelerationZ;        // com_fv
        public float trailer2hookPositionX;
        public float trailer2hookPositionY;
        public float trailer2hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer2wheelPositionZ;            // con_fv

        public double trailer2worldX;
        public double trailer2worldY;
        public double trailer2worldZ;
        public double trailer2rotationX;
        public double trailer2rotationY;
        public double trailer2rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer2licensePlateCountryId;      // con_s
        #endregion

        #region Trailer3
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer3wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer3wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer3wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer3wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer3wheelOnGround;
        public byte trailer3attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer3padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer3wheelSubstance;             // com_ui
        public uint trailer3wheelCount;                   // con_ui

        public float trailer3cargoDamage;
        public float trailer3wearChassis;
        public float trailer3wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelRadius;               // con_f

        public float trailer3linearVelocityX;
        public float trailer3linearVelocityY;
        public float trailer3linearVelocityZ;
        public float trailer3angularVelocityX;
        public float trailer3angularVelocityY;
        public float trailer3angularVelocityZ;
        public float trailer3linearAccelerationX;
        public float trailer3linearAccelerationY;
        public float trailer3linearAccelerationZ;
        public float trailer3angularAccelerationX;
        public float trailer3angularAccelerationY;
        public float trailer3angularAccelerationZ;        // com_fv
        public float trailer3hookPositionX;
        public float trailer3hookPositionY;
        public float trailer3hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer3wheelPositionZ;            // con_fv

        public double trailer3worldX;
        public double trailer3worldY;
        public double trailer3worldZ;
        public double trailer3rotationX;
        public double trailer3rotationY;
        public double trailer3rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer3licensePlateCountryId;      // con_s
        #endregion

        #region Trailer4
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer4wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer4wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer4wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer4wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer4wheelOnGround;
        public byte trailer4attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer4padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer4wheelSubstance;             // com_ui
        public uint trailer4wheelCount;                   // con_ui

        public float trailer4cargoDamage;
        public float trailer4wearChassis;
        public float trailer4wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelRadius;               // con_f

        public float trailer4linearVelocityX;
        public float trailer4linearVelocityY;
        public float trailer4linearVelocityZ;
        public float trailer4angularVelocityX;
        public float trailer4angularVelocityY;
        public float trailer4angularVelocityZ;
        public float trailer4linearAccelerationX;
        public float trailer4linearAccelerationY;
        public float trailer4linearAccelerationZ;
        public float trailer4angularAccelerationX;
        public float trailer4angularAccelerationY;
        public float trailer4angularAccelerationZ;        // com_fv
        public float trailer4hookPositionX;
        public float trailer4hookPositionY;
        public float trailer4hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer4wheelPositionZ;            // con_fv

        public double trailer4worldX;
        public double trailer4worldY;
        public double trailer4worldZ;
        public double trailer4rotationX;
        public double trailer4rotationY;
        public double trailer4rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer4licensePlateCountryId;      // con_s
        #endregion

        #region Trailer5
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer5wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer5wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer5wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer5wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer5wheelOnGround;
        public byte trailer5attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer5padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer5wheelSubstance;             // com_ui
        public uint trailer5wheelCount;                   // con_ui

        public float trailer5cargoDamage;
        public float trailer5wearChassis;
        public float trailer5wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelRadius;               // con_f

        public float trailer5linearVelocityX;
        public float trailer5linearVelocityY;
        public float trailer5linearVelocityZ;
        public float trailer5angularVelocityX;
        public float trailer5angularVelocityY;
        public float trailer5angularVelocityZ;
        public float trailer5linearAccelerationX;
        public float trailer5linearAccelerationY;
        public float trailer5linearAccelerationZ;
        public float trailer5angularAccelerationX;
        public float trailer5angularAccelerationY;
        public float trailer5angularAccelerationZ;        // com_fv
        public float trailer5hookPositionX;
        public float trailer5hookPositionY;
        public float trailer5hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer5wheelPositionZ;            // con_fv

        public double trailer5worldX;
        public double trailer5worldY;
        public double trailer5worldZ;
        public double trailer5rotationX;
        public double trailer5rotationY;
        public double trailer5rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer5licensePlateCountryId;      // con_s
        #endregion

        #region Trailer6
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer6wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer6wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer6wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer6wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer6wheelOnGround;
        public byte trailer6attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer6padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer6wheelSubstance;             // com_ui
        public uint trailer6wheelCount;                   // con_ui

        public float trailer6cargoDamage;
        public float trailer6wearChassis;
        public float trailer6wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelRadius;               // con_f

        public float trailer6linearVelocityX;
        public float trailer6linearVelocityY;
        public float trailer6linearVelocityZ;
        public float trailer6angularVelocityX;
        public float trailer6angularVelocityY;
        public float trailer6angularVelocityZ;
        public float trailer6linearAccelerationX;
        public float trailer6linearAccelerationY;
        public float trailer6linearAccelerationZ;
        public float trailer6angularAccelerationX;
        public float trailer6angularAccelerationY;
        public float trailer6angularAccelerationZ;        // com_fv
        public float trailer6hookPositionX;
        public float trailer6hookPositionY;
        public float trailer6hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer6wheelPositionZ;            // con_fv

        public double trailer6worldX;
        public double trailer6worldY;
        public double trailer6worldZ;
        public double trailer6rotationX;
        public double trailer6rotationY;
        public double trailer6rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer6licensePlateCountryId;      // con_s
        #endregion

        #region Trailer7
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer7wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer7wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer7wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer7wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer7wheelOnGround;
        public byte trailer7attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer7padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer7wheelSubstance;             // com_ui
        public uint trailer7wheelCount;                   // con_ui

        public float trailer7cargoDamage;
        public float trailer7wearChassis;
        public float trailer7wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelRadius;               // con_f

        public float trailer7linearVelocityX;
        public float trailer7linearVelocityY;
        public float trailer7linearVelocityZ;
        public float trailer7angularVelocityX;
        public float trailer7angularVelocityY;
        public float trailer7angularVelocityZ;
        public float trailer7linearAccelerationX;
        public float trailer7linearAccelerationY;
        public float trailer7linearAccelerationZ;
        public float trailer7angularAccelerationX;
        public float trailer7angularAccelerationY;
        public float trailer7angularAccelerationZ;        // com_fv
        public float trailer7hookPositionX;
        public float trailer7hookPositionY;
        public float trailer7hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer7wheelPositionZ;            // con_fv

        public double trailer7worldX;
        public double trailer7worldY;
        public double trailer7worldZ;
        public double trailer7rotationX;
        public double trailer7rotationY;
        public double trailer7rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer7licensePlateCountryId;      // con_s
        #endregion

        #region Trailer8
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer8wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer8wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer8wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer8wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer8wheelOnGround;
        public byte trailer8attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer8padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer8wheelSubstance;             // com_ui
        public uint trailer8wheelCount;                   // con_ui

        public float trailer8cargoDamage;
        public float trailer8wearChassis;
        public float trailer8wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelRadius;               // con_f

        public float trailer8linearVelocityX;
        public float trailer8linearVelocityY;
        public float trailer8linearVelocityZ;
        public float trailer8angularVelocityX;
        public float trailer8angularVelocityY;
        public float trailer8angularVelocityZ;
        public float trailer8linearAccelerationX;
        public float trailer8linearAccelerationY;
        public float trailer8linearAccelerationZ;
        public float trailer8angularAccelerationX;
        public float trailer8angularAccelerationY;
        public float trailer8angularAccelerationZ;        // com_fv
        public float trailer8hookPositionX;
        public float trailer8hookPositionY;
        public float trailer8hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer8wheelPositionZ;            // con_fv

        public double trailer8worldX;
        public double trailer8worldY;
        public double trailer8worldZ;
        public double trailer8rotationX;
        public double trailer8rotationY;
        public double trailer8rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer8licensePlateCountryId;      // con_s
        #endregion

        #region Trailer9
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer9wheelSteerable;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer9wheelSimulated;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer9wheelPowered;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer9wheelLiftable;              // con_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public byte[] trailer9wheelOnGround;
        public byte trailer9attached;                     // com_b

        // 3 byte padding
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
        private readonly byte[] trailer9padding0;         // buffer_b

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public uint[] trailer9wheelSubstance;             // com_ui
        public uint trailer9wheelCount;                   // con_ui

        public float trailer9cargoDamage;
        public float trailer9wearChassis;
        public float trailer9wearWheels;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelSuspDeflection;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelVelocity;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelSteering;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelRotation;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelLift;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelLiftOffset;           // com_f
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelRadius;               // con_f

        public float trailer9linearVelocityX;
        public float trailer9linearVelocityY;
        public float trailer9linearVelocityZ;
        public float trailer9angularVelocityX;
        public float trailer9angularVelocityY;
        public float trailer9angularVelocityZ;
        public float trailer9linearAccelerationX;
        public float trailer9linearAccelerationY;
        public float trailer9linearAccelerationZ;
        public float trailer9angularAccelerationX;
        public float trailer9angularAccelerationY;
        public float trailer9angularAccelerationZ;        // com_fv
        public float trailer9hookPositionX;
        public float trailer9hookPositionY;
        public float trailer9hookPositionZ;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelPositionX;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelPositionY;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = MaxWheelCount)]
        public float[] trailer9wheelPositionZ;            // con_fv

        public double trailer9worldX;
        public double trailer9worldY;
        public double trailer9worldZ;
        public double trailer9rotationX;
        public double trailer9rotationY;
        public double trailer9rotationZ;                  // com_dp

        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9id;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9CargoAccessoryId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9bodyType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9brandId;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9brand;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9name;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9chainType;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9licensePlate;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9licensePlateCountry;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GeneralStringSize)]
        public byte[] trailer9licensePlateCountryId;      // con_s
        #endregion

        #endregion
    }
}