/** #ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
* */
let numMessages = 0;

const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

const parseJSON = (xhr, content, updating) => {
    const obj = JSON.parse(xhr.response);
    
    //Checking to see if we need to update messages
    if(updating) {
        if(numMessages < obj.numMessages) {
            for(let x = numMessages; x < obj.numMessages; x++) {
                const messageContainer = document.createElement('div');
                messageContainer.className = "message";
                const user = document.createElement('p');
                user.className = "user";
                user.textContent = `${obj[`${x+1}`].name} (${obj[`${x+1}`].time})`;
                

                const p = document.createElement('p');
                p.className = "content";
                p.textContent = obj[`${x+1}`].messages;

                messageContainer.appendChild(user);
                messageContainer.appendChild(p);
                content.appendChild(messageContainer);
            }
            //Incrementing the number of messages for comparison with the server when we decide if we need to update
            numMessages = numMessages + (obj.numMessages-numMessages);
        } else if (numMessages > obj.numMessages) {
            //we've cleared the server... also clear the clients https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
            const myNode = document.querySelector("#item1");
            while(myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            
            numMessages = 0;
        }
    } else if(obj.name) {
        const messageContainer = document.createElement('div');
        messageContainer.className = "message";
        
        const user = document.createElement('p');
        user.className = "user";
        user.textContent = `${obj.name} (${obj.time})`;
        
        
        const p = document.createElement('p');
        p.className = "content";
        p.textContent = obj.messages;
        
        messageContainer.appendChild(user);
        messageContainer.appendChild(p);
        content.appendChild(messageContainer);
        //Incrementing the number of messages for comparison with the server when we decide if we need to update
        numMessages += 1;
    }
};

const handleResponse = (xhr, parseResponse, updating) => {
    const messageArea = document.querySelector('#item1');
    
    if(updating) {
        parseJSON(xhr, messageArea, true);
    } else if(parseResponse && xhr.status != 204) {
        parseJSON(xhr, messageArea);
    } else if(xhr.status != 204) {
        console.log('Head Request Recieved');
    }
};

const sendPost = (e, messageForm) => {
    const usernameField = messageForm.querySelector('#nameField');
    const messageField = messageForm.querySelector('#messageField');
    
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/sendMessage');
    
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
    xhr.setRequestHeader('Accept', 'application/json');
    
    xhr.onload = () => handleResponse(xhr, true);
    
    const today = new Date();
    let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    
    const formData = `time=${time}&name=${usernameField.value}&message=${messageField.value}`;
    
    messageField.value = "";
    
    xhr.send(formData);
    
    e.preventDefault();
    return false;
}

const requestUpdate = () => {
    const xhr = new XMLHttpRequest();
    
    xhr.open("get", "/getMessages");
    
    xhr.setRequestHeader('Accept', 'application/json');
    
    xhr.onload = () => handleResponse(xhr, true, true);
    
    xhr.send();
    
    setTimeout(requestUpdate, 1000);
}

const init = () => {
    const messageForm = document.querySelector('#messageForm');
        
    const addMessage = (e) => sendPost(e, messageForm);
        
    messageForm.addEventListener('submit', addMessage);
    
    //Seeing if we have updates to post
    setTimeout(requestUpdate, 1000);
};

window.onload = init;
