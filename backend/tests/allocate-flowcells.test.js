const assert = require('assert');
const expect = require('chai').expect;

const { Sample } = require('../components/Sample');
const { Project } = require('../components/Project');
const { Lane } = require('../components/Lane');
const { Run } = require('../components/Run');
const { determineFlowCells } = require('../components/runPlanner');

describe('result of run planning algorithm', () => {
  let sample1 = new Sample(1, '', 'ACTAGC', '123', 'PE100', 200, 'ABC', 'ABC', 120, 'nM');
  let sample2 = new Sample(2, '', 'ACTAGC-GCTACD', '123', 'PE100', 400, 'ABC', 'ABC', 120, 'nM');
  let sample3 = new Sample(3, '', 'ACTAGT', '123', 'PE100', 200, 'ABC', 'ABC', 120, 'nM');
  let sample4 = new Sample(4, '', 'ACTAGT-ACTTCA', '123', 'PE100', 200, 'ABC', 'ABC', 120, 'nM');
  let sample5 = new Sample(5, 'Pool', 'ACTAGG', '123', 'PE100', 400, 'ABC', 'ABC', 120, 'nM');
  let sample6 = new Sample(6, 'Pool', 'ACTAGG', '123', 'PE100', 200, 'ABC', 'ABC', 120, 'nM');

  let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS');
  let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');
  let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction');
  let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');
  let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');

  project1.samples = [sample1, sample2, sample3];
  project2.samples = [sample4, sample5, sample6];
  project1.getProjectReads();
  project2.getProjectReads();

  let run = new Run('S1', 'PE100');
  run.addProject(project1);
  run.addProject(project2);
  run.addTotalReads();
  it('returns sp1 run', () => {
    expect(determineFlowCells([project1, project2], 'PE100')['Runs']).to.eql([run]);
  });
});
