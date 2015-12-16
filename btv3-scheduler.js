var mq = require('strong-mq');
var winston = require('winston');

const SYNC_STORES_INTERVAL = 600000;  // 10 Minutes
const SYNC_EAN_INTERVAL    = 3600000; // 60 minutes
const SYNC_STORES_JOB      = "sync-stores";
const SYNC_EAN_JOB         = "sync-ean";
const QUEUE_NAME           = "btv3";
const AMPQ_HOST            = "ampq://localhost";

function launch() {
    var connection = mq.create().open(AMPQ_HOST);
    var push = connection.createPushQueue(QUEUE_NAME);

    /** Store Synchronisation */
    setInterval(
        function () {
            push.publish(SYNC_STORES_JOB);
            winston.info('Store sync request queued.', {timestamp: Date.now(), pid: process.pid});
        },
        SYNC_STORES_INTERVAL
    );

    /** EAN Synchronisation */
    setInterval(
        function () {
            push.publish(SYNC_EAN_JOB);
            // TODO: logging
        },
        SYNC_EAN_INTERVAL
    );
}

launch();
