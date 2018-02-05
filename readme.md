
# node-red-contrib-azure-event-hub-receive

**node-red-contrib-azure-event-hub-receive** is a <a href="http://nodered.org" target="_new">Node-RED</a> node that allows you to receive messages from an Azure Event Hub.

# Usage

Drop the **node-red-contrib-azure-event-hub-receive** node on a Flow. Double click on the node to open the settings and configure:

- **Event Hub Connection String**: the connection string of the event hug, it can be retrieved from the Azure Portal. It should look like *Endpoint=sb://XXX.servicebus.windows.net/;SharedAccessKeyName=XXX;SharedAccessKey=XXX;EntityPath=XXX*
- **Event Hub Consumer Group**: the name of the Consumer Group you would like to use. If you didn't create any custom Consumer Groups in your Event Hub, you can use the default name which is *$default*