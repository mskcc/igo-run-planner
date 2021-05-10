const { Lane } = require("./Lane");
const { Run } = require("./Run");
const { Sample } = require("./Sample");
const { Project } = require('./Project')
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

    let ans = {}
    let remaining = [];
    let projects = run.projects;
    let samples = []
    for(let project of projects) {
        for(let sample of project.samples) {
            samples.push(sample);
        }
    }
    let minLength = samples[0].barcodeSeq.length;
    for(let sample of samples) {
        if(minLength > sample.barcodeSeq.length) {
            minLength = sample.barcodeSeq.length;
        }
    }
    let recipeMap = {}
    for(let sample of samples) {
        recipeMap[sample.recipe] = [];
    }
    for(let sample of samples) {
        recipeMap[sample.recipe].push(sample);
    }
    
    let freq = {}
    
    for(let i = 0; i < samples.length; i++) {
        
        let fragment = samples[i].barcodeSeq.substring(0, minLength);

        
        if(fragment in freq) {
            if (freq[fragment] + 1 > numLanes) {
                remaining.push(samples[i]);
                break;
            }
        }
        if(fragment in freq ) {
            freq[fragment] += 1;
        } else {
            freq[fragment] = 1;
        }
        
        
        if(freq[fragment]in ans) {
            ans[freq[fragment]].push(samples[i])
         } else {
            ans[freq[fragment]] = [samples[i]];
        }
    }

    let res = {"Runs": [], "Remaining": []}
    for (let samples of Object.values(ans)) {
        samples.sort((a,b)=> b-a); 
        let totalReads = maxCapacity;
        let requestId;
        for(let sample of samples) {
            totalReads -= sample.readsRequested;
            
        }
        if(totalReads < 0) {
            let excludedSample = samples.pop()
            remaining.push(excludedSample);  
        }
        

        let lane = new Lane([], run.type);
        for(let sample of samples) {
                lane.addSample(sample);
        }
        
        run.lanes.push(lane);
        
    }

    // for(let lane of run.lanes) {
    //     console.log(lane);
    // }

    res["Runs"].push(run);
    res["Remaining"] = remaining;

    return res;
}



module.exports = {
    splitBarcodes
}

// let sample1 = new Sample(1, "", "ACTAGC", "123", "PE150", 200, "ABC", "ABC", 120, "nM");
// let sample2 = new Sample(2, "", "ACTAGC-GCTACD", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
// let sample3 = new Sample(3, "", "ACTAGT", "123", "PE150", 150, "ABC", "ABC", 120, "nM")
// let sample4 = new Sample(4, "", "ACTAGT-ACTTCA", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
// let sample5 = new Sample(5, "Pool", "ACTAGG", "123", "PE150", 75, "ABC", "ABC", 120, "nM")
// let sample6 = new Sample(6, "Pool", "ACTAGG", "123", "PE150", 200, "ABC", "ABC", 120, "nM");

// let project1 = new Project('09838', 'PE100', [sample1, sample2, sample3], 'ShallowWGS', 'sWGS', 1000);
// let project2 = new Project('09931', 'PE100', [sample4, sample5, sample6], 'WholeGenomeSequencing', 'WholeGenome', 400);
// let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction', 800);
// let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 450);
// let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
// let projectArray = [project1, project2, project3, project4, project5];


// let run1 = new Run("SP", "PE150", projectArray);
// console.log(splitBarcodes(run1));
