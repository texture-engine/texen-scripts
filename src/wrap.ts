///<reference path="options.ts" />

module txScripts {
    'use strict';

    export class Wrap {
        render:(width:number,
                height:number,
                scale:number,
                formula:string,
                sub:number,
                block:number,
                iteration:number,
                record:boolean,
                recordVector:boolean)=>number;
        channels:()=>number;

        private _log:()=>string;
        private _result:number;
        private _options:Options;
        private _module:any;

        constructor(module:any) {
            var N = 'number';
            var S = 'string';

            this._module = module;

            this.render = module.cwrap('tx', N, [N, N, N, S, N, N, N, N, N]);
            this._log = module.cwrap('txLog', S, []);
            this.channels = module.cwrap('txChannels', N, []);
        }

        run(formula:string, options:Options):number {
            this._options = options;

            return this._result = this.render(options.width,
                options.height,
                options.scale,
                formula,
                options.sub,
                options.block,
                options.iteration,
                options.record,
                options.recordVector
            );
        }

        first():number {
            return this._result;
        }

        last():number {
            return this._result + this._options.width * this._options.height * this.channels();
        }

        heap():Uint8Array {
            return new Uint8Array(this._module.HEAP8);
        }

        log() {
            try {
                return this._log()
                    .replace(/(" : inf)/g, '" : "inf"')
                    .replace(/(" : -inf)/g, '" : "-inf"');
            } catch (ign) {
                return null;
            }

        }

        value(i:number):number {
            return (i < 0) ? (256 + i) : i;
        }
    }
}
