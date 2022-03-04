import Digraph from './digraph';
import DigraphUtils from './utils';

module.exports = {

    /**
     * Given an array of edge objects, create a new digraph and add each
     * edge to the graph, whilst also implicitly creating any nodes
     * required.
     *
     * @param {Array} nodes
     * @return {Digraph}
     */
    initDigraphFromEdges: function(nodes) {
        // add each node to a new digraph
        let digraph = new Digraph();
        nodes.map(graphNode => digraph.addEdge(
            graphNode.origin,
            graphNode.destination,
            graphNode.distance
        ));

        return digraph;
    },

    /**
     * Given an array of edge objects, return a string representation of them.
     *
     * @param {Array} nodes
     * @return {string}
     */
    getEdgesAsString: function(nodes) {
        return nodes.map(n => n.raw).join(', ')
    },

    /**
     * Helper function for 'test'... Offers easy access to each required
     * output as well as some helper functions that handle exceptions/errors.
     *
     * @param  {Digraph} digraph
     * @return {Object}
     */
    getOutputs: function(digraph) {
        return {
            getSafeOutput: function(f, errorMsg) {
                try {
                    return f();
                } catch (e) {
                    if (errorMsg === undefined) {
                        return 'N/A';
                    } else {
                        return errorMsg;
                    }
                }
            },
            getOutput1: function() {
                return this.getSafeOutput(() =>
                    DigraphUtils.getRouteDistance(digraph, 'A', 'B', 'C'),
                    'NO SUCH ROUTE'
                );
            },
            getOutput2: function() {
                return this.getSafeOutput(() =>
                    DigraphUtils.getRouteDistance(digraph, 'A', 'D'),
                    'NO SUCH ROUTE'
                );
            },
            getOutput3: function() {
                return this.getSafeOutput(() =>
                    DigraphUtils.getRouteDistance(digraph, 'A', 'D', 'C'),
                    'NO SUCH ROUTE'
                );
            },
            getOutput4: function() {
                return this.getSafeOutput(() =>
                    DigraphUtils.getRouteDistance(digraph, 'A', 'E', 'B', 'C', 'D'),
                    'NO SUCH ROUTE'
                );
            },
            getOutput5: function() {
                return this.getSafeOutput(() =>
                    DigraphUtils.getRouteDistance(digraph, 'A', 'E', 'D'),
                    'NO SUCH ROUTE'
                );
            },
            getOutput6: function() {
                return this.getSafeOutput(() => {
                    let output = DigraphUtils.findAllPaths(digraph, 'D', 'C').withMaximumStops(3);
                    return output.length;
                });
            },
            getOutput7: function() {
                return this.getSafeOutput(() => {
                    let output = DigraphUtils.findAllPaths(digraph, 'A', 'C').withExactStops(4);
                    return output.length;
                });
            },
            getOutput8: function() {
                return this.getSafeOutput(() => {
                    return DigraphUtils.findShortestPathDistance(digraph, 'A', 'C');
                });
            },
            getOutput9: function() {
                return this.getSafeOutput(() => {
                    return DigraphUtils.findShortestPathDistance(digraph, 'B', 'B');
                });
            },
            getOutput10: function() {
                return this.getSafeOutput(() => {
                    let output = DigraphUtils.findAllPaths(digraph, 'C', 'C').withMaximumDistance(30);
                    return output.length;
                });
            }
        }
    }

}
