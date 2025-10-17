const apiKey = '1d775753';
const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}`;

const searchForm = document.getElementById('searchForm');
const titleInput = document.getElementById('title');
const typeSelect = document.getElementById('type');
const resultsDiv = document.getElementById('results');
const paginationDiv = document.getElementById('pagination');
const detailsDiv = document.getElementById('details');
const messageCenter = document.getElementById('message-center');
const filmsHeader = document.getElementById('filmsHeader');
const infoHeader = document.getElementById('infoHeader');

let currentSearchTitle = '';
let currentSearchType = '';
let currentPage = 1;

searchForm.addEventListener('submit', handleSearchSubmit);

function handleSearchSubmit(e) {
    e.preventDefault();
    const title = titleInput.value.trim();
    if (!title) return;
    
    currentSearchTitle = title;
    currentSearchType = typeSelect.value;
    currentPage = 1;
    
    fetchAndDisplayMovies();
}

async function fetchAndDisplayMovies() {
    clearAllViews();
    showMessage('Шукаємо...');
    
    const url = `${apiUrl}&s=${currentSearchTitle}&type=${currentSearchType}&page=${currentPage}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        hideMessage();

        if (data.Response === "True") {
            displayMovies(data.Search);
            displayPagination(parseInt(data.totalResults));
        } else {
            showMessage(data.Error);
        }
    } catch (error) {
        showMessage('Сталася помилка.');
    }
}

function displayMovies(movies) {
    filmsHeader.classList.remove('hidden');
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        resultsDiv.appendChild(movieCard);
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const poster = movie.Poster === 'N/A' ? 'https://placehold.co/300x450'
        : movie.Poster;

    card.innerHTML = `
        <img src="${poster}" alt="${movie.Title} Poster">
        <div class="movie-info">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="fetchAndDisplayDetails('${movie.imdbID}')">Детальніше</button>
        </div>
    `;
    return card;
}

function displayPagination(totalResults) {
    const totalPages = Math.ceil(totalResults / 10);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const button = createPaginationButton(i);
        paginationDiv.appendChild(button);
    }
}

function createPaginationButton(pageNumber) {
    const button = document.createElement('button');
    button.innerText = pageNumber;
    if (pageNumber === currentPage) {
        button.className = 'active';
    }
    button.addEventListener('click', () => {
        currentPage = pageNumber;
        fetchAndDisplayMovies();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return button;
}

async function fetchAndDisplayDetails(id) {
    detailsDiv.innerHTML = '';
    infoHeader.classList.add('hidden');

    detailsDiv.style.display = 'grid';
    
    const url = `${apiUrl}&i=${id}`;
    
    try {
        const response = await fetch(url);
        const movie = await response.json();
        const detailsContent = createDetailsView(movie);
        detailsDiv.appendChild(detailsContent);
        infoHeader.classList.remove('hidden');
        detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        detailsDiv.innerHTML = `<p>Сталася помилка.</p>`;
    }

    let btnClose = document.createElement('button');
    btnClose.onclick = function () { detailsDiv.innerHTML = ''; detailsDiv.style.display = 'none';}
    btnClose.innerText = 'Закрити';
    detailsDiv.appendChild(btnClose);
}

function createDetailsView(movie) {
    const view = document.createElement('div');
    const poster = movie.Poster === 'N/A' ? 'https://placehold.co/300x450' : movie.Poster;
    
    view.innerHTML = `
        <img src="${poster}" alt="${movie.Title} Poster">
        <div class="info-list">
            <h3>${movie.Title}</h3>
            <p><span>Дата виходу:</span> ${movie.Released}</p>
            <p><span>Жанр:</span> ${movie.Genre}</p>
            <p><span>Країна:</span> ${movie.Country}</p>
            <p><span>Директор:</span> ${movie.Director}</p>
            <p><span>Режисер:</span> ${movie.Writer}</p>
            <p><span>Актори:</span> ${movie.Actors}</p>
            <p><span>Призи:</span> ${movie.Awards}</p>
            <p><span>Сюжет:</span> ${movie.Plot}</p>
        </div>
    `;
    return view;
}

function clearAllViews() {
    resultsDiv.innerHTML = '';
    paginationDiv.innerHTML = '';
    detailsDiv.innerHTML = '';
    filmsHeader.classList.add('hidden');
    infoHeader.classList.add('hidden');
    hideMessage();
}

function showMessage(text) {
    messageCenter.textContent = text;
    messageCenter.classList.remove('hidden');
}

function hideMessage() {
    messageCenter.classList.add('hidden');
}