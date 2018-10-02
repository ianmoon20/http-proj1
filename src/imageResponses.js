const images = {};

const respondImage = (request, response, status, object) => {
  response.writeHead(status, {
    'Content-Type': 'image/png',
  });
  response.write();
  response.end();
};

const addImage = (request, response, params) => {
  // console.log(request);
};

module.exports = {
  addImage,
};
