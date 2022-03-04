# [xyz] coding test / puzzle

This repo contains a solution to the [xyz] train puzzle / coding test - done in 2017. Implemented within ES6 JavaScript and glued together with Babel (for transpiling) and WebPack (for building the JS bundle and providing a development server).

## Overview

For a given directional graph, run 10 "tests" as per below:

* Test 1: Get Route Distance from A -> B -> C
* Test 2: Get Route Distance from A -> D
* Test 3: Get Route Distance from A -> D -> C
* Test 4: Get Route Distance from A -> E -> B -> C -> D
* Test 5: Get Route Distance from A -> E -> D
* Test 6: Find number of paths between D and C with a maximum of 3 stops
* Test 7: Find number of paths between A and C with exactly 4 stops
* Test 8: Find shortest path distance between A -> C
* Test 9: Find shortest path distance between B -> B
* Test 10: Find number of paths between C -> C with a maximum for 30 stops

### Digraph format:

The directional graph is represented as two letters and a number. The first letter represents node A, the second represents node B and the number reprsents the distance between the two nodes. For example:

AB3, BC4, BA10

```
[A]---3--→[B]----4----→[C]
 ↑         |
 |         |
 +----10---+
```

### Example Digraph and Results

You can find the sample graph data file within `test/input_graph.txt`. Its contents is:

```
AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
```

The output of the tests above for this digraph is:
```
Output #1: 9
Output #2: 5
Output #3: 13
Output #4: 22
Output #5: NO SUCH ROUTE
Output #6: 2
Output #7: 3
Output #8: 9
Output #9: 9
Output #10: 7
```


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

#### Evidence :)

Output from `npm run test` to show Mocha/Chai Unit Test execution.

```
MacPro:choochooooo bernie$ npm run coverage

> choochooooo@0.0.1 coverage /Users/bernie/Desktop/Work/choochooooo
> babel-node node_modules/.bin/babel-istanbul cover node_modules/.bin/_mocha -- test/*.js

  Digraph
    constructor
      ✓ returns an instance of the class
    data structure
      ✓ should have an empty adjacencyList when initially instantiated
      ✓ getNode() should return false for non-existant nodes
      ✓ should be able to add a single unlinked node with addNode() and retrieve it with getNode()
      ✓ should be able to only add node once
      ✓ should be able to only support uppercase letters within addNode() and addEdge()
      ✓ should be able to only support positive integer distances within addEdge()
      ✓ should be able to addEdge() to add a directed edge between existing nodes A->B with distance X
      ✓ should be able to add two nodes and an edge and use nodeHasEdge() to determine there is an edge
      ✓ should be able to addEdge() and for non-existing nodes and have them implicitly added
      ✓ should be able to addEdge() multiple times and use getAllNodes() to get the adjacencyList
      ✓ should not add multiple edges between the same origin and destination

  Utils
    #getRouteDistance()
      ✓ should return a zero (0) distance if called with no nodes
      ✓ should return a zero (0) distance if called with only one node
      ✓ should be able to calculate distance between 2 or more nodes
      ✓ should throw an exception when calculating distances between invalid (non-existent) nodes
      ✓ should throw an exception when calculating distances between nodes where no path exists
    #findAllPaths()
      ✓ should correctly find all paths with a maximum stops value
      ✓ should correctly find all paths with an exact stops value
      ✓ should return an empty path if no path with exact stops can be found
      ✓ should throw exception if either of the nodes are invalid
      ✓ should correctly find all paths with a total distance smaller than a particular value
      ✓ should return an empty path if no path can be found with total distance smaller than a particular value
    #findShortestPath()
      ✓ should correctly return object with both shortest path and corresponding distance
      ✓ should return false if not path is found
      ✓ should throw exception if either of the nodes are invalid
    #findShortestPathDistance()
      ✓ should correctly return shortest path distance
      ✓ should return false if not path is found
      ✓ should throw exception if either of the nodes are invalid
    #parseGraphData()
      ✓ should correctly convert a raw string with valid graph data into node components
      ✓ should correctly convert a raw string with MIXED valid/invalid graph data and whitespace into node components


  31 passing (20ms)

```

### Test with Istanbul code coverage

`npm run coverage`


