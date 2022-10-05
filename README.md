# DRONES API

## Pre-requisites
1. Install node package manger (npm)
2. Visual studio code (Optional - for visualizing SQLite database)
3. SQLite Visual Studio Code Extension (Required if using Vscode to visualize database);
4. Install Docker
  

## Steps to run
1. Clone repository to desired location
2. Change directory into the project folder (i.e andrews-kangah)
3. Make sure docker is running
4. Run `docker-compose up` to start docker build and bring application up
5. You can also run `docker-compose up -d` to run application in background and run `docker ps` to see the process
6. Make requests to [BASE_URL](http://localhost:3000)
   

## Steps to build
1. Change directory to project foler (i.e andrews-kangah)
2. Make sure docker is running
3. Run `docker build -t drones:latest .` to build latest image


## Steps to test
1. Change directory to project folder (i.e andrews-kangah)
2. Run `npm install` to install dependencies
3. Run `npm run test` to run tests


## Available Endpoints
- **api/v1/register**:
  Registers a new drone in the fleet

  - Params
    ------
    - `serialNumber`: Serial number of drone e.g DRONE1
    - `model`: Drone model (Lightweight, Middleweight, Cruiserweight, Heavyweight)
    - `state`: Drone state (IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING)
    - `weightLimit`: Maximum carrying weight of drone
    - `batteryPercentage`: Current battery percent of drone

  - Method
    ------
    POST

- **api/v1/load**:
  Loads specified medications onto specified drone

  - Params
    ------
    - `droneSerialNumber`: Serial number of drone to load e.g DRONE1
    - `medicationsNames`: List of medicine names to load onto drone e.g [Penycillin]
  
  - Method
    ------
    POST


- **api/v1/cargo**:
  Returns a list of medications loaded on a specified drone

  - Params
    ------
    - `droneSerialNumber`: Serial of number of drone to get loaded medicatioins e.g DRONE1

  - Method
    ------
    GET

- **api/v1/available**:
  Returns a list of available drones i.e drones in IDLE/LOADING state. Drones set in LOADING state by some other user can also be loaded by other users (Assumed design spec).

  - Params
    ------
    - `droneSerialNumber`: Serial of number of drone to get loaded medicatioins e.g DRONE1

  - Method
    ------
    GET

- **api/v1/battery**:
  Returns the current battery percentage of specified drone

  - Params
    ------
    - `droneSerialNumber`: Serial of number of drone to get loaded medicatioins e.g DRONE1

  - Method
    ------
    GET  

- **api/v1/dispatch**:
  Sets specified drone's status to `LOADED`. Drones in loaded state are picked up by background simulation worker and simulated to deliver medications and return with battery status dropping. Drones in IDLE state get battery charged back to 100%

  - Params
    ------
    - `droneSerialNumber`: Serial of number of drone to dispatch e.g DRONE1

  - Method
    ------
    POST

- **api/v1/medication/all**:
  Returns all medications in database

  - Params
    ------

  - Method
    ------
    GET  

- **api/v1/drone/logs**:
  Returns audit logs of drones. Audit logs are logs of drone status changes, drone battery changes and medicatioins carried on drones. Drones in `IDLE` or `LOADING` state are not logged to reduce unnecessary loggin. AuditLog background worker generates these logs

  - Params
    ------

  - Method
    ------
    GET

- **api/v1/register**:
  Registers a new drone in the fleet

  - Params
    ------
    - `name`: Name of medication (allowed only letters, numbers, ‘-‘, ‘_’) e.g Amoxicillin 
    - `weight`: Weight of medication. Note: medication cannot weigh more than 500
    - `code`: Medication code (allowed only upper case letters, underscore and numbers) e.g AMOXI_9
    - `image`: Image of medication. (Appropriate image handler not implemented so set please set `null`)

  - Method
    ------
    POST


## Improvements Needed
- Better error Handling at database wrapper

## PS
- Background workers run every 3 minutes for simulation and every 4 minutes for audit logs. 
- If logs do not show at the start, retry after some few minutes.
- Alternatively, modify `SIMULATION_INTERVAL` and `AUDIT_LOG_INTERVAL` in code to speed things up. 
- But also make sure `AUDIT_LOG_INTERVAL` is just a little slower than `SIMULATION_INTERVAL` as audit logs pickup after simulation chanages.