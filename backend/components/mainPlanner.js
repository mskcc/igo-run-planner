const { determineFlowCells } = require('./runPlanner');
const { splitBarcodes }  = require('./barcodeCollisions');
// const { groupUserLibraries } = require('./groupUserLibraries');
const { poolSameProject, poolSameRunLength, poolSameLibrary } = require('./PoolFunctions')

const fs = require('fs');

let raw = fs.readFileSync('./samples.json');
let data  = JSON.parse(raw);


function mainRunPlanner(samples) {
    let result = {"Runs": [], "Lanes": [], "Remaining" : []};
    // let userLibraries = groupUserLibraries(poolSameProject(samples));
    // console.log(userLibraries);
    let runLengthMap = poolSameRunLength(poolSameProject(samples));
    let flowcells;
    let processedRunsByBarcodes = [];
    for(let [runLength, projects] of Object.entries(runLengthMap)) {
        flowcells = determineFlowCells(projects, runLength)['Runs'];
        let remainingProjects = determineFlowCells(projects, runLength)["Remaining"];
        result["Remaining"].push(remainingProjects); // don't fit in run
        for(let run of flowcells) {
            processedRunsByBarcodes.push(splitBarcodes(run));
        }
       
    }
    for(let pool of processedRunsByBarcodes) {
        for(let run of pool['Runs']) {
            result['Runs'].push(run);
        }
    }
    return result;


}

console.log("main", mainRunPlanner(data));


