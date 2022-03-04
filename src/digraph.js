"use strict";

class Digraph {

    constructor() {
        this.adjacencyList = {};
    }

    getAllNodes() {
        return this.adjacencyList;
    }

    /**
     * Add a new Node to the graph. The node will be unconnected
     * and contain zero edges.
     *
     * @param {string} id - single-letter identifier for this node
     * @return {Object|bool} the new node's (empty) adjacency list. False if not successful
     */
    addNode(id) {
        if (!this.validateNodeId(id)) {
            return false;
        }

        let existingNode = this.getNode(id);
        if (!existingNode) {
            this.adjacencyList[id] = [];
            existingNode = this.adjacencyList[id];
        }

        return existingNode;
    }

    /**
     * Remove an existing node from the graph.
     *
     * @todo Out of scope for now :) Not required for the challenge.
     * @return {bool}
     */
    // removeNode(id) {
    //     return false;
    // }

    /**
     * Given a particular origin node, check whether there
     * are any edges within that node's adjacency list that
     * link to a particular destination.
     *
     * @param {Object} originNode - the origin node / adjacency list
     * @param {string} destId - the destination node ID
     * @return {bool}
     */
    nodeHasEdge(originNode, destId) {
        const edge = originNode.find(edge => edge.destination === destId);

        return (edge !== undefined);
    }

    /**
     * Add a new directed edge between two nodes along with a
     * distance (or "weight"). If either of the two nodes do not exist within
     * the graph already they're implicitly created and automatically linked.
     *
     * @param {string} originId - single-letter node identifier for the origin
     * @param {string} destId - single-letter node identifier for the destination
     * @param {int} distance - distance (weight) between origin and destination
     * @return {Object|bool} the updated adjacency list for the `origin` node or false if failed
     */
    addEdge(originId, destId, distance) {
        if (!this.validateDistance(distance)) {
            return false;
        }

        const originNode = this.addNode(originId);
        const destinationNode = this.addNode(destId);
        if (!originNode || !destinationNode) {
            return false;
        }

        // check whether there's not already an edge between
        // the origin and destination nodes. If so, we gotta
        // skip. This little project doesn't support multiple
        // edges between the same origin and destination, even though
        // it's completely possible in digraphs. I just don't have
        // the time ;)
        if (!this.nodeHasEdge(originNode, destId)) {
            this.adjacencyList[originId].push({
                destination: destId,
                distance: parseInt(distance, 10)
            });
        }

        return this.adjacencyList[originId];
    }

    /**
     * Remove an existing directed edge between two nodes from the graph.
     *
     * @todo Out of scope for now :) Not required for the challenge.
     * @return {bool}
     */
    // removeEdge(originId, destinationId) {
    //     return false;
    // }

    /**
     * Validate a node ID and ensure it is a single letter, uppercase alpha character
     *
     * @param {string} id - Node ID to validate
     * @return {bool}
     */
    validateNodeId(id) {
        return (id.length === 1 && id.match(/[A-Z]/i));
    }

    /**
     * Validate a distance (or weight) value and ensure it is an integer
     * greater than zero.
     *
     * @param {int} distance - value to validate
     * @return {bool}
     */
    validateDistance(distance) {
        return (/^\+?(0|[1-9]\d*)$/.test(distance));
    }

    /**
     * Attempt to retrieve a particular node and its adjacency list
     * as an array of objects. Returns false if no such node is found.
     *
     * @param {string} id - single-letter identifier for the node
     * @return {Array|bool}
     */
    getNode(id) {
        return this.adjacencyList[id] || false;
    }

    /**
     * Count the number of nodes, regardless of whether they're connected
     * or not.
     *
     * @return {int}
     */
    getNumNodes() {
        return Object.keys(this.adjacencyList).length;
    }
}

module.exports = Digraph;