module txScripts {
    'use strict';

    var TEXTURE_TYPE = 'Texture';
    var BOX_TYPE = 'Box';
    var SPHERE_TYPE = 'Sphere';

    var PROP_BASE = 'source';
    var PROP_BUMP = 'bump';
    var PROP_NORM = 'normal';
    var PROP_SPEC = 'specular';

    var PROP_ORDER = [PROP_BASE, PROP_BUMP, PROP_NORM, PROP_SPEC];

    var BLOCK_ITERATIONS = 4;
    var BOX_SIDES = 6;
    var CONFIRM_LIMIT = 4;

    export class Job {
        renderKey:string;
        renderObj:any;
        renderType:any;
        isWebGL:boolean;
        parts:Options[];

        constructor(formula:any, block:number, fullSize:number, smallSize:number) {
            this.renderKey = Object.keys(formula.render)[0];
            this.renderObj = formula.render[this.renderKey];
            this.renderType = this.renderObj.type;

            this.isWebGL = !!((this.renderType !== TEXTURE_TYPE) ||
            ((this.renderType === TEXTURE_TYPE) &&
            (this.renderObj[PROP_BUMP] || this.renderObj[PROP_NORM] || this.renderObj[PROP_SPEC])));

            this.parts = [];

            var i:number, s:number, k:number;
            var sizes:number[];
            var iterations:number;
            var id:number = 0;
            var sub:number = 0;
            var props:string[] = [];
            var sum:number = 0;

            for (k = 0; k < PROP_ORDER.length; k++) {
                if (this.renderObj[PROP_ORDER[k]]) {
                    props.push(PROP_ORDER[k]);
                }
            }

            sizes = (block && this.isWebGL) ? [smallSize, fullSize] : [fullSize];
            iterations = (block && !this.isWebGL) ? BLOCK_ITERATIONS : 1;
            block = (iterations > 1) ? block : 0;

            if (this.renderType === BOX_TYPE) {
                for (i = 0; i < BOX_SIDES; i++) {
                    for (k = 0; k < props.length; k++) {
                        for (s = 0; s < sizes.length; s++) {
                            sum += sizes[s];

                            var o:Options = new Options(sizes[s], sizes[s], 1, sub, block, 0);

                            o.type = props[k];
                            o.side = i;
                            o.progress = sum;
                            o.id = ++id;
                            o.confirm = id > CONFIRM_LIMIT;

                            this.parts.push(o);
                        }

                        sub++;
                    }
                }

                this.parts.forEach(function (v:Options) {
                    v.progress = Math.round(100 * v.progress / sum);
                });
            } else {
                for (i = 0; i < iterations; i++) {
                    for (k = 0; k < props.length; k++) {
                        for (s = 0; s < sizes.length; s++) {
                            sum += sizes[s];

                            var w = sizes[s];
                            var h = sizes[s];

                            if (this.renderType === SPHERE_TYPE) {
                                w *= Math.PI;
                                h *= Math.PI / 2;
                            }

                            var o:Options = new Options(w, h, 1, k, block, i);

                            o.type = props[k];
                            o.progress = sum;
                            o.id = ++id;
                            o.confirm = id > CONFIRM_LIMIT;

                            this.parts.push(o);
                        }
                    }
                }

                if ((this.parts.length === 4) && (iterations === 4)) {
                    this.parts.forEach(function (v:Options, k:number) {
                        v.progress = [12, 25, 50, 100][k];
                    });
                } else {
                    this.parts.forEach(function (v:Options) {
                        v.progress = Math.round(100 * v.progress / sum);
                    });
                }
            }
        }
    }
}
