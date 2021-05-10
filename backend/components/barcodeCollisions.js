const { Lane } = require('./Lane');
const { Run } = require('./Run');
const { Sample } = require('./Sample');
const { Project } = require('./Project');
const { poolSameProject, poolSameRunLength, poolSameLibrary } = require('./PoolFunctions');
const { determineFlowCells } = require('./runPlanner');

/**
 * splits samples according to barcode collisions, allocates samples with unique barcodes to different lanes
 * @param  {Object} run  takes in Run object
 * @return {Object} returns object with run in runs array and remaining in remaining array
 */

function splitBarcodes(run) {
  const numLanes = run.getTotalLanes();
  const maxCapacity = run.getLaneCapacity()[1];
  const minCapacity = run.getLaneCapacity()[0];

  let ans = {};
  let remaining = [];
  let projects = run.projects;
  let samples = [];
  for (let project of projects) {
    for (let sample of project.samples) {
      samples.push(sample);
    }
  }
  let minLength = samples[0].barcodeSeq.length;
  for (let sample of samples) {
    if (minLength > sample.barcodeSeq.length) {
      minLength = sample.barcodeSeq.length;
    }
  }
  let recipeMap = {};
  for (let sample of samples) {
    recipeMap[sample.recipe] = [];
  }
  for (let sample of samples) {
    recipeMap[sample.recipe].push(sample);
  }

  let freq = {};

  for (let i = 0; i < samples.length; i++) {
    let fragment = samples[i].barcodeSeq.substring(0, minLength);
    if (fragment in freq) {
      if (freq[fragment] + 1 > numLanes) {
        remaining.push(samples[i]);
        break;
      }
    }
    if (fragment in freq) {
      freq[fragment] += 1;
    } else {
      freq[fragment] = 1;
    }
    if (freq[fragment] in ans) {
      ans[freq[fragment]].push(samples[i]);
    } else {
      ans[freq[fragment]] = [samples[i]];
    }
  }
  let res = { Runs: [], Remaining: [] };
  for (let samples of Object.values(ans)) {
    samples.sort((a, b) => b - a);
    let totalReads = maxCapacity;
    let requestId;
    for (let sample of samples) {
      totalReads -= sample.readsRequested;
    }
    if (totalReads < 0) {
      let excludedSample = samples.pop();
      remaining.push(excludedSample);
    }

    let lane = new Lane([], run.type);
    for (let sample of samples) {
      lane.addSample(sample);
    }

    run.lanes.push(lane);
  }

  // for(let lane of run.lanes) {
  //     console.log(lane);
  // }

  res['Runs'].push(run);
  res['Remaining'] = remaining;

  return res;
}

module.exports = {
  splitBarcodes,
};
