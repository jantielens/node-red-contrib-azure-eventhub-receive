var EventHubClient = require('azure-event-hubs').Client;

module.exports = function (RED) {
    function AzureEventHubReceiveNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        node.connectionstring = config.connectionstring;
        node.consumergroup = config.consumergroup;

        // clear status, might be left over after updating settings
        node.status({});

        try {
            var client = EventHubClient.fromConnectionString(node.connectionstring);
            client.open()
                .then(client.getPartitionIds.bind(client))
                .then(function (partitionIds) {
                    var errorReceived = false;

                    return partitionIds.map(function (partitionId) {
                        // loop over all partitions of the Event Hub
                        return client.createReceiver(config.consumergroup, partitionId, { 'startAfterTime': Date.now() }).then(function (receiver) {
                            // succesfully connected to a partition
                            if (!errorReceived) { // it could be only one partition receiver gives an error, hence the check 
                                node.log('Created partition receiver: ' + partitionId);
                                node.status({ fill: "green", shape: "ring", text: "connected" });
                            }

                            receiver.on('errorReceived', function (err) {
                                errorReceived = true;
                                node.status({ fill: "yellow", shape: "ring", text: "error received, see debug or output" });
                                node.error(err.message);
                            });

                            receiver.on('message', function (receivedMessage) {
                                // message received from Event Hub partition
                                var msg = { payload: receivedMessage.body }
                                node.send(msg);
                            });
                        });
                    });
                })
                .catch(function (err) {
                    node.status({ fill: "red", shape: "ring", text: "unexpected error: " + err.message });
                    node.error(err.message);
                });

            this.on('close', function (done) {
                node.log('closing ...');
                client.close().done(function () {
                    node.log('closing done.');
                    done();
                });
            });
        }
        catch (err) {
            this.error(err.message);
            node.status({ fill: "red", shape: "ring", text: "can't connect, " + err.message });
        }
    }

    RED.nodes.registerType("azure-event-hub-receive", AzureEventHubReceiveNode);
}

