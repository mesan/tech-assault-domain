# TechAssault Domain Service (tech-assault-domain)

## Description

Service handling game logic and state for the TechAssault game.

## Contributors

- Jan Eirik H.
- Hans Kristian R.
- Christian J.
- Arild T.

## Requirements

* A running MongoDB instance.
* Environment variables set up:
    * TECH_DOMAIN_MONGOLAB_URI: The connection string pointing to your MongoDB instance (eg. `"mongodb://localhost:27017/techassault"`)
    * TECH_SSL_KEY: Path to SSL key.
    * TECH_SSL_CERT: Path to SSL certificate.
    * TECH_SSL_CA: Path to SSL CA certificate.

## Set Up

    npm install
    npm start