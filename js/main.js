import { movies } from "./data.js";

const movieList = document.querySelector("#movie-list");

function renderMovies() {
  movieList.innerHTML = "";

  for (const movie of movies) {
    const movieCard = document.createElement("article");
    movieCard.classList.add("movie-card");

    const title = document.createElement("h2");
    title.textContent = movie.title;

    const details = document.createElement("p");
    details.textContent = `${movie.genre} - ${movie.year}`;

    const snack = document.createElement("p");
    snack.textContent = `Best snack: ${movie.snack}`;

    const rating = document.createElement("span");
    rating.classList.add("rating");
    rating.textContent = `${movie.rating}/10`;

    movieCard.appendChild(title);
    movieCard.appendChild(details);
    movieCard.appendChild(snack);
    movieCard.appendChild(rating);
    movieList.appendChild(movieCard);
  }
}

renderMovies();
console.log(movies);
