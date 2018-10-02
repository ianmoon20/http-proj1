'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** #ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
* */

var preventDefaults = function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
};

var highlight = function highlight(upload, e) {
    upload.classList.add('highlight');
};

var unhighlight = function unhighlight(upload, e) {
    upload.classList.remove('highlight');
};

var handleDrop = function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;

    handleFiles(files);
};

var handleFiles = function handleFiles(files) {
    // Converting the FileList to an array for iteration
    files = [].concat(_toConsumableArray(files));
    files.forEach(uploadFile);
    files.forEach(previewFile);
};

var previewFile = function previewFile(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        var img = document.createElement('img');
        img.src = reader.result;
        img.height = 150;
        img.width = 150;
        document.getElementById('gallery').appendChild(img);
    };
};

var uploadFile = function uploadFile(file) {
    var url = '/uploadImage';
    var xhr = new XMLHttpRequest();
    //let formData = new FormData();

    xhr.open('POST', url, true);
    //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'image/png');

    //When the file is downloaded
    xhr.addEventListener('readystatechange', function (e) {
        console.info(xhr);
        if (xhr.readyState === 4) {
            handleResponse(xhr);
        }
    });

    console.log(file);
    //xhr.send(formData);
    xhr.send(file);
};

var handleResponse = function handleResponse(xhr) {
    var content = document.querySelector('#content');

    console.dir(xhr.response);

    switch (xhr.status) {
        case 200:
            content.innerHTML = '<b>Success</b>';
            break;
        case 201:
            content.innerHTML = '<b>Create</b>';
            break;
        case 400:
            content.innerHTML = '<b>Bad Request</b>';
            break;
        case 404:
            content.innerHTML = '<b>Resource Not Found</b>';
            break;
        default:
            content.innerHTML = '<b>Error code not implemented by client.<b>';
            break;
    }
};

var init = function init() {
    var uploadSection = document.querySelector('#drop-area');
    // Preventing the defaults of all the events
    ['dragover', 'drop'].forEach(function (eventName) {
        window.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
        uploadSection.addEventListener(eventName, preventDefaults, false);
    });

    // Highlighting while the form is hovered over
    ['dragenter', 'dragover'].forEach(function (eventName) {
        uploadSection.addEventListener(eventName, highlight(uploadSection, eventName), false);
    });

    ['dragleave', 'dragleave'].forEach(function (eventName) {
        uploadSection.addEventListener(eventName, unhighlight(uploadSection, eventName), false);
    });

    uploadSection.addEventListener('drop', handleDrop, false);
};

window.onload = init;
