// src/workers/vendor.js
const { parentPort, workerData } = require('worker_threads');
const { vendorId, interval } = workerData;

const run = async () => {
    while (true) {
        parentPort.postMessage({ type: 'addTicket' });
        await new Promise(resolve => setTimeout(resolve, interval));
    }
};

run().catch(error => {
    console.error(`Vendor ${vendorId} error:`, error);
});

// src/workers/customer.js
const { parentPort, workerData } = require('worker_threads');
const { customerId, interval, isVip } = workerData;

const run = async () => {
    while (true) {
        parentPort.postMessage({ type: 'removeTicket' });
        await new Promise(resolve => setTimeout(resolve, interval));
    }
};

run().catch(error => {
    console.error(`Customer ${customerId} error:`, error);
});