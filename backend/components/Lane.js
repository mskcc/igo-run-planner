const ID = require('./uniqueId');

class Lane {
    constructor(samples=[], type, project) {
        // this.id = ID(); // identify each lane by a unique id
        this.totalLaneReads = 0; // current number of reads in lane
        this.samples = samples; // array of samples to be loaded on a lane
        this.type = type; //this.readCapacity[type] to find range of read capacity, type of flowcell
        this.readCapacity = {"SP": [350, 400], "S1": [800,900], "S2": [1800, 1900], "S4": [2400, 2600]}; // ranges for each type of flowcell
        this.filled = false; //whether total number of reads has reached minimum capacity
        this.capacity = this.readCapacity[this.type];
    }
    
    addSample (sample) {
        if(this.readCapacity[this.type][1] - this.totalLaneReads >= sample.readsRequested) { // if lane's read capacity hasn't exceeded, add sample to array
            this.samples.push(sample); 
            this.totalLaneReads += sample.readsRequested; // add sample's reads to total reads on lane
        } else if(this.totalLaneReads == this.readCapacity[this.type][1]) {
                this.filled = true;
        }
        

    }

    getCapacity() {
        return this.readCapacity[this.type];
    }

    
}


module.exports = {
    Lane
}
