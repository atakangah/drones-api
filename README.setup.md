## DRONES

# Pre-requisites
1. Install node package manger (npm)
2. Visual studio code (Optional - for viewing database structure)
3. SQLite Visual Studio Code Extension (Required if using Vscode to view database);

# Steps to run
1. Clone repository to desired location
2. Change directory into the folder created (i.e andrews-kangah)
3. Run `npm install` to install package dependencies
4. Run `npm run start` to start server

# Steps to test
1. Change directory to project folder (i.e andrews-kangah)
2. Run `npm run test`


# Available Endpoints

- api/v1/register
  Registers a new drone in the fleet

  - Params
    ------
    - `serialNumber`: Serial number of drone e.g DRONE1
    - `model`: Drone model e.g Lightweight
    - `state`: Id from DRONE_MODEL TABLE matching of possible states (IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING)
    - `weightLimit`: Maximum carrying weight of drone
    - `batteryPercentage`: Current battery percent of drone

  - Method
    ------
    POST

- api/v1/load
  Loads specified medications onto specified drone

  - Params
    ------
    - `droneSerialNumber`: Serial number of drone to load e.g DRONE1
    - `medicationsNames`: List of medicine names to load onto drone e.g [Penycillin]
  
  - Method
    ------
    POST


- api/v1/cargo
  Returns a list of medications loaded on a specified drone

  - Params
    ------
    - `droneSerialNumber`: Serial of number of drone to get loaded medicatioins e.g DRONE1

  - Method
    ------
    GET

- api/v1/available
  Returns a list of available drones i.e drones in IDLE/LOADING state

  - Params
    ------
    - `droneSerialNumber`: Serial of number of drone to get loaded medicatioins e.g DRONE1

  - Method
    ------
    GET

- api/v1/battery
  Returns the current battery percentage of specified drone

  - Params
    ------
    - `droneSerialNumber`: Serial of number of drone to get loaded medicatioins e.g DRONE1

  - Method
    ------
    GET  
