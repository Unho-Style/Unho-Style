//TODO: 채팅시 푸시알림 구현을 위한 서비스 워커 구현
const channel = new BroadcastChannel('noti')

self.addEventListener('push', function (event) {
    const data = JSON.parse(event.data.text());
    channel.postMessage(data);
    event.waitUntil(async function() {
        registration.showNotification( data.senderUsername, {
            body: data.content,
            data: {
                link: `/message?chatid=${data.chatId}`
            },
            vibrate: [100, 100, 100],
        })
    }());
});

self.addEventListener("notificationclick", (event) => {
    console.log(event.notification);
    clients.openWindow(event.notification.data.link).then(console.log).catch(console.error);
});