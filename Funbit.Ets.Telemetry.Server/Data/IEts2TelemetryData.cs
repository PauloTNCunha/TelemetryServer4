using System;
using System.Collections.Generic;
using System.Net.Configuration;

namespace Funbit.Ets.Telemetry.Server.Data
{
    public interface IEts2TelemetryData
    {
        /// <summary>
        /// Game information.
        /// </summary>
        IEts2Game Game { get; }
        
        /// <summary>
        /// Truck information.
        /// </summary>
        IEts2Truck Truck { get; }

        /// <summary>
        /// Truck information.
        /// </summary>
        IEts2Shifter Shifter { get; }

        /// <summary>
        /// Number of trailers present.
        /// </summary>
        int TrailerCount { get; }

        /// <summary>
        /// Trailers  information.
        /// </summary>
        IEts2Trailer[] Trailers { get; }

        /// <summary>
        /// For compability with 3.x, trailer[0]  information.
        /// </summary>
        IEts2Trailer Trailer { get; }

        /// <summary>
        /// Job information.
        /// </summary>
        IEts2Job Job { get; }

        /// <summary>
        /// Cargo information.
        /// </summary>
        IEts2Cargo Cargo { get; }

        /// <summary>
        /// Navigation information.
        /// </summary>
        IEts2Navigation Navigation { get; }

        IEts2FinedGameplayEvent FinedEvent { get; }

        IEts2JobGameplayEvent JobEvent { get; }

        IEts2TollgateGameplayEvent TollgateEvent { get; }

        IEts2FerryGameplayEvent FerryEvent { get; }

        IEts2TrainGameplayEvent TrainEvent { get; }
    }

    public interface IEts2Game
    {
        /// <summary>
        /// Indicates whether the telemetry server is connected
        /// to the simulator (ETS) or not.
        /// </summary>
        bool Connected { get; }

        /// <summary>
        /// Returns the acronym of the currently running game (ETS2, ATS), or null if game name could not be detected.
        /// </summary>
        string GameName { get; }

        /// <summary>
        /// Current game time. 
        /// Serializes to ISO 8601 string in JSON.
        /// Example: "0001-01-05T05:11:00Z"
        /// </summary>
        DateTime Time { get; }
        /// <summary>
        /// True if game is currently paused, false otherwise.
        /// </summary>
        bool Paused { get; }

        /// <summary>
        /// Current version of the telemetry plugin DLL file.
        /// Example: "4"
        /// </summary>
        string TelemetryPluginVersion { get; }
        /// <summary>
        /// Current version of the game.
        /// Example: "1.10"
        /// </summary>
        string Version { get; }
        /// <summary>
        /// Current version of the server.
        /// Example: "4.1.0.0"
        /// </summary>
        string TelemetryServerVersion { get; }

        /// <summary>
        /// When the fatigue simulation is disabled, the behavior of this channel
        /// is implementation dependent. The game might provide the value which would
        /// apply if it was enabled or provide no value at all.
        /// Example: "0001-01-01T10:52:00Z"
        /// </summary>
        DateTime NextRestStopTime { get; }
        /// <summary>
        /// Scale applied to distance and time to compensate 
        /// for the scale of the map (e.g. 1s of real time corresponds 
        /// to local_scale seconds of simulated game time).
        /// Example: 3
        /// </summary>
        float TimeScale { get; }

        /// <summary>
        /// The maximum number of trailers supported by the game. Currently this will always be 10.
        /// </summary>
        int MaxTrailerCount { get; }
    }

    public interface IEts2Vector
    {
        float X { get; }
        float Y { get; }
        float Z { get; }
    }

    public interface IEts2Placement
    {
        /// <summary>
        /// X coordinate of the placement.
        /// Example: 13723.7881
        /// </summary>
        double X { get; }
        /// <summary>
        /// Y coordinate of the placement.
        /// Example: 65.22377
        /// </summary>
        double Y { get; }
        /// <summary>
        /// Z coordinate of the placement.
        /// Example: 13738.8018
        /// </summary>
        double Z { get; }
        /// <summary>
        /// The angle is measured counterclockwise in horizontal plane when looking
        /// from top where 0 corresponds to forward (north), 0.25 to left (west),
        /// 0.5 to backward (south) and 0.75 to right (east).
        /// Stored in unit range where (0,1) corresponds to (0,360).
        /// Example: 0.13688866
        /// </summary>
        double Heading { get; }
        /// <summary>
        /// The pitch angle is zero when in horizontal direction,
        /// with positive values pointing up (0.25 directly to zenith),
        /// and negative values pointing down (-0.25 directly to nadir).
        /// Stored in unit range where (-0.25,0.25) corresponds to (-90,90).
        /// Example: 0.00005
        /// </summary>
        double Pitch { get; }
        /// <summary>
        /// The angle is measured in counterclockwise when looking in direction of the roll axis.
        /// Stored in unit range where (-0.5,0.5) corresponds to (-180,180).
        /// Example: -0.00009
        /// </summary>
        double Roll { get; }
    }

    public interface IEts2Truck
    {
        /// <summary>
        /// Brand Id of the current truck. 
        /// Example: "man".
        /// </summary>
        string Id { get; }
        /// <summary>
        /// Localized brand name of the current truck for display purposes.
        /// Example: "MAN".
        /// </summary>
        string Make { get; }
        /// <summary>
        /// Localized model name of the current truck.
        /// Example: "TGX".
        /// </summary>
        string Model { get; }

        /// <summary>
        /// Current truck speed in km/h.
        /// Example: 50.411231
        /// </summary>
        float Speed { get; }

        
        /// <summary>
        /// The value of the odometer in km.
        /// Example: 105809.25
        /// </summary>
        float Odometer { get; }
        /// <summary>
        /// Speed selected for the cruise control in km/h.
        /// Example: 75
        /// </summary>
        float CruiseControlSpeed { get; }

        /// <summary>
        /// Type of the shifter.
        /// Left under truck interface for campability.
        /// One of the following values: "arcade", "automatic", "manual", "hshifter".
        /// </summary>
        string ShifterType { get; }
        /// <summary>
        /// Number of forward gears on undamaged truck.
        /// Left under truck interface for campability.
        /// Example: 12
        /// </summary>
        int ForwardGears { get; }
        /// <summary>
        /// Number of reverse gears on undamaged truck.
        /// Left under truck interface for campability.
        /// Example: 2
        /// </summary>
        int ReverseGears { get; }
        /// <summary>
        /// Gear that is currently selected in the engine.
        /// Positive values reflect forward gears, negative - reverse.
        /// Left under truck interface for campability.
        /// Example: 9
        /// </summary>
        int Gear { get; }
        /// <summary>
        /// Gear that is currently displayed on the main dashboard.
        /// Positive values reflect forward gears, negative - reverse.
        /// Left under truck interface for campability.
        /// Example: 4
        /// </summary>
        int DisplayedGear { get; }
        /// <summary>
        /// Current RPM value of the truck's engine (rotates per minute).
        /// Example: 1372.3175
        /// </summary>
        float EngineRpm { get; }
        /// <summary>
        /// Maximal RPM value of the truck's engine.
        /// Example: 2500
        /// </summary>
        float EngineRpmMax { get; }

        /// <summary>
        /// Current amount of fuel in liters.
        /// Example: 696.7544
        /// </summary>
        float Fuel { get; }
        /// <summary>
        /// Fuel tank capacity in litres.
        /// Example: 700
        /// </summary>
        float FuelCapacity { get; }
        /// <summary>
        /// Average consumption of the fuel in liters/km.
        /// Example: 0.4923077
        /// </summary>
        float FuelAverageConsumption { get; }

        /// <summary>
        /// Steering received from input (-1;1).
        /// Note that it is interpreted counterclockwise.
        /// If the user presses the steer right button on digital input
        /// (e.g. keyboard) this value goes immediatelly to -1.0
        /// Example: -1.0
        /// </summary>
        float UserSteer { get; }
        /// <summary>
        /// Throttle received from input (-1;1).
        /// If the user presses the forward button on digital input
        /// (e.g. keyboard) this value goes immediatelly to 1.0
        /// Example: 0
        /// </summary>
        float UserThrottle { get; }
        /// <summary>
        /// Brake received from input (-1;1)
        /// If the user presses the brake button on digital input
        /// (e.g. keyboard) this value goes immediatelly to 1.0
        /// Example: 0
        /// </summary>
        float UserBrake { get; }
        /// <summary>
        /// Clutch received from input (-1;1)
        /// If the user presses the clutch button on digital input
        /// (e.g. keyboard) this value goes immediatelly to 1.0
        /// Example: 0
        /// </summary>
        float UserClutch { get; }

        /// <summary>
        /// Steering as used by the simulation (-1;1)
        /// Note that it is interpreted counterclockwise.
        /// Accounts for interpolation speeds and simulated
        /// counterfoces for digital inputs.
        /// Example: -0.423521
        /// </summary>
        float GameSteer { get; }
        /// <summary>
        /// Throttle pedal input as used by the simulation (0;1)
        /// Accounts for the press attack curve for digital inputs
        /// or cruise-control input.
        /// Example: 0.17161
        /// </summary>
        float GameThrottle { get; }
        /// <summary>
        /// Brake pedal input as used by the simulation (0;1)
        /// Accounts for the press attack curve for digital inputs. 
        /// Does not contain retarder, parking or motor brake.
        /// Example: 0
        /// </summary>
        float GameBrake { get; }
        /// <summary>
        /// Clutch pedal input as used by the simulation (0;1)
        /// Accounts for the automatic shifting or interpolation of
        /// player input.
        /// Example: 0
        /// </summary>
        float GameClutch { get; }
        
        /// <summary>
        /// Current level of the retarder brake.
        /// Ranges from 0 to RetarderStepCount.
        /// Example: 0
        /// </summary>
        int RetarderBrake { get; }
        /// <summary>
        /// Number of steps in the retarder.
        /// Set to zero if retarder is not mounted to the truck.
        /// Example: 3
        /// </summary>
        int RetarderStepCount { get; }
        
        /// <summary>
        /// Pressure in the brake air tank in psi.
        /// Example: 133.043961
        /// </summary>
        float AirPressure { get; }
        /// <summary>
        /// Temperature of the brakes in degrees celsius.
        /// Example: 15.9377184
        /// </summary>
        float BrakeTemperature { get; }
        /// <summary>
        /// Amount of AdBlue in liters.
        /// Example: 0
        /// </summary>
        float Adblue { get; }
        /// <summary>
        /// Average consumption of the adblue in liters/km.
        /// Example: 0
        /// </summary>
        float AdblueAverageConsumption { get; }
        /// <summary>
        /// Pressure of the oil in psi.
        /// Example: 36.4550362
        /// </summary>
        float OilPressure { get; }
        /// <summary>
        /// Temperature of the oil in degrees celsius.
        /// Example: 16.2580566
        /// </summary>
        float OilTemperature { get; }
        /// <summary>
        /// Temperature of the water in degrees celsius.
        /// Example: 16.1623955
        /// </summary>
        float WaterTemperature { get; }
        /// <summary>
        /// Voltage of the battery in volts.
        /// Example: 23.4985161
        /// </summary>
        float BatteryVoltage { get; }
        /// <summary>
        /// AdBlue tank capacity in litres.
        /// Example: 0
        /// </summary>
        float AdblueCapacity { get; }
        
        /// <summary>
        /// Current level of truck's engine wear/damage between 0 (min) and 1 (max).
        /// Example: 0.00675457
        /// </summary>
        float WearEngine { get; }
        /// <summary>
        /// Current level of truck's transmission wear/damage between 0 (min) and 1 (max).
        /// </summary>
        float WearTransmission { get; }
        /// <summary>
        /// Current level of truck's cabin wear/damage between 0 (min) and 1 (max).
        /// </summary>
        float WearCabin { get; }
        /// <summary>
        /// Current level of truck's chassis wear/damage between 0 (min) and 1 (max).
        /// </summary>
        float WearChassis { get; }
        /// <summary>
        /// Current level of truck's wheel wear/damage between 0 (min) and 1 (max).
        /// </summary>
        float WearWheels { get; }




        /// <summary>
        /// Indicates whether cruise control is turned on or off. 
        /// </summary>
        bool CruiseControlOn { get; }
        /// <summary>
        /// Indicates whether wipers are currently turned on or off.
        /// </summary>
        bool WipersOn { get; }

        /// <summary>
        /// Is the parking brake enabled or not.
        /// </summary>
        bool ParkBrakeOn { get; }
        /// <summary>
        /// Is the motor brake enabled or not.
        /// </summary>
        bool MotorBrakeOn { get; }

        /// <summary>
        /// Is the engine enabled or not.
        /// </summary>
        bool EngineOn { get; }
        /// <summary>
        /// Is the electric enabled or not.
        /// </summary>
        bool ElectricOn { get; }

        /// <summary>
        /// Is left blinker currently emits light or not.
        /// </summary>
        bool BlinkerLeftActive { get; }
        /// <summary>
        /// Is right blinker currently emits light or not.
        /// </summary>
        bool BlinkerRightActive { get; }
        /// <summary>
        /// Is left blinker currently turned on or off.
        /// </summary>
        bool BlinkerLeftOn { get; }
        /// <summary>
        /// Is right blinker currently turned on or off.
        /// </summary>
        bool BlinkerRightOn { get; }

        /// <summary>
        /// Are the parking lights enabled or not.
        /// </summary>
        bool LightsParkingOn { get; }
        /// <summary>
        /// Are the low beam lights enabled or not.
        /// </summary>
        bool LightsBeamLowOn { get; }
        /// <summary>
        /// Are the high beam lights enabled or not.
        /// </summary>
        bool LightsBeamHighOn { get; }
        /// <summary>
        /// Are the auxiliary front lights active or not.
        /// </summary>
        bool LightsAuxFrontOn { get; }
        /// <summary>
        /// Are the auxiliary roof lights active or not.
        /// </summary>
        bool LightsAuxRoofOn { get; }
        /// <summary>
        /// Are the beacon lights enabled or not.
        /// </summary>
        bool LightsBeaconOn { get; }
        /// <summary>
        /// Is the brake light active or not.
        /// </summary>
        bool LightsBrakeOn { get; }
        /// <summary>
        /// Is the reverse light active or not.
        /// </summary>
        bool LightsReverseOn { get; }

        /// <summary>
        /// Is the battery voltage/not charging warning active or not.
        /// </summary>
        bool BatteryVoltageWarningOn { get; }
        /// <summary>
        /// Is the air pressure warning active or not.
        /// </summary>
        bool AirPressureWarningOn { get; }
        /// <summary>
        /// Are the emergency brakes active as result of low air pressure or not.
        /// </summary>
        bool AirPressureEmergencyOn { get; }
        /// <summary>
        /// Is the low adblue warning active or not.
        /// </summary>
        bool AdblueWarningOn { get; }
        /// <summary>
        /// Is the oil pressure warning active or not.
        /// </summary>
        bool OilPressureWarningOn { get; }
        /// <summary>
        /// Is the water temperature warning active or not.
        /// </summary>
        bool WaterTemperatureWarningOn { get; }

        /// <summary>
        /// Intensity of the dashboard backlight between 0 (off) and 1 (max).
        /// </summary>
        float LightsDashboardValue { get; }
        /// <summary>
        /// Is the dashboard backlight currently turned on or off.
        /// </summary>
        bool LightsDashboardOn { get; }

        /// <summary>
        /// Is the low fuel warning active or not.
        /// </summary>
        bool FuelWarningOn { get; }

        /// <summary>
        /// Fraction of the fuel capacity bellow which is activated the fuel warning.
        /// Example: 0.15
        /// </summary>
        float FuelWarningFactor { get; }
        /// <summary>
        /// Pressure of the air in the tank bellow which the warning activates.
        /// Example: 65
        /// </summary>
        float AirPressureWarningValue { get; }
        /// <summary>
        /// Pressure of the air in the tank bellow which the emergency brakes activate.
        /// Example: 30
        /// </summary>
        float AirPressureEmergencyValue { get; }
        /// <summary>
        /// Pressure of the oil bellow which the warning activates.
        /// Example: 10
        /// </summary>
        float OilPressureWarningValue { get; }
        /// <summary>
        /// Temperature of the water above which the warning activates.
        /// Example: 105
        /// </summary>
        float WaterTemperatureWarningValue { get; }
        /// <summary>
        /// Voltage of the battery bellow which the warning activates.
        /// Example: 22
        /// </summary>
        float BatteryVoltageWarningValue { get; }

        /// <summary>
        /// The truck's license plate
        /// </summary>
        string LicensePlate { get; }

        /// <summary>
        /// Id of the truck's license plate's country for internal use by code.
        /// </summary>
        string LicensePlateCountryId { get; }

        /// <summary>
        /// The localized name of the truck's license plate's country
        /// </summary>
        string LicensePlateCountry { get; }

        /// <summary>
        /// Represents vehicle space linear acceleration of 
        /// the truck measured in meters per second^2.
        /// Example: { "x": 0.046569, "y": -0.00116, "z": -1.03676 }
        /// </summary>
        IEts2Vector Acceleration { get; }
        /// <summary>
        /// Current truck placement in the game world.
        /// </summary>
        IEts2Placement Placement { get; }

        /// <summary>
        /// Default position of the head in the cabin space.
        /// Example: { "x": -0.795116067, "y": 1.43522251, "z": -0.08483863 }
        /// </summary>
        IEts2Vector Head { get; }
        /// <summary>
        /// Position of the cabin in the vehicle space.
        /// This is position of the joint around which the cabin rotates.
        /// This attribute might be not present if the vehicle does not have a separate cabin.
        /// Example: { "x": 0, "y": 1.36506855, "z": -1.70362806 }
        /// </summary>
        IEts2Vector Cabin { get; }
        /// <summary>
        /// Position of the trailer connection hook in vehicle space.
        /// Example: { "x": 0, "y": 0.939669, "z": -6.17736959 }
        /// </summary>
        IEts2Vector Hook { get; }

        /// <summary>
        /// Current number of wheels between 0 (min) and 16 (max).
        /// </summary>
        int WheelCount { get; }
        /// <summary>
        /// Wheels array between 0 (min) and 15 (max).
        /// </summary>
        IEts2Wheel[] Wheels { get; }

    }

    public interface IEts2Navigation
    {
        /// <summary>
        /// Relative estimated time of arrival.
        /// Example: "0001-01-01T02:05:00Z"
        /// </summary>
        DateTime EstimatedTime { get; }

        /// <summary>
        /// Estimated distance to the destination in meters.
        /// Example: 1224
        /// </summary>
        int EstimatedDistance { get; }

        /// <summary>
        /// Current value of the "Route Advisor speed limit" in km/h.
        /// Example: 50
        /// </summary>
        int SpeedLimit { get; }
    }

    public interface IEts2Job
    {
        /// <summary>
        /// Reward in internal game-specific currency.
        /// Example: 2316
        /// </summary>
        int Income { get; }

        /// <summary>
        /// Flag indicating whether or not the job is a special transport job
        /// </summary>
        bool SpecialTransport { get; }

        /// <summary>
        /// The job market this job is from. Possible values:
        ///   - cargo_market
        ///   - quick_job
        ///   - freight_market
        ///   - external_contracts
        ///   - external_market
        /// </summary>
        string JobMarket { get; }

        /// <summary>
        /// Absolute in-game time of end of job delivery window.
        /// Delivering the job after this time will cause it be late.
        /// Example: "0001-01-09T03:34:00Z"
        /// </summary>
        DateTime DeadlineTime { get; }
        /// <summary>
        /// Relative remaining in-game time left before deadline.
        /// Example: "0001-01-01T07:06:00Z"
        /// </summary>
        DateTime RemainingTime { get; }
        
        /// <summary>
        /// Localized name of the source city for display purposes.
        /// Example: "Linz"
        /// </summary>
        string SourceCity { get; }
        /// <summary>
        /// Localized name of the destination city for display purposes.
        /// Example: "Salzburg"
        /// </summary>
        string DestinationCity { get; }
        /// <summary>
        /// Localized name of the source company for display purposes.
        /// Example: "DHL"
        /// </summary>
        string SourceCompany { get; }
        /// <summary>
        /// Localized name of the destination company for display purposes.
        /// Example: "JCB"
        /// </summary>
        string DestinationCompany { get; }
    }

    public interface IEts2Trailer
    {
        /// <summary>
        /// The trailer number. 1 -> First trailer; 10 -> Last trailer
        /// </summary>
        int Number { get; }

        /// <summary>
        /// Is the trailer attached to the truck or not.
        /// </summary>
        bool Attached { get; }

        /// <summary>
        /// Does the trailer exist in the game world
        /// </summary>
        bool Present { get; }

        /// <summary>
        /// Id of the trailer for internal use by code.
        /// Example: "derrick"
        /// </summary>
        string Id { get; }

        /// <summary>
        /// Id of the trailer's cargo accessory for internal use by code.
        /// </summary>
        string CargoAccessoryId { get; }

        /// <summary>
        /// The trailer's body type
        /// </summary>
        string BodyType { get; }

        /// <summary>
        /// Id of the trailer brand for internal use by code.
        /// </summary>
        string BrandId { get; }

        /// <summary>
        /// Localized name of the trailer's brand.
        /// </summary>
        string Brand { get; }

        /// <summary>
        /// Localized name of the current trailer for display purposes.
        /// </summary>
        string Name { get; }

        /// <summary>
        /// Trailers chain type
        /// </summary>
        string ChainType { get; }

        /// <summary>
        /// The trailer's license plate
        /// </summary>
        string LicensePlate { get; }

        /// <summary>
        /// The localized name of the license plate's country
        /// </summary>
        string LicensePlateCountry { get; }

        /// <summary>
        /// Id of the license plate's country for internal use by code.
        /// </summary>
        string LicensePlateCountryId { get; }

        /// <summary>
        /// Current trailer placement in the game world.
        /// </summary>
        IEts2Placement Placement { get; }

        /// <summary>
        /// Distance to the truck position.
        /// </summary>
        float Distance { get; }

        /// <summary>
        /// Hook position in the trailer.
        /// </summary>
        IEts2Vector Hook { get; }

        /// <summary>
        /// Current level of cargo damage respective to this specific trailer between 0 (min) and 1 (max).
        /// Example: 0.0314717
        /// </summary>
        float CargoDamage { get; }

        /// <summary>
        /// Current level of trailer chassis wear/damage between 0 (min) and 1 (max).
        /// Example: 0.0314717
        /// </summary>
        float WearChassis { get; }

        /// <summary>
        /// Current level of trailer wheels wear/damage between 0 (min) and 1 (max).
        /// Example: 0.0314717
        /// </summary>
        float WearWheels { get; }

        /// <summary>
        /// For compability, current level of wear/damage between 0 (min) and 1 (max).
        /// Example: 0.0314717
        /// </summary>
        float Wear { get; set; }

        /// <summary>
        /// Current number of wheels between 0 (min) and 16 (max).
        /// </summary>
        uint WheelCount { get; }

        /// <summary>
        /// Wheels array between 0 (min) and 15 (max).
        /// </summary>
        IEts2Wheel[] Wheels { get; }

    }

    public interface IEts2Cargo
    {
        /// <summary>
        /// Flag indicating whether or not cargo has been loaded into the player's trailer (for non-cargo market jobs this is always true)
        /// </summary>
        bool CargoLoaded { get; }

        /// <summary>
        /// Id of the cargo for internal use by code
        /// </summary>
        string CargoId { get; }

        /// <summary>
        /// Localized name of the current cargo for display purposes
        /// </summary>
        string Cargo { get; }

        /// <summary>
        /// Mass of the cargo in kilograms across all trailers
        /// </summary>
        float Mass { get; }

        /// <summary>
        /// Mass of an individual piece of cargo in kilograms
        /// </summary>
        float UnitMass { get; }

        /// <summary>
        /// The number of units of cargo across all trailers
        /// </summary>
        int UnitCount { get; }

        /// <summary>
        /// Current level of cargo damage between 0 (min) and 1 (max) across all trailers.
        /// </summary>
        float Damage { get; }
    }

    #region Events

    public interface IEts2FinedGameplayEvent
    {
        /// <summary>
        /// The offense the user committed that resulted in the fine. Possible values:
        ///   - crash              Player crashed into another vehicle (or vice-versa)
        ///   - avoid_sleeping     Player ignored sleeping requirements
        ///   - wrong_way          Player drove on wrong side of road
        ///   - speeding_camera    Player caught speeding by a traffic camera
        ///   - no_lights          Player caught driving with headlights off during nighttime hours
        ///   - red_signal         Player drove through a red signal
        ///   - speeding           Player caught speeding by a police officer on the road
        ///   - avoid_weighing     Player skipped weigh station when prompted (ATS only)
        ///   - illegal_trailer    Player drove a trailer into a country that does not allow the player's trailer configuration
        ///   - generic            ???
        /// </summary>
        string FineOffense { get; }

        /// <summary>
        /// The amount of the fine
        /// </summary>
        int FineAmount { get; }

        /// <summary>
        /// Flag determining whether or not a player has been fined
        /// </summary>
        bool Fined { get; }
    }

    public interface IEts2JobGameplayEvent
    {
        /// <summary>
        /// Flag determining whether or not a job has been finished
        /// </summary>
        bool JobFinished { get; }

        /// <summary>
        /// Flag determining whether or not a job has been cancelled
        /// </summary>
        bool JobCancelled { get; }

        /// <summary>
        /// Flag determining whether or not a job has been delivered
        /// </summary>
        bool JobDelivered { get; }

        /// <summary>
        /// The penalty amount when a job is cancelled
        /// </summary>
        int CancelPenalty { get; }

        /// <summary>
        /// The amount the player receives when a job is completed
        /// </summary>
        int Revenue { get; }

        /// <summary>
        /// The amount of XP the player received for completing the job
        /// </summary>
        int EarnedXp { get; }

        /// <summary>
        /// The percentage of cargo that was damaged
        /// </summary>
        float CargoDamage { get; }

        /// <summary>
        /// The distance the player drove to complete the job, in km
        /// </summary>
        int Distance { get; }

        /// <summary>
        /// The time the player took to complete the job, in minutes
        /// </summary>
        DateTime DeliveryTime { get; }

        /// <summary>
        /// Flag determining whether or not the player used auto-park
        /// </summary>
        bool AutoparkUsed { get; }

        /// <summary>
        /// Flag determining whether or not the player used autoload (always `true` for non-cargo market jobs)
        /// </summary>
        bool AutoloadUsed { get; }
    }

    public interface IEts2TollgateGameplayEvent
    {
        /// <summary>
        /// Flag determining whether or not a player used a tollgate/toll booth
        /// </summary>
        bool TollgateUsed { get; }

        /// <summary>
        /// The toll amount paid by the player
        /// </summary>
        int PayAmount { get; }
    }

    public interface IEts2FerryGameplayEvent
    {
        /// <summary>
        /// Flag determining whether or not the player used a ferry
        /// </summary>
        bool FerryUsed { get; }

        /// <summary>
        /// Localized name of the source location
        /// </summary>
        string SourceName { get; }

        /// <summary>
        /// Localized name of the target location
        /// </summary>
        string TargetName { get; }

        /// <summary>
        /// Id of the source location for internal use by code
        /// </summary>
        string SourceId { get; }

        /// <summary>
        /// Id of the target location for internal use by code
        /// </summary>
        string TargetId { get; }

        /// <summary>
        /// The amount paid by the player
        /// </summary>
        int PayAmount { get; }
    }

    public interface IEts2TrainGameplayEvent
    {
        /// <summary>
        /// Flag determining whether or not the player used a train
        /// </summary>
        bool TrainUsed { get; }

        /// <summary>
        /// Localized name of the source location
        /// </summary>
        string SourceName { get; }

        /// <summary>
        /// Localized name of the target location
        /// </summary>
        string TargetName { get; }

        /// <summary>
        /// Id of the source location for internal use by code
        /// </summary>
        string SourceId { get; }

        /// <summary>
        /// Id of the target location for internal use by code
        /// </summary>
        string TargetId { get; }

        /// <summary>
        /// The amount paid by the player
        /// </summary>
        int PayAmount { get; }
    }

    #endregion

    public interface IEts2Wheel
    {
        /// <summary>
        /// Is the wheel physically simulated or not.
        /// </summary>
        bool Simulated { get; }
        /// <summary>
        /// Is the wheel steerable or not.
        /// </summary>
        bool Steerable { get; }
        /// <summary>
        /// Radius of the wheel.
        /// Example: 0.5120504
        /// </summary>
        float Radius { get; }
        /// <summary>
        /// Position of respective wheels in the vehicle space.
        /// Example: { "x": -0.9, "y": 0.506898463, "z": 6.25029 }
        /// </summary>
        IEts2Vector Position { get; }
        /// <summary>
        /// Is the wheel powered or not.
        /// </summary>
        bool Powered { get; }
        /// <summary>
        /// Is the wheel liftable or not.
        /// </summary>
        bool Liftable { get; }
        /// <summary>
        ///  For use with simple lifted/non-lifted test.
        /// </summary>
        bool Lifted { get; }
    }

    public interface IEts2Shifter
    {
        /// <summary>
        /// Type of the shifter.
        /// Left under truck interface for campability.
        /// One of the following values: "arcade", "automatic", "manual", "hshifter".
        /// </summary>
        string Type { get; }
        /// <summary>
        /// Number of forward gears on undamaged truck.
        /// Example: 12
        /// </summary>
        int ForwardGears { get; }
        /// <summary>
        /// Forward gear names.
        /// Example: ["N","CL","CH","1L","1H","2L","2H","3L","3H","4L","4H","5L","5H","6L","6H","7L","7H","8L","8H"]
        /// </summary>
        string[] ForwardGearNames { get; }
        /// <summary>
        /// Number of reverse gears on undamaged truck.
        /// Example: 2
        /// </summary>
        int ReverseGears { get; }
        /// <summary>
        /// Reverse gear names.
        /// Example: ["N","R1L","R1H","R2L","R2H"]
        /// </summary>
        string[] ReverseGearNames { get; }
        /// <summary>
        /// Differential ratio of the truck.
        /// Example: 3.25
        /// </summary>
        float DifferentialRatio { get; }
        /// <summary>
        /// Differential ratio of all forward gears.
        /// Example: [14.4,12.29,8.56,7.3,6.05,5.16,4.38,3.74,3.2,2.73,2.29,1.95,1.62,1.38,1.17,1.0,0.86,0.73]
        /// </summary>
        float[] ForwardGearRatios { get; }
        /// <summary>
        /// Differential ratio of all reverse gears.
        /// Example: [-15.06,-12.85,-4.03,-3.43]
        /// </summary>
        float[] ReverseGearRatios { get; }
        /// <summary>
        /// Circumference of the powered tyre.
        /// Example: 3.1808698271960143
        /// </summary>
        double TyreCircumference { get; }
        /// <summary>
        /// Speed ​​reached by forward gear at 1500 rpm.
        /// Example: [5,6,8,10,12,13,16,19,22,26,30,36,43,50,60,70,81,95]
        /// </summary>
        int[] ForwardSpeedAt1500Rpm { get; }
        /// <summary>
        /// Speed ​​reached by reverse gear at 1500 rpm.
        /// Example: [-5,-5,-17,-20]
        /// </summary>
        int[] ReverseSpeedAt1500Rpm { get; }
        /// <summary>
        /// Engine RPM for all forward gears at current speed.
        /// Example: [6410,5471,3810,3249,2693,2297,1950,1665,1424,1215,1019,868,721,614,521,445,383,325]
        /// </summary>
        int[] ForwardRpmAtCurrentSpeed { get; }
        /// <summary>
        /// Engine RPM for all reverse gears at current speed.
        /// Example: [-6704,-5720,-1794,-1527]
        /// </summary>
        int[] ReverseRpmAtCurrentSpeed { get; }
        /// <summary>
        /// Number of selectors in the h-shifter.
        /// Example: 4
        /// </summary>
        int SelectorCount { get; }
        /// <summary>
        /// Number of slots in the h-shifter.
        /// Example: 7
        /// </summary>
        int SlotCount { get; }
        /// <summary>
        /// All available h-shifter handle.
        /// Mapping to physical position of the handle depends on input setup.
        /// Example: Slots[7]
        /// </summary>
        IEts2ShifterSlot[] Slots { get; }

        /// <summary>
        /// Gear that is currently selected in the engine.
        /// Positive values reflect forward gears, negative - reverse.
        /// Example: 9
        /// </summary>
        int Gear { get; }
        /// <summary>
        /// Gear that is currently displayed on the main dashboard.
        /// Positive values reflect forward gears, negative - reverse.
        /// Example: 4
        /// </summary>
        int DisplayedGear { get; }
        /// <summary>
        /// The name of the gear that is currently displayed on the main dashboard.
        /// It depends on shifter type.
        /// Example: 8L
        /// </summary>
        string DisplayedGearName { get; }
        /// <summary>
        /// Gear selected when requirements for this h-shifter slot are meet.
        /// Example: 18
        /// </summary>
        float GearRatio { get; }

        /// <summary>
        /// Gearbox slot the h-shifter handle is currently in.
        /// 0 means that no slot is selected.
        /// Example: 7
        /// </summary>
        int Slot { get; }
        /// <summary>
        /// Mapping between the range/splitter functionality and
        /// selector index is described by HSHIFTER configuration.
        /// Example: 3
        /// </summary>
        int Selector { get; }

        /// <summary>
        /// The best gear to be selected.
        /// Example: 14
        /// </summary>
        int BestGear { get; }
        /// <summary>
        /// Name of the best gear to be selected.
        /// Example: 6H
        /// </summary>
        string BestGearName { get; }

    }


    public interface IEts2ShifterSlot
    {
        /// <summary>
        /// Position of h-shifter handle.
        /// Zero corresponds to neutral position. 
        /// Mapping to physical position of the handle depends on input setup.
        /// Example: 7
        /// </summary>
        int Slot { get; }
        /// <summary>
        /// All available shifter state of selectors.
        /// Example: Seletors[4]
        /// </summary>
        IEts2ShifterSelector[] Seletors { get; }
    }
    public interface IEts2ShifterSelector
    {
        /// <summary>
        /// Position of the on/off state of selectors.
        /// Example: 3
        /// </summary>
        int Selector { get; }
        /// <summary>
        /// Gear selected when requirements for this h-shifter slot are meet.
        /// Example: 18
        /// </summary>
        int Gear { get; }
        /// <summary>
        /// Gear's name when requirements for this h-shifter slot are meet.
        /// Example: 8H
        /// </summary>
        string GearName { get; }
    }

}