"use strict";

import Digraph from './digraph';

module.exports = {

    /**
     * Calculate the sum of edge distances between two or more nodes
     * within the graph.
     *
     * @param {...string} nodeIds - a set of single-letter node identifiers
     * @throws {Error} If any of the nodes in the set do not exist or if a path
     *                 does not exist between a particular origin and destination node
     * @return {int}
     */
    getRouteDistance: function(digraph, ...nodeIds) {
        if (!nodeIds.length) {
            return 0;
        }

        let curNodeId = nodeIds.shift();
        let curNode = digraph.getNode(curNodeId);
        if (!curNode) {
            throw new Error(`Node ID ${curNodeId} does not exist`);
        }

        const distance = nodeIds.reduce(
            (curDistance, nextNodeId) => {
                let nextNode = digraph.getNode(nextNodeId);
                if (!nextNode) {
                    throw new Error(`Node ID ${nextNodeId} does not exist`);
                }

                // is there a route from cur -> next
                let edge = curNode.find(edge => edge.destination === nextNodeId);
                if (edge === undefined) {
                    throw new Error(`No route between Node IDs ${curNodeId} and ${nextNodeId}`);
                }

                // update curNode vars to the nextNode
                curNode = digraph.getNode(nextNodeId);
                curNodeId = nextNodeId;

                // update the accumulator with the new distance
                return curDistance + parseInt(edge.distance, 10);
            },
            0
        );

        return distance;
    },


    /**
     * Returns a object which exposes some custom methods which
     * controls how the path traversal algorithm works, specifically:
     *
     * - `withMaximumStops(stops)`: returns all paths from originId to
     * destId with a maximum of `stop` stops.
     *
     * - `withExactStops(stops)`: returns all paths from originId to
     * destId with exactly `stop` stops.
     *
     * - `withMaximumDistance(distance)`: returns all paths from originId
     * to destId that are within a specified route distance of `distance`
     *
     * Example usage:
     * <code>
     * Utils.findAllPaths(digraph, 'A', 'C').withExactStops(4)
     * </code>
     *
     * @param {Digraph} digraph - a populate Digraph object
     * @param {string} originId - single-letter identifier for the origin node
     * @param {string} destId - single-letter identifier for the destination node
     * @throws {Error} if either the origin or dest nodes are invalid
     * @return {Object} See function comments.
     */
    findAllPaths: function(digraph, originId, destId) {
        let pathsToTraverse = [];
        let visited = [];

        let originNode = digraph.getNode(originId);
        let destNode = digraph.getNode(destId);
        if (!originNode) {
            throw new Error(`Node ID ${originId} does not exist`);
        }
        if (!destNode) {
            throw new Error(`Node ID ${destId} does not exist`);
        }

        // expose a public API that contains two methods.
        return {
            withMaximumStops: (maxStops) => {
                return traverse(originId, destId, {
                    skipEdge: (edge, stopCounter, odometer) => {
                        return (stopCounter > maxStops);
                    },
                    matchingEdge: (edgeId, destId, stopCounter) => {
                        return true;
                    },
                    traverseVisitedNodes: false,
                    continueTraverseAfterMatch: false
                });
            },
            withMaximumDistance: (maxDistance, limit = 15) => {
                return traverse(originId, destId, {
                    skipEdge: (edge, stopCounter, odometer) => {
                        return (stopCounter > limit)
                            || (odometer >= maxDistance)
                            || (odometer + edge.distance >= maxDistance);
                    },
                    matchingEdge: (edgeId, destId, stopCounter, odometer) => {
                        return true;
                    },
                    traverseVisitedNodes: true,
                    continueTraverseAfterMatch: true
                });
            },
            withExactStops: (exactStops) => {
                return traverse(originId, destId, {
                    skipEdge: (edge, stopCounter, odometer) => {
                        return (stopCounter > exactStops);
                    },
                    matchingEdge: (edgeId, destId, stopCounter) => {
                        return (stopCounter === exactStops);
                    },
                    traverseVisitedNodes: true,
                    continueTraverseAfterMatch: false
                });
            }
        };

        // private function which handles the traversal logic
        // really wanted to move this into it's own little helper
        // as the function was getting a bit long, but ran outta time.
        function traverse(curId, destId, conditions = {}, paths = [], stopCounter = 1, odometer = 0) {
            pathsToTraverse.push(curId);
            visited[originId] = true;

            let node = digraph.getNode(curId);
            for (let edge of node) {
                let edgeId = edge.destination;

                // have we a condition where the traversal and search has
                // gone far enough and we simply need to skip this node edge?
                if (conditions.skipEdge(edge, stopCounter, odometer)) {
                    continue;
                }

                // have we identified a successful path routing whilst considering
                // the predicate condition within destinationMatchCondition? If so,
                // push the result onto the path and move along!
                if (edgeId === destId &&
                    conditions.matchingEdge(edgeId, destId, stopCounter)
                ) {
                    let result = pathsToTraverse.slice();
                    result.push(destId);
                    paths.push(result);

                    if (!conditions.continueTraverseAfterMatch) {
                        odometer = odometer + edge.distance;
                        continue;
                    }
                }

                // have we reached a point where we need to continue traversing down
                // this particular path? This depends on what the `traverseVisitedNodes`
                // value is of course... If so, call traverse recursively and
                // continue the party.
                if (conditions.traverseVisitedNodes || typeof visited[edgeId] === 'undefined') {
                    traverse(edgeId, destId, conditions, paths, stopCounter+1, odometer + edge.distance);
                }
            }
            pathsToTraverse.pop();

            return paths;
        }
    },

    /**
     * Find the shortest possible path between originId and destId. This is
     * essentially a wrapper around `findAllPaths()` - which is used to find all
     * possible paths and is then map/reduced to find the shortest overall.
     *
     * @uses findAllPaths() with a maximumStops value of 50 to prevent overflows
     * @param {Digraph} digraph - a populate Digraph object
     * @param {string} originId - single-letter identifier for the origin node
     * @param {string} destId - single-letter identifier for the destination node
     * @throws {Error} if either the origin or dest nodes are invalid
     * @return {Object|bool} object w/ path and corressponding distance or false if none found
     */
    findShortestPath: function(digraph, originId, destId) {
        let allPaths = this.findAllPaths(digraph, originId, destId).withMaximumStops(50);
        let self = this;

        if (!allPaths.length) {
            return false;
        }

        // go over all paths and map an object on to each path
        // which consists of the path itself and the distance.
        // then, reduce over the paths by comparing distances
        // essentially finding the shortest path.
        let shortestPath = allPaths.map((path, index) => {
            return {
                path: path,
                distance: self.getRouteDistance(digraph, ...path)
            };
        }).reduce((prev, curr) => {
            return (prev.distance < curr.distance) ? prev : curr;
        });

        return shortestPath;
    },

    /**
     * Find the shortest path distance. This is a wrapper around
     * `findShortestPath` and returns the distance itself rather
     * than the path as an array.
     *
     * @uses findShortestPath()
     * @param {Digraph} digraph - a populate Digraph object
     * @param {string} originId - single-letter identifier for the origin node
     * @param {string} destId - single-letter identifier for the destination node
     * @throws {Error} if either the origin or dest nodes are invalid
     * @return {int|bool} distance of the shortest path or false if none found
     */
    findShortestPathDistance: function(digraph, originId, destId) {
        const shortestPath = this.findShortestPath(digraph, originId, destId);
        if (shortestPath) {
            return shortestPath.distance;
        }

        return false;
    },

    /**
     * Given a raw string containing a graph representation,
     * attempt to parse it and return each of the node
     * components within an array.
     *
     * Example format:
     * `AB1, AC2, BC3, CA4`
     *
     * @param  {string} data - raw string containing the graph representation
     * @return {Array}
     */
    parseGraphData: function(data) {
        let graphNodes = data.split(/[ ,]+/);

        // parse each node component
        let parsedNodes = graphNodes.map(graphNode => this.parseNode(graphNode));

        // filter out any invalid components
        return parsedNodes.filter(graphNode => graphNode);
    },

    /**
     * Parse a node representation from a raw string.
     *
     * Nodes need to be represented as "AB5", where the first
     * letter is the origin, the second is the destination and
     * the numeric value following it representing the distance
     * of the edge between the two nodes
     *
     * @param {string} nodeStr - string to parse
     * @return {Object|bool} object for the node or false if failed validation
     */
    parseNode: function(nodeStr) {
        let parsedNode = (/^\+?([A-Z]{1})([A-Z]{1})([1-9]\d*)$/g).exec(nodeStr);
        if (!parsedNode || parsedNode.length !== 4) {
            return false;
        }

        return {
            raw: parsedNode[0],
            origin: parsedNode[1],
            destination: parsedNode[2],
            distance: parsedNode[3]
        }
    }

};