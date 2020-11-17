var webPush = require("web-push");

const vapidKeys = {
    "publicKey": "BEm5kISEyJ2Q7V--cu7x5YRz627-hA7gNPebQA6lBFPgZeEaysAzk3zz1LDnUlJjJsqz1IdZ-szARZesUA-n7Ow",
    "privateKey": "GS86DL1pBws07q970kXOlt1i-U0PtKziVoEMQhlBe9E"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

var pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/dbFUTSv4Zh4:APA91bHRh7gEf9er9nRjxW37ihRaolq_2Zx8MBHmrVcB56WPiFNZUPE1LnOd8Z4h_DBYEE9TTvjmJEK0T4Q5lWeDwEgKWq-ZthXj5kIJJL2VxtvcaDMGFRoi42TxRvILXngwrpfhF0CG",
    keys: {
        p256dh: "BLs1D90l8BFBWpKxskBAHF/uVpm4wGmS/jMqer2puO1t2Qhe0soX1V+re/csMWqO/XWIFGX4sB+ftgedsLqbvJg=",
        auth: "0XYVYaz57Vkxx5tCa1DXCw==s"
    }
};

var payload = "You Have Subscribed!";

var options = {
    gcmAPIKey: "92285422295",
    TTL: 60
};

webPush.sendNotification(pushSubscription, payload, options);