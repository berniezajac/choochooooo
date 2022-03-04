let assert = require('assert');
let expect = require('chai').expect;
let path = require('path');

let Digraph = require(path.join(__dirname, '../src/', 'digraph'));
let Utils = require(path.join(__dirname, '../src/', 'utils'));


describe('Utils', () => {
    let digraph;
    let digraph2

    beforeEach(() => {
        digraph = new Digraph();
        digraph.addEdge('A', 'B', 5);
        digraph.addEdge('A', 'D', 5);
        digraph.addEdge('A', 'E', 7);
        digraph.addEdge('B', 'C', 4);
        digraph.addEdge('C', 'D', '8');
        digraph.addEdge('C', 'E', '2');
        digraph.addEdge('D', 'C', 8);
        digraph.addEdge('D', 'E', 6);
        digraph.addEdge('E', 'B', 3);

        digraph2 = new Digraph();
        digraph2.addEdge('A', 'B', 1);
        digraph2.addEdge('A', 'C', 2);
        digraph2.addEdge('A', 'D', 3);
        digraph2.addEdge('B', 'E', 1);
        digraph2.addEdge('B', 'F', 2);
        digraph2.addEdge('C', 'E', 3);
        digraph2.addEdge('C', 'F', 4);
        digraph2.addEdge('D', 'E', 5);
        digraph2.addEdge('D', 'F', 6);
        digraph2.addEdge('E', 'G', 2);
        digraph2.addEdge('F', 'G', 3);
    });

    describe('#getRouteDistance()', () => {

        it('should return a zero (0) distance if called with no nodes', () => {
            let routeDistance = Utils.getRouteDistance(digraph);
            expect(routeDistance).to.equal(0);
        });

        it('should return a zero (0) distance if called with only one node', () => {
            let routeDistance = Utils.getRouteDistance(digraph, 'A');
            expect(routeDistance).to.equal(0);
        });

        it('should be able to calculate distance between 2 or more nodes', () => {
            let routeDistance = 0;

            // Output #1 in expected output
            routeDistance = Utils.getRouteDistance(digraph, 'A', 'B', 'C');
            expect(routeDistance).to.equal(9);

            // Output #2 in expected output
            routeDistance = Utils.getRouteDistance(digraph, 'A', 'D');
            expect(routeDistance).to.equal(5);

            // Output #3 in expected output
            routeDistance = Utils.getRouteDistance(digraph, 'A', 'D', 'C');
            expect(routeDistance).to.equal(13);

            // Output #4 in expected output
            routeDistance = Utils.getRouteDistance(digraph, 'A', 'E', 'B', 'C', 'D');
            expect(routeDistance).to.equal(22);

            // let's try something a bit different
            routeDistance = Utils.getRouteDistance(digraph, 'A', 'E', 'B', 'C', 'D', 'E', 'B', 'C', 'E');
            expect(routeDistance).to.equal(37);

            routeDistance = Utils.getRouteDistance(digraph2, 'A', 'B', 'F', 'G');
            expect(routeDistance).to.equal(6);
        });


        it('should throw an exception when calculating distances between invalid (non-existent) nodes', () => {
            expect(() => {
                Utils.getRouteDistance(digraph, 'Q');
            }).to.throw(Error, 'Node ID Q does not exist');

            expect(() => {
                Utils.getRouteDistance(digraph, 'A', 'J');
            }).to.throw(Error, 'Node ID J does not exist');

            expect(() => {
                Utils.getRouteDistance(digraph, 'A', 'B', 'J');
            }).to.throw(Error, 'Node ID J does not exist');

            expect(() => {
                Utils.getRouteDistance(digraph, 'K', 'Z');
            }).to.throw(Error, 'Node ID K does not exist');
        });

        it('should throw an exception when calculating distances between nodes where no path exists', () => {
            // Output #5 in expected output
            expect(() => {
                Utils.getRouteDistance(digraph, 'A', 'E', 'D');
            }).to.throw(Error, 'No route between Node IDs E and D');

            expect(() => {
                Utils.getRouteDistance(digraph, 'A', 'C');
            }).to.throw(Error, 'No route between Node IDs A and C');

            expect(() => {
                Utils.getRouteDistance(digraph, 'A', 'B', 'C', 'A');
            }).to.throw(Error, 'No route between Node IDs C and A');
        });

    });

    describe('#findAllPaths()', () => {
        it('should correctly find all paths with a maximum stops value', () => {
            let allPathsWithMaximumNumberOfStops;

            // Output #6 in expected output
            allPathsWithMaximumNumberOfStops = Utils.findAllPaths(digraph, 'D', 'C').withMaximumStops(3);
            expect(allPathsWithMaximumNumberOfStops.length).to.equal(2);
            expect(allPathsWithMaximumNumberOfStops).to.deep.include([ 'D', 'C' ]);
            expect(allPathsWithMaximumNumberOfStops).to.deep.include([ 'D', 'E', 'B', 'C' ]);

            allPathsWithMaximumNumberOfStops = Utils.findAllPaths(digraph2, 'A', 'G').withMaximumStops(3);
            expect(allPathsWithMaximumNumberOfStops.length).to.equal(6);

        });

        it('should correctly find all paths with an exact stops value', () => {
            let allPathsWithExactNumberOfStops;

            // Output #7 in expected output
            allPathsWithExactNumberOfStops = Utils.findAllPaths(digraph, 'A', 'C').withExactStops(4);
            expect(allPathsWithExactNumberOfStops.length).to.equal(3);
            expect(allPathsWithExactNumberOfStops).to.deep.include([ 'A', 'B', 'C', 'D', 'C' ]);
            expect(allPathsWithExactNumberOfStops).to.deep.include([ 'A', 'D', 'C', 'D', 'C' ]);
            expect(allPathsWithExactNumberOfStops).to.deep.include([ 'A', 'D', 'E', 'B', 'C' ]);

            allPathsWithExactNumberOfStops = Utils.findAllPaths(digraph2, 'A', 'F').withExactStops(2);
            expect(allPathsWithExactNumberOfStops.length).to.equal(3);
            expect(allPathsWithExactNumberOfStops).to.deep.include([ 'A', 'B', 'F' ]);
            expect(allPathsWithExactNumberOfStops).to.deep.include([ 'A', 'C', 'F' ]);
            expect(allPathsWithExactNumberOfStops).to.deep.include([ 'A', 'D', 'F' ]);
        });

        it('should return an empty path if no path with exact stops can be found', () => {
            let allPathsWithExactNumberOfStops;

            allPathsWithExactNumberOfStops = Utils.findAllPaths(digraph2, 'A', 'G').withExactStops(2);
            expect(allPathsWithExactNumberOfStops.length).to.equal(0);
        });

        it('should throw exception if either of the nodes are invalid', () => {
            expect(() => {
                Utils.findAllPaths(digraph2, 'A', 'Y').withExactStops(4);
            }).to.throw(Error, 'Node ID Y does not exist');
        });

        it('should correctly find all paths with a total distance smaller than a particular value', () => {
            let allPathsWithinDistance;

            // Output #10 in expected output
            allPathsWithinDistance = Utils.findAllPaths(digraph, 'C', 'C').withMaximumDistance(30);
            expect(allPathsWithinDistance.length).to.equal(7);
            expect(allPathsWithinDistance).to.deep.include(['C', 'D', 'C']);
            expect(allPathsWithinDistance).to.deep.include(['C', 'E', 'B', 'C']);
            expect(allPathsWithinDistance).to.deep.include(['C', 'E', 'B', 'C', 'D', 'C']);
            expect(allPathsWithinDistance).to.deep.include(['C', 'D', 'C', 'E', 'B', 'C']);
            expect(allPathsWithinDistance).to.deep.include(['C', 'D', 'E', 'B', 'C']);
            expect(allPathsWithinDistance).to.deep.include(['C', 'E', 'B', 'C', 'E', 'B', 'C']);
            expect(allPathsWithinDistance).to.deep.include(['C', 'E', 'B', 'C', 'E', 'B', 'C', 'E', 'B', 'C']);

            allPathsWithinDistance = Utils.findAllPaths(digraph, 'A', 'D').withMaximumDistance(35);
            expect(allPathsWithinDistance.length).to.equal(9);
            expect(allPathsWithinDistance).to.deep.include(['A', 'D']); // 5
            expect(allPathsWithinDistance).to.deep.include(['A', 'B', 'C', 'D']); // 17
            expect(allPathsWithinDistance).to.deep.include(['A', 'D', 'C', 'D']); // 21
            expect(allPathsWithinDistance).to.deep.include(['A', 'E', 'B', 'C', 'D']); // 22
            expect(allPathsWithinDistance).to.deep.include(['A', 'D', 'E', 'B', 'C', 'D']); // 26
            expect(allPathsWithinDistance).to.deep.include(['A', 'B', 'C', 'E', 'B', 'C', 'D']); // 26
            expect(allPathsWithinDistance).to.deep.include(['A', 'D', 'C', 'E', 'B', 'C', 'D']); // 30
            expect(allPathsWithinDistance).to.deep.include(['A', 'E', 'B', 'C', 'E', 'B', 'C', 'D']); // 31
            expect(allPathsWithinDistance).to.deep.include(['A', 'B', 'C', 'D', 'C', 'D']); // 33

            allPathsWithinDistance = Utils.findAllPaths(digraph, 'A', 'D').withMaximumDistance(30);
            expect(allPathsWithinDistance.length).to.equal(6);
            expect(allPathsWithinDistance).to.deep.include(['A', 'D']); // 5
            expect(allPathsWithinDistance).to.deep.include(['A', 'B', 'C', 'D']); // 17
            expect(allPathsWithinDistance).to.deep.include(['A', 'D', 'C', 'D']); // 21
            expect(allPathsWithinDistance).to.deep.include(['A', 'E', 'B', 'C', 'D']); // 22
            expect(allPathsWithinDistance).to.deep.include(['A', 'D', 'E', 'B', 'C', 'D']); // 26
            expect(allPathsWithinDistance).to.deep.include(['A', 'B', 'C', 'E', 'B', 'C', 'D']); // 26
            expect(allPathsWithinDistance).to.not.deep.include(['A', 'D', 'C', 'E', 'B', 'C', 'D']); // 30
            expect(allPathsWithinDistance).to.not.deep.include(['A', 'E', 'B', 'C', 'E', 'B', 'C', 'D']); // 31
            expect(allPathsWithinDistance).to.not.deep.include(['A', 'B', 'C', 'D', 'C', 'D']); // 33
        });

        it('should return an empty path if no path can be found with total distance smaller than a particular value', () => {
            let allPathsWithinDistance;

            allPathsWithinDistance = Utils.findAllPaths(digraph, 'A', 'D').withMaximumDistance(4);
            expect(allPathsWithinDistance.length).to.equal(0);

            allPathsWithinDistance = Utils.findAllPaths(digraph2, 'A', 'G').withMaximumDistance(2);
            expect(allPathsWithinDistance.length).to.equal(0);
        });
    });

    describe('#findShortestPath()', () => {
        it('should correctly return object with both shortest path and corresponding distance', () => {
            let shortestPathObj;

            shortestPathObj = Utils.findShortestPath(digraph, 'A', 'C');
            expect(shortestPathObj.path).to.deep.equal([ 'A', 'B', 'C' ]);
            expect(shortestPathObj.distance).to.equal(9);

            shortestPathObj = Utils.findShortestPath(digraph, 'B', 'B');
            expect(shortestPathObj.path).to.deep.equal([ 'B', 'C', 'E', 'B' ]);
            expect(shortestPathObj.distance).to.equal(9);
        });

        it('should return false if not path is found', () => {
            let shortestPathObj;

            shortestPathObj = Utils.findShortestPath(digraph, 'E', 'A');
            expect(shortestPathObj).to.be.false;
        });

        it('should throw exception if either of the nodes are invalid', () => {
            expect(() => {
                Utils.findShortestPath(digraph, 'A', 'Z');
            }).to.throw(Error, 'Node ID Z does not exist');
        });
    });

    describe('#findShortestPathDistance()', () => {
        it('should correctly return shortest path distance', () => {
            let shortestPathDistance

            //Output #8 in expected output
            shortestPathDistance = Utils.findShortestPathDistance(digraph, 'A', 'C');
            expect(shortestPathDistance).to.equal(9);

            // Output #9 in expected output
            shortestPathDistance = Utils.findShortestPathDistance(digraph, 'B', 'B');
            expect(shortestPathDistance).to.equal(9);

            // try something else just to be sure
            shortestPathDistance = Utils.findShortestPathDistance(digraph, 'E', 'D');
            expect(shortestPathDistance).to.equal(15);

            // no possible paths
            shortestPathDistance = Utils.findShortestPathDistance(digraph, 'C', 'A');
            expect(shortestPathDistance).to.be.false;

            shortestPathDistance = Utils.findShortestPathDistance(digraph, 'E', 'A');
            expect(shortestPathDistance).to.be.false;
        });

        it('should return false if not path is found', () => {
            let shortestPathDistance;

            shortestPathDistance = Utils.findShortestPathDistance(digraph, 'E', 'A');
            expect(shortestPathDistance).to.be.false;
        });

        it('should throw exception if either of the nodes are invalid', () => {
            expect(() => {
                Utils.findShortestPathDistance(digraph, 'H', 'I');
            }).to.throw(Error, 'Node ID H does not exist');
        });
    });

    describe('#parseGraphData()', () => {
        it('should correctly convert a raw string with valid graph data into node components', () => {
            let rawGraphData = 'AB1, AC2, BC3, CA4';

            let parsedGraphData = Utils.parseGraphData(rawGraphData);
            expect(parsedGraphData.length).to.equal(4);
            expect(parsedGraphData).to.deep.include({ raw: 'AB1', origin: 'A', destination: 'B', distance: '1' });
            expect(parsedGraphData).to.deep.include({ raw: 'AC2', origin: 'A', destination: 'C', distance: '2' });
            expect(parsedGraphData).to.deep.include({ raw: 'BC3', origin: 'B', destination: 'C', distance: '3' });
            expect(parsedGraphData).to.deep.include({ raw: 'CA4', origin: 'C', destination: 'A', distance: '4' });
        });

        it('should correctly convert a raw string with MIXED valid/invalid graph data and whitespace into node components', () => {
            let rawGraphData = 'AB1, AC2,    B3,CA4';

            let parsedGraphData = Utils.parseGraphData(rawGraphData);
            expect(parsedGraphData.length).to.equal(3);
            expect(parsedGraphData).to.deep.include({ raw: 'AB1', origin: 'A', destination: 'B', distance: '1' });
            expect(parsedGraphData).to.deep.include({ raw: 'AC2', origin: 'A', destination: 'C', distance: '2' });
            expect(parsedGraphData).to.deep.include({ raw: 'CA4', origin: 'C', destination: 'A', distance: '4' });
        });

    });
});

