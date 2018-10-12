"use strict";

/** #ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
* */
var numMessages = 0;

//Parses json objects and places them on the client
var parseJSON = function parseJSON(xhr, content, updating) {
    var obj = JSON.parse(xhr.response);

    //Checking to see if we need to update messages
    if (updating) {
        if (numMessages < obj.numMessages) {
            for (var x = numMessages; x < obj.numMessages; x++) {
                postMessage(content, obj["" + (x + 1)]);
            }
            //Incrementing the number of messages for comparison with the server when we decide if we need to update
            numMessages = numMessages + (obj.numMessages - numMessages);
        } else if (numMessages > obj.numMessages) {
            //we've cleared the server... also clear the clients https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
            var myNode = document.querySelector("#item1");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }

            numMessages = 0;
        }
    } else if (obj.name) {
        postMessage(content, obj);
        //Incrementing the number of messages for comparison with the server when we decide if we need to update
        numMessages += 1;
    }
};

//Handles objs and builds the message onto the page
var postMessage = function postMessage(content, obj) {
    var messageContainer = document.createElement('div');
    messageContainer.className = "message";
    var user = document.createElement('p');
    user.className = "user";
    user.textContent = obj.name + " (" + obj.time + ")";

    var p = document.createElement('p');
    p.className = "content";
    p.textContent = obj.messages;

    messageContainer.appendChild(user);
    messageContainer.appendChild(p);
    content.appendChild(messageContainer);
};

//Handles the various request forms
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

//Handles sending post requests to the server
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

    //Reformatting Hours
    var hours = today.getHours();
    var suffix = "AM";
    if (hours > 12) {
        hours -= 12;
        suffix = "PM";
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    //reformating minutes
    var minutes = today.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var time = hours + ":" + minutes + " " + suffix;

    var formData = "time=" + time + "&name=" + usernameField.value + "&message=" + messageField.value;

    messageField.value = "";

    xhr.send(formData);

    e.preventDefault();
    return false;
};

//Handles server polling and keeping clients updated
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
