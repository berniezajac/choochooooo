let assert = require('assert');
let expect = require('chai').expect;
let path = require('path');

let Digraph = require(path.join(__dirname, '../src/', 'digraph'));


describe('Digraph', () => {
    describe('constructor', () => {
        let digraph = new Digraph();
        it('returns an instance of the class', () => {
            expect(digraph).to.be.an.instanceof(Digraph);
        });
    });

    describe('data structure', () => {
        let digraph;

        beforeEach(() => {
            digraph = new Digraph();
        });

        it('should have an empty adjacencyList when initially instantiated', () => {
            expect(digraph.getNumNodes()).to.equal(0);
        });

        it('getNode() should return false for non-existant nodes', () => {
            let nonExistentNode = digraph.getNode('Z')
            expect(nonExistentNode).to.be.false;
        });

        it('should be able to add a single unlinked node with addNode() and retrieve it with getNode()', () => {
            digraph.addNode('A');
            let addedNode = digraph.getNode('A');

            expect(digraph.getNumNodes()).to.equal(1);
            expect(addedNode).to.be.instanceof(Array);
            expect(addedNode.length).to.equal(0);
        });

        it('should be able to only add node once', () => {
            digraph.addNode('A');
            let addedNode = digraph.getNode('A');
            let addedNode2 = digraph.getNode('A');

            expect(digraph.getNumNodes()).to.equal(1);
            expect(addedNode).to.be.instanceof(Array);
            expect(addedNode.length).to.equal(0);
        });

        it('should be able to only support uppercase letters within addNode() and addEdge()', () => {
            expect(digraph.addNode('1')).to.be.false;
            expect(digraph.addNode('Hello World')).to.be.false;
            expect(digraph.addEdge('A', '2', 10)).to.be.false;
        });

        it('should be able to only support positive integer distances within addEdge()', () => {
            expect(digraph.addEdge('A', 'Z', -10)).to.be.false;
            expect(digraph.addEdge('A', 'Z', '0.04')).to.be.false;
            expect(digraph.addEdge('A', 'Z', 'HAHAHAHA')).to.be.false;
        });

        it('should be able to addEdge() to add a directed edge between existing nodes A->B with distance X', () => {
            digraph.addNode('A');
            digraph.addNode('B');
            digraph.addEdge('A', 'B', 10);

            expect(digraph.getNumNodes()).to.equal(2);
            expect(digraph.adjacencyList).to.include.all.keys('A', 'B');
            expect(digraph.adjacencyList).to.deep.nested.include({'A[0]': {
                'destination': 'B',
                'distance': 10
            }});
            expect(digraph.adjacencyList).to.deep.nested.include({'B': []});
        });

        it('should be able to add two nodes and an edge and use nodeHasEdge() to determine there is an edge', () => {
            digraph.addNode('A');
            digraph.addNode('B');
            digraph.addEdge('A', 'B', 10);

            let originNode = digraph.getNode('A');
            let matchingEdge = digraph.nodeHasEdge(originNode, 'B');
            let unmatchedEdge = digraph.nodeHasEdge(originNode, 'C');

            expect(matchingEdge).to.be.true;
            expect(unmatchedEdge).to.be.false;
        });

        it('should be able to addEdge() and for non-existing nodes and have them implicitly added', () => {
            digraph.addEdge('A', 'B', 15);

            expect(digraph.getNumNodes()).to.equal(2);
            expect(digraph.adjacencyList).to.include.all.keys('A', 'B');
            expect(digraph.adjacencyList).to.deep.nested.include({'A[0]': {
                'destination': 'B',
                'distance': 15
            }});
            expect(digraph.adjacencyList).to.deep.nested.include({'B': []});
        });

        it('should be able to addEdge() multiple times and use getAllNodes() to get the adjacencyList', () => {
            digraph.addEdge('A', 'B', 5);
            digraph.addEdge('A', 'D', 5);
            digraph.addEdge('A', 'E', 7);
            digraph.addEdge('B', 'C', 4);
            digraph.addEdge('C', 'D', 8);
            digraph.addEdge('C', 'E', 2);
            digraph.addEdge('D', 'C', 8);
            digraph.addEdge('D', 'E', 6);
            digraph.addEdge('E', 'B', 3);

            let adjacencyList = digraph.getAllNodes();
            expect(digraph.getNumNodes()).to.equal(5);
            expect(adjacencyList).to.include.all.keys('A', 'B', 'C', 'D', 'E');
            expect(adjacencyList).to.deep.nested.include({'A[0]': {
                'destination': 'B',
                'distance': 5
            }});
            expect(adjacencyList).to.deep.nested.include({'A[1]': {
                'destination': 'D',
                'distance': 5
            }});
            expect(adjacencyList).to.deep.nested.include({'A[2]': {
                'destination': 'E',
                'distance': 7
            }});
            expect(adjacencyList).to.deep.nested.include({'B[0]': {
                'destination': 'C',
                'distance': 4
            }});
            expect(adjacencyList).to.deep.nested.include({'C[0]': {
                'destination': 'D',
                'distance': 8
            }});
            expect(adjacencyList).to.deep.nested.include({'C[1]': {
                'destination': 'E',
                'distance': 2
            }});
            expect(adjacencyList).to.deep.nested.include({'D[0]': {
                'destination': 'C',
                'distance': 8
            }});
            expect(adjacencyList).to.deep.nested.include({'D[1]': {
                'destination': 'E',
                'distance': 6
            }});
            expect(adjacencyList).to.deep.nested.include({'E[0]': {
                'destination': 'B',
                'distance': 3
            }});
        });

        it('should not add multiple edges between the same origin and destination', () => {
            digraph.addEdge('A', 'B', 15);
            digraph.addEdge('A', 'B', 15);

            expect(digraph.getNumNodes()).to.equal(2);

            let originNode = digraph.getNode('A');
            let matchingEdges = originNode.filter(edge => edge.destination === 'B');

            expect(matchingEdges.length).to.equal(1);
        });
    });

});

