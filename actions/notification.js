const Expo = require('expo-server-sdk');

var get_database_connection = require('../db.js');
var expoendpoint = 'https://exp.host/--/api/v2/push/send';

/**
 * Send a push notification to a player's devices
 * @param {int} player The id of the player we are sending this to
 * @param {object} message An object with the following properties: title, message, (add more later)
 */
async function sendNotifications(players, sound, body, data) {
    
    var database = await get_database_connection();

    var pushTokens = [];

    for(var i = 0; i < players.length; i++) {
        var result = await database.query("SELECT pnid FROM players WHERE id=?", [players[i]]);
        if (result.length > 0) {
            pushTokens.push(result[0]['pnid']);
        }
    }

    // Create a new Expo SDK client
    let expo = new Expo();

    // Create the messages that you want to send to clents
    let messages = [];
    for (let pushToken of pushTokens) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token $ {
                    pushToken
                }
                is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
        messages.push({
            to: pushToken,
            sound: sound,
            body: body,
            data: data,
        })
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);

    (async() => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}

async function notification(ids, sound, message, data) {
    var res = await sendNotifications(ids, sound, message, data);
    return res;
}

module.exports = {
    notification
}