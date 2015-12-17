var mq = require('strong-mq');
var winston = require('winston');
var config = require('config');
var splunk = require('winston-splunk').splunk;

function launch() {
    var connection = mq.create().open("ampg://" + config.get('ampgHost'));
    var push = connection.createPushQueue(config.get('queueName'));
    winston.add(splunk, {
        splunkHost: config.get('logHost')
    });

    /** Store Synchronisation */
    setInterval(
        function () {
            push.publish(config.get('syncStoresJob'));
            winston.info('Store sync request queued.', {timestamp: Date.now(), pid: process.pid});
        },
        config.get('syncStoresInterval')
    );

    /** EAN Synchronisation */
    setInterval(
        function () {
            push.publish(config.get('syncEANJob'));
            // TODO: logging
        },
        config.get('syncEANInterval')
    );
}

launch();
