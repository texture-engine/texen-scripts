module txScripts {
    'use strict';

    export class Histogram extends Array {
        [index:number]:number[];
        length:number;

        constructor() {
            super();
            this.push(Histogram.init());
            this.push(Histogram.init());
            this.push(Histogram.init());
        }

        private static init() {
            var i:number;
            var x:number[] = new Array(256);

            for (i = 0; i < 256; i++) {
                x[i] = 0;
            }

            return x;
        }

    }
}
