//TODO: 채팅시 푸시알림 구현을 위한 서비스 워커 구현
const channel = new BroadcastChannel('noti')

self.addEventListener('push', function (event) {
    const data = JSON.parse(event.data.text());
    channel.postMessage(data);
    if(data.event == 'RECV_MSG') {
        event.waitUntil(async function() {
            registration.showNotification( data.data.senderUsername, {
                body: data.data.content,
                data: {
                    link: `/message?chatid=${data.data.chatId}`
                },
                vibrate: [100, 100, 100],
            })
        }());
    }else if(data.event == 'STATUS_CHANGE') {
        event.waitUntil(async function() {
            registration.showNotification(`'${data.data.tradeTitle}'의 거래가 완료되었어요!`, {
                body: '거래는 어땠는지 후기를 남겨주세요',
                data: {
                    link: `/rating?tradeId=${data.data.tradeId}`
                },
                vibrate: [100, 100, 100],
            })
        }());
    }
});

self.addEventListener("notificationclick", (event) => {
    console.log(event.notification);
    clients.openWindow(event.notification.data.link).then(console.log).catch(console.error);
});