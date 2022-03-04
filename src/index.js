import Digraph from './digraph';
import DigraphUtils from './utils';
import Output from './output';

let elGraphData = document.getElementById('graphdata');

// attach change event listener to the file selector input
// and use the FileReader HTML5 API to asynchronously read
// the contents of an uploaded file.
elGraphData.addEventListener('change', function(e) {
    if (e.target.files.length !== 1) {
        e.preventDefault();
        return;
    }

    // only support one file...
    var file = e.target.files[0];
    var reader = new FileReader();

    // once the reader is ready and the data is loaded,
    // parse the data within the file and initialise
    // a Digraph based on it. Once done, fire off each
    // of the ten test "outputs" and render them into the
    // textarea :)
    reader.onload = (function(graphdata) {
        return function(e) {
            //elGraphData.style.display = 'none';

            let outputText = '';
            let edges = DigraphUtils.parseGraphData(e.target.result);
            let digraph = Output.initDigraphFromEdges(edges);
            let outputMap = Output.getOutputs(digraph);

            console.log('Graph: ' + Output.getEdgesAsString(edges));
            outputText += 'Graph: ' + Output.getEdgesAsString(edges) + "\n\n";

            [...Array(10)].map((o,i) => {
                let outputIndex = i+1;
                let outputResult = outputMap['getOutput' + outputIndex]();

                console.log(`Output #${outputIndex}: ${outputResult}`);
                outputText += `Output #${outputIndex}: ${outputResult}` + "\n";
            });

            // update the textarea.
            document.getElementById('consoleOutput').value = outputText;
        };
    })(file);

    reader.readAsText(file);

}, false);

