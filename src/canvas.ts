///<reference path="wrap.ts" />
///<reference path="histogram.ts" />

module txScripts {
    'use strict';

    export class Canvas {
        static draw(target:HTMLCanvasElement|number[],
                    source:Wrap|ArrayBuffer,
                    channels:number = null,
                    histogram:Histogram = null,
                    step:number = null) {
            var data:number[];
            var size:number;

            if (typeof HTMLCanvasElement !== 'undefined' && target instanceof HTMLCanvasElement) {
                var ctx:CanvasRenderingContext2D = target.getContext('2d');
                var imageData:ImageData = ctx.getImageData(0, 0, target.width, target.height);
                data = imageData.data;
                size = target.width;
            } else {
                data = <number[]>target;
            }

            if (source instanceof Wrap) {
                this.blit(source.channels(), source.first(), source.last(), data, source.heap());
            } else {
                var heap = new Uint8Array(<ArrayBuffer>source);

                if (histogram) {
                    this.blitHistogram(channels, 0, heap.length, data, heap, histogram);
                } else if (step) {
                    this.blitIteration(channels, size, data, heap, step);
                } else {
                    this.blit(channels, 0, heap.length, data, heap);
                }
            }

            if (typeof HTMLCanvasElement !== 'undefined' && target instanceof HTMLCanvasElement) {
                ctx.putImageData(imageData, 0, 0);
            }
        }

        private static blitHistogram(channels:number, first:number, last:number, data:number[], heap:Uint8Array, histogram:Histogram) {
            var z:number = 0;
            var w:number = first;
            var t:number;

            if (channels === 3) {
                while (w < last) {
                    histogram[0][heap[w]]++;
                    data[z++] = heap[w++];

                    histogram[1][heap[w]]++;
                    data[z++] = heap[w++];

                    histogram[2][heap[w]]++;
                    data[z++] = heap[w++];

                    data[z++] = 255;
                }
            } else {
                while (w < last) {
                    data[z++] = t = heap[w++];
                    data[z++] = t;
                    data[z++] = t;

                    data[z++] = 255;

                    histogram[0][t]++;
                    histogram[1][t]++;
                    histogram[2][t]++;
                }
            }
        }

        private static blitIteration(channels:number, size:number, data:number[], heap:Uint8Array, step:number) {
            var x:number, y:number;
            var z:number;

            var xu:number, yu:number;
            var last:number = size - 1;

            var v:number;

            for (x = 0; x < size; x += step) {
                var xo = x % (step * 2);
                var xm = Math.min(size, x + step);

                for (y = last; y >= 0; y -= step) {
                    var yo = y % (step * 2);
                    var ym = Math.max(-1, y - step);

                    if (!((xo === 0) && (yo === 0))) {
                        var pixel = (x + (last - y) * size) * channels;

                        if (channels === 3) {
                            for (xu = x; xu < xm; xu++) {
                                for (yu = y; yu > ym; yu--) {
                                    z = 4 * (xu + (last - yu) * size);
                                    data[z++] = heap[pixel];
                                    data[z++] = heap[pixel + 1];
                                    data[z++] = heap[pixel + 2];
                                    data[z] = 255;
                                }
                            }
                        } else {
                            for (xu = x; xu < xm; xu++) {
                                for (yu = y; yu > ym; yu--) {
                                    z = 4 * (xu + (last - yu) * size);
                                    data[z++] = v = heap[pixel];
                                    data[z++] = v;
                                    data[z++] = v;
                                    data[z] = 255;
                                }
                            }
                        }
                    }
                }
            }
        }

        private static blit(channels:number, first:number, last:number, data:number[], heap:Uint8Array) {
            var t:number;
            var i:number = 0;
            var j:number = first;

            if (channels === 3) {
                while (j < last) {
                    data[i++] = heap[j++];
                    data[i++] = heap[j++];
                    data[i++] = heap[j++];
                    data[i++] = 255;
                }
            } else {
                while (j < last) {
                    data[i++] = t = heap[j++];
                    data[i++] = t;
                    data[i++] = t;
                    data[i++] = 255;
                }
            }
        }
    }
}
