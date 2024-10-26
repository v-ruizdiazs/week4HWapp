const apiKey = ''; // Reemplaza esto con tu API Key de TMDB
const movieList = document.getElementById('movie-list');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const pagination = document.getElementById('pagination');
let currentPage = 1; // Página actual
let totalPages = 1; // Total de páginas
let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Favoritos guardados

// Función para buscar películas
async function searchMovies(query, page = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
    const response = await fetch(url);

    if (response.ok) {
        const data = await response.json();
        totalPages = data.total_pages; // Total de páginas
        displayMovies(data.results); // Mostrar películas
        displayPagination(); // Mostrar paginación
    } else {
        movieList.innerHTML = '<p>Error al buscar películas.</p>'; // Mensaje de error
    }
}

// Función para mostrar películas
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpiar lista
    if (movies.length === 0) {
        movieList.innerHTML = '<p>No se encontraron películas.</p>'; // Mensaje si no hay películas
        return;
    }
    
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <h2>${movie.title}</h2>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <button onclick="toggleFavorite(${movie.id})">
                ${favorites.includes(movie.id) ? 'Eliminar de Favoritos' : 'Agregar a Favoritos'}
            </button>
        `;
        movieList.appendChild(movieItem);
    });
}

// Función para agregar o eliminar favoritos
function toggleFavorite(movieId) {
    if (favorites.includes(movieId)) {
        favorites = favorites.filter(id => id !== movieId); // Eliminar favorito
    } else {
        favorites.push(movieId); // Agregar a favoritos
    }
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Guardar en localStorage
    displayMovies([...document.querySelectorAll('.movie-item')]); // Actualizar lista
}

// Función para mostrar paginación
function displayPagination() {
    pagination.innerHTML = ''; // Limpiar paginación
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = () => changePage(i);
        pagination.appendChild(pageButton);
    }
}

// Cambiar de página
function changePage(page) {
    currentPage = page; // Actualiza la página actual
    searchMovies(searchInput.value, currentPage); // Busca películas en la nueva página
}

// Evento de búsqueda
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        currentPage = 1; // Reiniciar a la primera página
        searchMovies(query); // Buscar películas
    } else {
        movieList.innerHTML = '<p>Por favor, ingresa un término de búsqueda.</p>'; // Mensaje de error
    }
});
