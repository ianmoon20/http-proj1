// List of users
let messages = {};
let numMessages = 0;

// Method to handle responses
const respond = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// Handles header responses
const respondMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Finds all messages from a username
const findMessages = (request, response, params) => {
  const responseMessage = {};

  // If there are params
  if (params.username) {
    // test to see if there is an equivalant message associated with the inputted name
    for (let x = 1; x < Object.keys(messages).length; x++) {
      if (messages[`${x}`].name === params.username) {
        responseMessage[`${x}`] = {};
        responseMessage[`${x}`].name = messages[`${x}`].name;
        responseMessage[`${x}`].messages = messages[`${x}`].messages;
        responseMessage[`${x}`].time = messages[`${x}`].time;
      }
    }
    if (Object.keys(responseMessage).length === 0) {
      responseMessage.id = '400';
      responseMessage.message = 'No messages found with that username';
      return respond(request, response, 400, responseMessage);
    }
  }
  return respond(request, response, 200, responseMessage);
};

// Gets all messages on server
const getMessages = (request, response) => {
  // Sending back a list of users
  messages.numMessages = numMessages;

  // returning a 200
  respond(request, response, 200, messages);
};

// Clears all messages on the server
const clearMessages = (request, response) => {
  // Sending back a list of users
  numMessages = 0;
  messages = {};

  // returning a 200
  return respondMeta(request, response, 204);
};

const getMessagesMeta = (request, response) => {
  respondMeta(request, response, 200);
};

// Adds a message to the server
const addMessage = (request, response, body) => {
  // Assume fail case
  const responseJSON = {
    message: 'Need name and message.',
  };

  // Assume we have a successful creation
  const responseCode = 201;
  numMessages += 1;
  // Create a new message
  messages[numMessages] = {};
  messages[numMessages].name = body.name;
  messages[numMessages].messages = body.message;
  messages[numMessages].time = body.time;

  responseJSON.message = 'Successfully created user and submitted message.';
  return respond(request, response, responseCode, messages[numMessages]);
};

// Handles pages that don't exist
const notFound = (request, response) => {
  // Creating and returning an error message
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respond(request, response, 404, responseJSON);
};
const notFoundMeta = (request, response) => {
  // No error 4 u
  respond(request, response, 404);
};

module.exports = {
  getMessages,
  clearMessages,
  getMessagesMeta,
  addMessage,
  findMessages,
  notFound,
  notFoundMeta,
};
