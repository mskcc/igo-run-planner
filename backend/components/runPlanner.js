const { combinationSum } = require('./comboSum.js');
const { Run } = require('./Run');
const { Project } = require('./Project');
const { Sample } = require('./Sample');

/**
 * find all flowcells that the projects can fit in, and return runs and projects that don't fit
 * @param  {Array} projects  input array of projects
 * @param  {String} runLength input run length of projects
 * @return {Object}  return object with runs array in runs, remaining array in remaining
 */

// pseudocode:
// 1. using combination sum function, find the optimal combination(greatest reads that fit within a flowcell capacity)
// 2. call combination sum on all 4 run types, from largest to smallest.
// 3. if there are combinations in any run, assign the projects to a run
// 4. Remove projects that have already been accounted for from the original array using removeItems function.
// 5. Call combination sum on remaining projects in array
// 6. If there are no combinations left, end while loop.
// 7. Return result with runs in runs array and remaining projects go in leftover array.

let removeItems = function (arr, indexes) {
  //arr is entire array, indexes is array of projects that have been assigned runs already
  let j = 0;
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (j < indexes.length && i == indexes[j]) {
      j++;
    } else {
      result.push(arr[i]); // return array with non-accounted for projects
    }
  }
  return result;
};

function determineFlowCells(projects, runLength) {
  let result = { Runs: [], Lanes: [], Remaining: [] }; // result
  const runs = { SP: [800, 100], S1: [1800, 200], S2: [3800, 200], S4: [10000, 1000] }; //max capacity, range (max- min capacity of flow cell)
  let priority = ['S4', 'S2', 'S1', 'SP'];
  priority.forEach((p) => {
    let target = runs[p][0];
    let range = runs[p][1];
    let allocations = combinationSum(projects, target, range); //find optimal combination that fit within run capacity
    // returns the indices and not the value
    while (allocations.length > 0) {
      let runObj = new Run(p, runLength);
      runObj.projects = allocations.map((index) => projects[index]); // assign run's projects attribute to projects that add up to run capacity
      result['Runs'].push(runObj); // push the run
      projects = removeItems(projects, allocations); // remove accounted for projects from projects array
      allocations = combinationSum(projects, target, range); //call combination sum on remaining projects
    }
  });
  result['Remaining'] = projects;
  for (let run of result['Runs']) {
    run.addTotalReads();
  }
  //if there are no further combinations left for any flowcell, return remaining projects in array in "remaining" array

  result['Remaining'] = projects;
  return result;
}

module.exports = {
  determineFlowCells,
};
