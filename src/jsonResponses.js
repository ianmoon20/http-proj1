// List of users
let messages = {};
let numMessages = 0;

const respond = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getMessages = (request, response) => {
  // Sending back a list of users
  messages.numMessages = numMessages;

  // returning a 200
  respond(request, response, 200, messages);
};

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

const addMessage = (request, response, body) => {
  // Assume fail case
  const responseJSON = {
    message: 'Need name and message.',
  };

  // If either are missing send back a 400 error
  if (!body.name || !body.message) {
    responseJSON.id = 'missingParams';
    return respond(request, response, 400, responseJSON);
  }

  // Assume we have a successful creation
  let responseCode = 201;
  numMessages += 1;


  // If we already have that user...
  if (messages[numMessages]) {
    // We're updating (204 code)
    responseCode = 204;
  } else {
    // Create a new user
    messages[numMessages] = {};
  }

  messages[numMessages].name = body.name;
  messages[numMessages].messages = body.message;
  messages[numMessages].time = body.time;

  if (responseCode === 201) {
    responseJSON.message = 'Successfully created user and submitted message.';
    return respond(request, response, responseCode, messages[numMessages]);
  }

  // We can't send back data with a 204
  return respondMeta(request, response, responseCode);
};

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
  notFound,
  notFoundMeta,
};
