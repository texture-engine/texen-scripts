module txScripts {
    'use strict';

    export class Options {
        width:number;
        height:number;
        scale:number;
        sub:number;
        block:number;
        iteration:number;
        record:boolean;
        recordVector:boolean;
        progress:number;

        type:string;
        side:number;
        id:number;
        confirm:boolean;

        constructor(width:number = 128,
                    height:number = 128,
                    scale:number = 1,
                    sub:number = 0,
                    block:number = 0,
                    iteration:number = 0,
                    record:boolean = false,
                    recordVector:boolean = false) {
            this.width = width;
            this.height = height;
            this.scale = scale;
            this.sub = sub;
            this.block = block;
            this.iteration = iteration;
            this.record = record;
            this.recordVector = recordVector;
        }
    }
}
