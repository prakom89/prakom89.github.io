function enableNotificationTrigger(idEl) {
    var enableNotification = document.getElementById(idEl);
    if ("Notification" in window) {
        enableNotification.addEventListener("click", function() {
            Notification.requestPermission(function(result) {
                console.log("User choice", result);
                if (result !== "granted") {
                    console.log("No Notification permission granted!");
                } else {
                    if (!("serviceWorker" in navigator)) {
                        return;
                    }
                    if ("PushManager" in window) {
                        navigator.serviceWorker.getRegistration().then(function(reg) {
                            reg.pushManager
                                .subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: urlBase64ToUint8Array("BEm5kISEyJ2Q7V--cu7x5YRz627-hA7gNPebQA6lBFPgZeEaysAzk3zz1LDnUlJjJsqz1IdZ-szARZesUA-n7Ow")
                                })
                                .then(function(sub) {
                                    console.log(
                                        "Berhasil melakukan subscribe dengan endpoint: ",
                                        sub.endpoint
                                    );
                                    console.log(
                                        "Berhasil melakukan subscribe dengan p256dh key: ",
                                        btoa(
                                            String.fromCharCode.apply(
                                                null,
                                                new Uint8Array(sub.getKey("p256dh"))
                                            )
                                        )
                                    );
                                    console.log(
                                        "Berhasil melakukan subscribe dengan auth key: ",
                                        btoa(
                                            String.fromCharCode.apply(
                                                null,
                                                new Uint8Array(sub.getKey("auth"))
                                            )
                                        )
                                    );
                                })
                                .catch(function(e) {
                                    console.error("Tidak dapat melakukan subscribe ", e);
                                });
                        });
                    }
                    M.toast({
                        html: "You'll be Notified!",
                        displayLength: 1000,
                        outDuration: 300
                    });
                }
            });
        });
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}