// src/worker.js
self.onmessage = function (e) {
    const initNum = e.data;
    let x = 1;
    console.log('long calculation...');

    for (let i = 0; i < 75000000; i++) {
        if (Math.random() > 0.5) {
            x = x + Math.random();
        } else {
            x = x - Math.random();
        }
    }

    console.log('long calculation done');
    const result = (Math.floor(x) + initNum).toString();
    self.postMessage(result);
};
