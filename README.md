# HONG KONG BINANCE SAFU PRE-HACKATHON - Team A ZAFU

ZAFU is an blockchain address query system using Zero-knowledge proof.

## Folder Structure

### 1. A PoC of Zero-knowledge application in address query

Please refer to `pbc_db.py` under `server` folder

### 2. `query-system`

It contains the UI of the address query system and a docker compose file of Mongo DB.

#### a. MongoDB

Run `docker-compose up`

#### b. UI

Run `yarn` then `yarn start`


### 3. `server`

Proxy server between UI and the Zero-knowledge PoC

