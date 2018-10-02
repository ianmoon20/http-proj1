/** #ES6 file to be converted into an ES5 file
    Our babel build/watch scripts in the package.json
    will convert this into ES5 and put it into the hosted folder.
* */

const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

const highlight = (upload, e) => {
    upload.classList.add('highlight');
};

const unhighlight = (upload, e) => {
    upload.classList.remove('highlight');
};

const handleDrop = (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
};

const handleFiles = (files) => {
    // Converting the FileList to an array for iteration
    files = [...files];
    files.forEach(uploadFile);
    files.forEach(previewFile);
};

const previewFile = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        let img = document.createElement('img');
        img.src = reader.result;
        img.height = 150;
        img.width = 150;
        document.getElementById('gallery').appendChild(img);
    }
};

const uploadFile = (file) => {
    const url = '/uploadImage';
    const xhr = new XMLHttpRequest();
    //let formData = new FormData();

    xhr.open('POST', url, true);
    //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'image/png');

    //When the file is downloaded
    xhr.addEventListener('readystatechange', (e) => {
        console.info(xhr);
        if (xhr.readyState === 4) {
            handleResponse(xhr);
        }
    });

    console.log(file);
    //xhr.send(formData);
    xhr.send(file);
};

const handleResponse = (xhr) => {
    const content = document.querySelector('#content');

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

const init = () => {
    const uploadSection = document.querySelector('#drop-area');
    // Preventing the defaults of all the events
  ['dragover', 'drop'].forEach((eventName) => {
        window.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        uploadSection.addEventListener(eventName, preventDefaults, false);
    });

    // Highlighting while the form is hovered over
  ['dragenter', 'dragover'].forEach((eventName) => {
        uploadSection.addEventListener(eventName, highlight(uploadSection, eventName), false);
    });

  ['dragleave', 'dragleave'].forEach((eventName) => {
        uploadSection.addEventListener(eventName, unhighlight(uploadSection, eventName), false);
    });

    uploadSection.addEventListener('drop', handleDrop, false);
};

window.onload = init;
