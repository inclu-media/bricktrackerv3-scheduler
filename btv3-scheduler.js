var mq = require('strong-mq');
var winston = require('winston');
var config = require('config');
var splunk = require('winston-splunk').splunk;

function launch() {

    // init logger
    winston.add(splunk, {
        splunkHost: config.get('logHost')
    });

    // init message queue
    var connection = mq.create({
        provider: 'amqp',
        host: config.get('amqpHost'),
        port: config.get('amqpPort')
    });
    connection.open().on('error', function() {
        winston.log('error','Error connecting to messaging server.');

    });
    var push = connection.createPushQueue(config.get('queueName'));

    winston.log('info','Store sync scheduler started. Interval: %d ms.', config.get('syncStoresInterval'));
    winston.log('info','Amazon sync scheduler started. Interval: %d ms.', config.get('syncEANInterval'));

    /** Store Synchronisation */
    setInterval(
        function () {
            push.publish({job: config.get('syncStoresJob')});
            winston.log('info','New store sync request queued.');
        },
        config.get('syncStoresInterval')
    );

    /** EAN Synchronisation */
    setInterval(
        function () {
            push.publish({job: config.get('syncEANJob')});
            winston.log('info','New Amazon sync request queued.');
        },
        config.get('syncEANInterval')
    );
}

launch();
