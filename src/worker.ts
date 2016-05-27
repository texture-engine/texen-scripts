///<reference path="wrap.ts" />

module txScripts {
    'use strict';

    export interface IEvent {
        data:IData;
    }

    export interface IData {
        formula:string;
        parts:Options[];
        preLoad:boolean;
        next:boolean;
        path:string;
    }

    export interface IResult {
        original:IData;
        result:ArrayBuffer;
        channels: number;
        log: string;
        index:number;
        part:Options;
        keep:boolean;
    }

    export class Worker {
        static index:number;
        static event:IEvent;
        static wrap:Wrap;

        static init(path:string = '.'):void {
            (<any>self).Module = {};

            if (location.search === '?stats') {
                importScripts(path + '/texen-core-stats.js');
            } else {
                importScripts(path + '/texen-core-light.js');
            }

            Worker.wrap = new Wrap((<any>self).Module);
        }

        static process() {
            var ptr:number = null;
            var part = Worker.event.data.parts[Worker.index];

            try {
                ptr = Worker.wrap.run(Worker.event.data.formula, part);
            } catch (ex) {
                delete (<any>self).Module;
                (<any>self).postMessage(null);
                return;
            }

            var i = 0;
            var j = ptr;
            var channels = Worker.wrap.channels();
            var length = part.width * part.height * channels;
            var buffer = new ArrayBuffer(length);
            var array = new Uint8Array(buffer);
            var last = length + i;

            while (i < last) {
                array[i++] = (<any>self).Module.HEAP8[j++];
            }

            var ret:IResult = {
                original: Worker.event.data,
                result: buffer,
                channels: channels,
                log: Worker.wrap.log(),
                index: Worker.index,
                part: part,
                keep: (Worker.index + 1) < Worker.event.data.parts.length
            };

            try {
                (<any>self).postMessage(ret, [buffer]);
            } catch (ex) {
                try {
                    (<any>self).postMessage(ret);
                } catch (ex) {
                }
            }
        }

        static message(event:IEvent) {
            if (!(<any>self).Module) {
                Worker.init(event.data.path);
            }

            if (event.data.preLoad) {
                return;
            }

            if (event.data.next === true) {
                Worker.process();
                Worker.index++;
            } else {
                Worker.event = event;

                for (Worker.index = 0; Worker.index < Worker.event.data.parts.length; Worker.index++) {
                    Worker.process();
                }
            }
        }
    }

    if (typeof importScripts === 'function') {
        self.onmessage = Worker.message;
    }
}
