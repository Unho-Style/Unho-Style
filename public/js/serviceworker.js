//TODO: 채팅시 푸시알림 구현을 위한 서비스 워커 구현
self.addEventListener('push', function (event) {
    const data = JSON.parse(event.data.text());
    event.waitUntil(async function() {
        registration.showNotification( data.title, {
            body: data.content,
            vibrate: [100, 100, 100],
        })
    }());
});

self.addEventListener("notificationclick", (event) => {
    clients.openWindow('/chat');
});