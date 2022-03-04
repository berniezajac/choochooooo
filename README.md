# [xyz] coding test / puzzle

This repo contains a solution to the [xyz] train puzzle / coding test - done in 2017. Implemented within ES6 JavaScript and glued together with Babel (for transpiling) and WebPack (for building the JS bundle and providing a development server).

## How to get started

1. Install node and npm (tested with NodeJS v7.4.0 and Npm 4.0.5)
2. Clone this repo (or unzip the solution archive)
3. Install dependencies with: `npm install`
4. Spin up a WebPack dev server with `npm start`
5. Access at http://127.0.0.1:3000/
6. Use the file selector to pick the TXT file containing the graph
7. Once selected, the code will automatically parse and generate the required outputs. Look into your console to see the output.

## Commands

### Dev server

`npm start`

This'll build the bundle JS via WebPack and also spin up a WebPack dev server - this should be accessibly at http://127.0.0.1:3000/. Windows users (or others) may require to tweak IP binding and port within the `package.json` file - specifically the `dev` script item.

### Tests via Mocha & Chai

`npm run test`

There should be 31 passing tests ;)

### Test with Istanbul code coverage

`npm run coverage`


