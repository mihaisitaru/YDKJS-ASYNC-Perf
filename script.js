console.log('-----_____START_____-----');
const movieAPIkey = '03312b90526004008cdedb36c525ed1a';
const imageUrl = 'https://image.tmdb.org/t/p/w500/';
let movieNo = 1;
let movieId = Math.floor(Math.random() * 900);

let a = 20;
let b = 1;
let c = 2;

const foo = () => {
    a = a + 1;
    b++;
    c = c * b;
    b = c + 3;
    console.log('a from foo', a);
    console.log('b from foo', b);
    console.log('c from foo', c);
};
const bar = () => {
    a = a * 2;
    c--;
    b = 8 + c;
    c = b * 2;
    console.log('a from bar', a);
    console.log('b from bar', b);
    console.log('c from bar', c);
};

const extendObj = (origObj, newProp) => {
    for (var key in newProp) {
        origObj[key] = newProp[key];
    }
    return origObj;
};

const root = document.getElementById('root');
const container = document.createElement('div');

appendHTMLElements();
// ajax call + callback
const req = new XMLHttpRequest();
req.open('GET', 'https://api.themoviedb.org/3/movie/' + movieId++ + '?api_key=' + movieAPIkey, true);

req.onload = (resp) => {
    foo();
    if (resp.currentTarget.status === 200) {

        displayDetails(JSON.parse(resp.currentTarget.response), movieNo++);

    } else {
        displayError(resp.errorText);
    }
};

req.send();

const timeOut = setTimeout(() => { console.log('-----______END______-----'); }, 7000);

function appendHTMLElements() {
    const title = document.createElement('h1');

    root.setAttribute('class', 'container-black');
    container.setAttribute('class', 'container');
    root.appendChild(container);

    title.textContent = 'Here we go!';
    title.setAttribute('class', 'text text-info');
    container.appendChild(title);
}

function displayDetails(data, no) {
    // console.log('data', data);
    const moviePoster = document.createElement('img');
    const movieDetails = document.createElement('div');
    const movieTitle = document.createElement('h4');
    const movieOverview = document.createElement('article');
    const movieReleaseDate = document.createElement('small');

    extendObj(moviePoster, {
        src: imageUrl + data.poster_path,
        title: data.title,
        alt: data.title
    });

    moviePoster.setAttribute('class', 'image');
    movieDetails.setAttribute('class', 'image-details');
    movieTitle.textContent = no + '. ' + data.title;
    movieOverview.textContent = data.overview;
    movieReleaseDate.textContent = `Release date: ${new Date(data.release_date).toLocaleDateString()}`;
    container.appendChild(movieDetails);
    movieDetails.appendChild(moviePoster);
    movieDetails.appendChild(movieTitle);
    movieDetails.appendChild(movieReleaseDate);
    movieDetails.appendChild(movieOverview);
}

function displayError(errorText) {
    const errorMessage = document.createElement('h4');
    errorMessage.setAttribute('class', 'text text-danger');
    errorMessage.textContent = 'One of the requests sends the error: ' + errorText;
    container.appendChild(errorMessage);
}

// fetch call + promise

fetch('https://api.themoviedb.org/3/movie/' + movieId++ + '?api_key=' + movieAPIkey)
    .then(resp => resp.json())
    .then(data => displayDetails(data, movieNo++));

// fetch call async and await  

const getMovie = async () => {
    let resp = await fetch('https://api.themoviedb.org/3/movie/' + movieId++ + '?api_key=' + movieAPIkey);
    let data = await resp.json();
    return data;
};

getMovie().then(data => displayDetails(data, movieNo++));

// fetch with library (axios)

axios.get('https://api.themoviedb.org/3/movie/' + movieId++ + '?api_key=' + movieAPIkey)
    .then(resp => {
        displayDetails(resp.data, movieNo++);
        bar();
    })
    .catch(error => displayError(error));

// Promise.race - the latch

const firstRequest = axios.get('https://api.themoviedb.org/3/movie/' + movieId++ + '?api_key=' + movieAPIkey);
const secondRequest = axios.get('https://api.themoviedb.org/3/movie/' + movieId++ + '?api_key=' + movieAPIkey);

Promise.race([firstRequest, secondRequest])
    .then((resp) => {
        displayDetails(resp.data, movieNo++);
    })
    .catch(displayError);

// Promise.all - the gate

const fRequest = axios.get('https://api.themoviedb.org/3/movie/' + movieId++ + '?api_key=' + movieAPIkey);
const sRequest = axios.get('https://api.themoviedb.org/3/movie/' + movieId++ + '?api_key=' + movieAPIkey);

Promise.all([fRequest, sRequest])
    .then((resp) => {
        resp.forEach(element => {
            displayDetails(element.data, movieNo++);
        });
    })
    .catch(displayError);

// Generators + Promises

function request(a, b) {
    return axios.get('https://api.themoviedb.org/3/movie/' + a + '?api_key=' + b);
}

function* main() {
    try {
        let resp = yield request(movieId++, movieAPIkey);
        yield 'Finished!';
        let secResp = yield request(movieId++, movieAPIkey);
        yield 'Now is finished!';
        displayDetails(resp.data, movieNo++);
        displayDetails(secResp.data, movieNo++);
    }
    catch (err) {
        console.log('Error message: ' + err);
    }
}

let iterator = main();
let promise = iterator.next().value;
let theEnd = iterator.next().value;
console.log(theEnd);
let newPromise = iterator.next().value;
console.log(iterator.next().value);
// console.log(iterator.next().value);

promise.then(
    (text) => { iterator.next(text) },
    (err) => { iterator.throw(err) }
);

newPromise.then(
    (text) => { iterator.next(text) },
    (err) => { iterator.throw(err) }
);

// Web workers

var worker = new Worker('http://127.0.0.1:5500/myFirstWorker.js');
worker.addEventListener('message', function (evt) {
    displayDetails(evt.data.response, movieNo++);
});

worker.postMessage({movieId, movieAPIkey});