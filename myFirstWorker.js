const sendData = (data) => {
    if (data) {
        self.postMessage({response: data});
    }
};

self.onmessage = async (evt) => {
        let resp = await fetch('https://api.themoviedb.org/3/movie/' + evt.data.movieId++ +
            '?api_key=' + evt.data.movieAPIkey);
        let data = await resp.json();
        sendData(data);
    };