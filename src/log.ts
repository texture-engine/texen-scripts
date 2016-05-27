module txScripts {
    'use strict';

    export class Log {
        public static parse(json:string):any {
            var log:any = null;

            try {
                log = JSON.parse(json);
            } catch (ign) {
            }

            if (log) {
                for (var k in log.functions) {
                    var fnc = log.functions[k];

                    if (fnc.debug) {
                        var data:{[index:string]:string} = {};
                        var s:string[] = fnc.debug.trim().split(';');

                        s.forEach(function (v:string) {
                            var m:string[] = v.split(':');

                            if (m.length === 2) {
                                var n:string = m[0].trim();
                                data[n] = m[1].trim();
                            }
                        });

                        fnc.data = data;
                    }
                }
            }

            return log;
        }
    }
}
