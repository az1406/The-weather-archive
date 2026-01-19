/**
 * AWS API Configuration
 */
window.API_CONFIG = {
    // This points to your single Lambda via API Gateway
    endpoint: "https://nwpe0mn5a6.execute-api.us-east-1.amazonaws.com/prod/weather"
};

// Global State
let cities = ['Vienna', 'Berlin', 'Paris', 'London'];
let selectedCity = null;
let currentFocusIndex = -1;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const autocompleteList = document.getElementById('autocompleteList');

/**
 * User Story 2: Check backend connectivity
 */
async function fetchCities() {
    try {
        if (!window.API_CONFIG || !window.API_CONFIG.endpoint) return;

        // We call the API for Vienna just to verify the DB is reachable
        const response = await fetch(`${window.API_CONFIG.endpoint}?city=Vienna`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const data = await response.json();

        // Logic: If the database returns a city name we don't have, add it to the search list
        if (data.city && !cities.includes(data.city)) {
            cities.push(data.city);
            console.log("Database city confirmed and synced:", data.city);
        }
    } catch (error) {
        console.warn('Note: API reachable but no new cities found. Using defaults.', error);
    }
}

// Initialization
fetchCities();

/**
 * Autocomplete Logic
 */
searchInput.addEventListener('input', function () {
    const inputValue = this.value.trim();

    if (!inputValue) {
        closeAutocomplete();
        selectedCity = null;
        return;
    }

    // Filter cities based on user typing
    const filteredCities = cities.filter(city =>
        city.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    showAutocomplete(filteredCities);
});

function showAutocomplete(filteredCities) {
    closeAutocomplete();
    if (filteredCities.length === 0) return;

    filteredCities.forEach((city) => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = city;

        item.addEventListener('click', function () {
            searchInput.value = city;
            selectedCity = city;
            closeAutocomplete();
            handleSearch(); // Auto-search on click
        });

        autocompleteList.appendChild(item);
    });

    autocompleteList.classList.remove('hidden');
}

function closeAutocomplete() {
    autocompleteList.innerHTML = '';
    autocompleteList.classList.add('hidden');
    currentFocusIndex = -1;
}

/**
 * Keyboard & Search Navigation
 */
searchInput.addEventListener('keydown', function (e) {
    const items = autocompleteList.getElementsByClassName('autocomplete-item');

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentFocusIndex = (currentFocusIndex + 1) % items.length;
        setActive(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentFocusIndex = (currentFocusIndex - 1 + items.length) % items.length;
        setActive(items);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocusIndex > -1 && items[currentFocusIndex]) {
            items[currentFocusIndex].click();
        } else {
            handleSearch();
        }
    }
});

function setActive(items) {
    if (!items.length) return;
    for (let item of items) item.classList.remove('selected');

    if (currentFocusIndex >= 0) {
        items[currentFocusIndex].classList.add('selected');
        // Do not update input value while scrolling so user can keep typing
        selectedCity = items[currentFocusIndex].textContent;
    }
}

// Close list if user clicks away
document.addEventListener('click', (e) => {
    if (e.target !== searchInput) closeAutocomplete();
});

/**
 * User Story 5: Handle Search & Navigation
 */
if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
}

function handleSearch() {
    const inputValue = searchInput.value.trim();
    if (!inputValue) return;

    // Use the selected city from autocomplete OR the typed value
    const finalCity = selectedCity || inputValue;

    // Direct redirection to the city page with the parameter
    // We format it to ensure the first letter is Uppercase (e.g. "london" -> "London")
    const formattedCity = finalCity.charAt(0).toUpperCase() + finalCity.slice(1).toLowerCase();

    console.log(`Navigating to archive for: ${formattedCity}`);
    window.location.href = `city.html?city=${encodeURIComponent(formattedCity)}`;
}