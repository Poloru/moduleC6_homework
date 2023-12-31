// const wsUri = "wss://echo.websocket.org/";
// const wsUri = "wss://ws.postman-echo.com/raw";
const wsUri = "ws://echo-ws-service.herokuapp.com";

const btn = document.querySelector('.send_message');
const geo_btn = document.querySelector('.send_geo');
const chat = document.querySelector('.chat');

function addToChat(message, from) {
    const add_msg = document.createElement('div');
    add_msg.className = from;
    add_msg.innerHTML = `<p>${message}</p>`;
    chat.appendChild(add_msg);
};

const websocket = new WebSocket(wsUri);

websocket.onmessage = function(evt) {
    if (evt.data !== '[object GeolocationCoordinates]') {
        addToChat(evt.data, 'server_mess');
    }
};

websocket.onopen = function(evt) {
    console.log('Server connected!');
};

websocket.onclose = function(evt) {
    console.log('Server disconnected.');
};

websocket.onerror = function(evt) {
    console.log('!Error! - ' + evt.data);
};

btn.addEventListener('click', () => {
    const my_message = document.querySelector('.my_message').value;
    addToChat(my_message, 'my_mess');
    websocket.send(my_message);
    document.querySelector('.my_message').value = '';
});

geo_btn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        console.log('Geolocation не поддерживается вашим браузером');
    } else {
        console.log('Определение местоположения...');
        navigator.geolocation.getCurrentPosition((position) => {
            const { coords } = position;
            websocket.send(coords);
            const url = `https://www.openstreetmap.org/#map=18/${coords.latitude}/${coords.longitude}`;
            const res = `<a href='${url}' target="_blank">Гео-локация</a>`;
            addToChat(res, 'my_mess');
        });
    }
});
