const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNDcwN2U5NDA4OWJjZjgxNzM3NTQ1MzFjOTViOTIwNyIsInN1YiI6IjY2MTk4MDViZWE4NGM3MDE2NDU2OGYxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XsIAr1y09Dno9XyfUAODDYlP-nm4UL3WFw5_hyjNQEk'

// return a list of an array of movie objecs or empty array

async function getPopularMovies() {

    try {

        //step 1 get URL
        const getPopularMoviesUrl = 'https://api.themoviedb.org/3/movie/popular'
        //step 2 call the api the variable response holds the json data response.
        let response = await fetch(getPopularMoviesUrl, {

            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (response.ok) {
            let data = await response.json();
            return data.results;
        } else {

            return [];

        }

    } catch (error) {
        console.log(error);
        return [];
    }

}


//returns a list of an array of movie objects or empty array
async function displayPopularMovies() {

    let movies = await getPopularMovies();
    displayMovies(movies);

}

function displayFavoriteMovies() {

    //retrieve favorites from local storage
    let favorites = getFavoriteMovies();
    displayMovies(favorites);
    //display the card template with favorites
    //

}

function removeFavoriteMovie(button) {

    // get our array of movie objects

    let favorites = getFavoriteMovies();

    //search for movie with the data-movieId that is on the button
    //remove the movie from the array
    const movieId = button.getAttribute('data-movieId');
    let newFavorites =  favorites.filter(movie => movie.id != movieId);

    //save the array

    saveFavoriteMovies(newFavorites);
    //update the movies on the page
    displayFavoriteMovies();

}

function displayMovies(movies) {
    // get movie card template

    const movieCardTemplate = document.getElementById('movie-card-template');
    //find the element by ID movie row
    const movieRow = document.getElementById('movie-row');
    movieRow.innerHTML = '';
    //we need a card for each movie in the movies array

    for (const movie of movies) {

        //get a copy of the template
        let movieCard = movieCardTemplate.content.cloneNode(true);

        //modify the template with the current movie
        let titleElement = movieCard.querySelector('.card-body > h5');
        titleElement.textContent = movie.title;

        let descriptionElement = movieCard.querySelector('.card-text');
        descriptionElement.textContent = movie.overview;

        let movieImgElement = movieCard.querySelector('.card-img-top');
        movieImgElement.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);

        let infoButton = movieCard.querySelector('.btn-primary');
        infoButton.setAttribute('data-movieId', movie.id);

        let favoriteButton = movieCard.querySelector('.btn-outline-primary');
        favoriteButton.setAttribute('data-movieId', movie.id);

        //addto page

        movieRow.appendChild(movieCard);
    };
}

//when clicks the more info button show a modal
//step1 how to get modal on my scree and data into it
//step2 figure out end point to call
//https://api.themoviedb.org/3/movie/663134 id on button
async function showMovieDetails(button) {

    //get modal and fill it with info
    let movieId = button.getAttribute('data-movieId');

    let movie = await getMovieDetail(movieId);

    if (movie != undefined) {

        document.getElementById('modal-title').textContent = movie.title;
        document.getElementById('modal-movie-title').textContent = movie.title;
        document.getElementById('movie-tagline').textContent = movie.tagline;
        document.getElementById('movie-img').src = `http://image.tmdb.org/t/p/w500${movie.poster_path}`
        document.getElementById('movie-overview').textContent = movie.overview;

        let movieGenres = document.getElementById('movie-genres');
        movieGenres.innerHTML = "";
        //add a trailer with bootstrap video tag in html
        //<span class="badge text-bg-primary">Action</span>

        // this is the same as bottom anon function but just more "proper" rudementary way
        // for (i = 0; i < movie.genres.length; i++)
        // {
        //     let badge = document.createElement('span');
        //     badge.classList.add('badge', 'text-bg-primary');
        //     badge.textContent = movie.genres[i].name;
        //     movieGenres.appendChild(badge);
        // }

        //anon / arrow function that does same as top, adds elements inside the 
        movie.genres.forEach(genre => {
            let badge = document.createElement('span');
            badge.classList.add('badge', 'text-bg-primary');
            badge.textContent = genre.name;
            movieGenres.appendChild(badge); //append badge span elements to movieGenres which we made equal the movie-genres content
        }

        )
    }
    else {
        console.log(error);
        alert("error receiving API data")
    }

    //pop the modal on the page now that we have the data
    const myModal = new bootstrap.Modal('#movie-modal', {
        keyboard: false
    })

    let modalToggle = document.getElementById('movie-modal');
    myModal.show(modalToggle)

}
//call the tmdbapi to get movie detail
//https://api.themoviedb.org/3/movie/663134
async function getMovieDetail(movieId) {

    try {
        const movieDetailUrl = `https://api.themoviedb.org/3/movie/${movieId}`
        //step 1 get URL
        //step 2 call the api the variable response holds the json data response.

        //figure out why object is after await fetch
        let response = await fetch(movieDetailUrl, {

            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (response.ok) {
            let movie = await response.json();
            return movie;
        } else {

            return undefined;

        }

    } catch (error) {
        console.log(error);
        return undefined;
    }


    //return a movie object

}


async function addFavoriteMovie(button) {

    //get movie to add to favorites
    //convert object to string
    //get movie ID
    //get movie detail``
    //store the movies to local storage
    //let the user know we did it
    const movieId = button.getAttribute('data-movieId');
    let movies = getFavoriteMovies();
    

    let duplicateMovie = movies.find(movie => movie.id == movieId); 
    //finds if the id from the button click matches the id in the local storage 
    //if it does it just returns, if not its undefined.

    if (duplicateMovie == undefined) {
        const favoriteMovie = await getMovieDetail(movieId);

        if (favoriteMovie != undefined) {

            //turn movie object into string
            movies.push(favoriteMovie);
            saveFavoriteMovies(movies);
        }
    }
    //what if they press button more than once

}

function getFavoriteMovies() {

    let movieJSON = localStorage.getItem('bac-favorite-movies');
    let favoriteMovies = [];

    if (movieJSON == null) {

        localStorage.setItem('bac-favorite-movies', JSON.stringify(favoriteMovies));

    }
    else {
        favoriteMovies = JSON.parse(movieJSON);
    }

    return favoriteMovies;
}

function saveFavoriteMovies(favoriteMovies) {

    let moviesAsString = JSON.stringify(favoriteMovies);
    localStorage.setItem('bac-favorite-movies', moviesAsString);


}

//step 1 when user clicks more info button show a modal. (fullscreen)
//step 2 call the api make sure content is in the network tab dev tools
//step 3 modify the modal with the movie data/id