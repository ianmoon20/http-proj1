'use strict';

/** #ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
* */
var numMessages = 0;

var preventDefaults = function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
};

var parseJSON = function parseJSON(xhr, content, updating) {
    var obj = JSON.parse(xhr.response);

    //Checking to see if we need to update messages
    if (updating) {
        if (numMessages < obj.numMessages) {
            for (var x = numMessages; x < obj.numMessages; x++) {
                var messageContainer = document.createElement('div');
                messageContainer.className = "message";
                var user = document.createElement('p');
                user.className = "user";
                user.textContent = obj['' + (x + 1)].name + ' (' + obj['' + (x + 1)].time + ')';

                var p = document.createElement('p');
                p.className = "content";
                p.textContent = obj['' + (x + 1)].messages;

                messageContainer.appendChild(user);
                messageContainer.appendChild(p);
                content.appendChild(messageContainer);
            }
            //Incrementing the number of messages for comparison with the server when we decide if we need to update
            numMessages = numMessages + (obj.numMessages - numMessages);
        } else if (numMessages > obj.numMessages) {
            //we've cleared the server... also clear the clients https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
            console.log("Hi");
            var myNode = document.querySelector("#item1");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
        }
    } else if (obj.name) {
        var _messageContainer = document.createElement('div');
        _messageContainer.className = "message";

        var _user = document.createElement('p');
        _user.className = "user";
        _user.textContent = obj.name + ' (' + obj.time + ')';

        var _p = document.createElement('p');
        _p.className = "content";
        _p.textContent = obj.messages;

        _messageContainer.appendChild(_user);
        _messageContainer.appendChild(_p);
        content.appendChild(_messageContainer);
        //Incrementing the number of messages for comparison with the server when we decide if we need to update
        numMessages += 1;
    }
};

var handleResponse = function handleResponse(xhr, parseResponse, updating) {
    var messageArea = document.querySelector('#item1');

    if (updating) {
        parseJSON(xhr, messageArea, true);
    } else if (parseResponse && xhr.status != 204) {
        parseJSON(xhr, messageArea);
    } else if (xhr.status != 204) {
        console.log('Head Request Recieved');
    }
};

var sendPost = function sendPost(e, messageForm) {
    var usernameField = messageForm.querySelector('#nameField');
    var messageField = messageForm.querySelector('#messageField');

    var xhr = new XMLHttpRequest();
    xhr.open('post', '/sendMessage');

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = function () {
        return handleResponse(xhr, true);
    };

    var today = new Date();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    var formData = 'time=' + time + '&name=' + usernameField.value + '&message=' + messageField.value;

    messageField.value = "";

    xhr.send(formData);

    e.preventDefault();
    return false;
};

var requestUpdate = function requestUpdate() {
    var xhr = new XMLHttpRequest();

    xhr.open("get", "/getMessages");

    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = function () {
        return handleResponse(xhr, true, true);
    };

    xhr.send();

    setTimeout(requestUpdate, 1000);
};

var init = function init() {
    var messageForm = document.querySelector('#messageForm');

    var addMessage = function addMessage(e) {
        return sendPost(e, messageForm);
    };

    messageForm.addEventListener('submit', addMessage);

    //Seeing if we have updates to post
    setTimeout(requestUpdate, 1000);
};

window.onload = init;
