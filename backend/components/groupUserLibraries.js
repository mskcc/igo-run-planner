/**
 * groupUserLibraries groups user libraries according to project (requestId) and puts them in runs/lanes
 * @param  {Array} projects array of project objects 
 * @return {Array} returns array of run objects
 */

const { Run } = require("./Run");

function groupUserLibraries(projects) {
    let res = {"Runs": [], "Remaining": []}
    let remaining = []
    let capacities = {'SP':[700,800], 'S1': [1600, 1800], 'S2': [3600, 3800], 'S4': [9000, 10000]}
}
    for(let project of projects) {
      if(project.isUserLibrary) {
          
      if(project.totalReads <= capacities['SP'][0]) {
        let run = new Run('SP', project.runLength);
        run.totalReads += project.totalReads;
        run.projects.push(project);
        res['Runs'].push(run);
        
      }
      else if (project.totalReads >= capacities['S1'][0] && project.totalReads <= capacities['S1'][1]) {
        let run = new Run('S1', project.runLength);
        run.totalReads += project.totalReads;
        run.projects.push(project);
        res['Runs'].push(run);
        
      } else if (project.totalReads >= capacities['S2'][0] && project.totalReads <= capacities['S2'][1]) {
        let run = new Run('S2', project.runLength);
        run.totalReads += project.totalReads;
        run.projects.push(project);
        res['Runs'].push(run);
        
      } else if (project.totalReads >= capacities['S4'][0] && project.totalReads <= capacities['S4'][1]) {
        let run = new Run('S4', project.runLength);
        run.totalReads += project.totalReads;
        run.projects.push(project);
        res['Runs'].push(run);
        
      }
      } else {
        res["Remaining"].push(project);
      }
    return res;
    }

module.exports = {
    groupUserLibraries 
}