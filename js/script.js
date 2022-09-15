let elMovieList = $(".js-movies-list");
let elMovieTemplate = $("#js-movie-template").content;

let elSearchForm = $(".js-search-form");
let elSearchInput = $(".js-search-input", elSearchForm);

let elMovieModal = $(".js-movie-modal");

const elSpinner = document.querySelector(".spinner");

const elButtons = $(".js-page-buttons");
const elNextButton = $(".js-next-button");
const elPrevButton = $(".js-prev-button");


let renderMovies = data => {
  elMovieList.innerHTML = '';

  let elWrapperMovie = document.createDocumentFragment()

  data.forEach(film => {
    let elMovieClone = elMovieTemplate.cloneNode(true);

    elMovieClone.querySelector('.js-movie-img').src = film.Poster;
    elMovieClone.querySelector('.js-movie-img').alt = film.Title;
    elMovieClone.querySelector('.js-result').dataset.movieId = film.imdbID;
    elMovieClone.querySelector('.js-movie-title').textContent = film.Title;

    elWrapperMovie.appendChild(elMovieClone);
  })

  elMovieList.appendChild(elWrapperMovie);
}


const movieToSee = async title => {
  try {
    let res = await fetch (`https://www.omdbapi.com/?apikey=83a076fe&s=${title}&page=${later}`).finally(addLoader);

    let data = await res.json();
    renderMovies(data.Search);

    elMovieList.addEventListener('click', evt => {
      if (evt.target.matches('.js-movie-more-button')) {
        let movieId = evt.target.closest(".js-result").dataset.movieId;

        let dataFindMovie = data.Search.find(movie => {
          return movie.imdbID === movieId;
        })

        $('.js-modal-title', elMovieModal).textContent = `Movie: ${dataFindMovie.Title}`;
        $('.js-modal-year', elMovieModal).textContent = `Year: ${dataFindMovie.Year}`;
        $('.js-modal-type', elMovieModal).textContent = `Type: ${dataFindMovie.Type}`;
      }
    })
    let maxResult = 0;
    maxResult = Number(data.totalResults);
    now = maxResult;
  } catch (err) {
    catchErrors();
  }
}


let catchErrors = () => {
  elMovieList.innerHTML = '';

  let elErrorElement = document.createElement("li");

  elErrorElement.innerHTML = `
  <h2 class="bg-danger">We don't have this movie!</h2>`

  elMovieList.appendChild(elErrorElement);
}


let now = 0;
let later = 1;

elSearchForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  elMovieList.innerHTML = '';
  removeLoader();

  let elInputValue = elSearchInput.value.trim();

  movieToSee(elInputValue);

  elSearchInput.value = '';

  elButtons.classList.add('d-block');
  elButtons.classList.remove('d-none');

  elNextButton.addEventListener('click', () => {
    if (later < Math.ceil(now/10)) {
      later += 1;
      movieToSee(elInputValue);
    }
  })

  elPrevButton.addEventListener('click', () => {
    if (later > 1) {
      later -= 1;
      movieToSee(elInputValue);
    }
  })
})

function removeLoader() {
  elSpinner.classList.remove("d-none");
}

function addLoader() {
  elSpinner.classList.add("d-none");
}