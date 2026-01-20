window.API_CONFIG = {
    endpoint: "https://h2rhyvpaj1.execute-api.us-east-1.amazonaws.com/prod/weather"
};

let cities = ['Vienna', 'Berlin', 'Paris', 'London'];
let selectedCity = null;
let currentFocusIndex = -1;

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const autocompleteList = document.getElementById('autocompleteList');

searchInput.addEventListener('input', function () {
    const inputValue = this.value.trim();

    if (!inputValue) {
        closeAutocomplete();
        selectedCity = null;
        return;
    }

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
            handleSearch();
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
        selectedCity = items[currentFocusIndex].textContent;
    }
}

// Close list if user clicks away
document.addEventListener('click', (e) => {
    if (e.target !== searchInput) closeAutocomplete();
});

/**
 * Handle Search & Navigation
 */
if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
}

function handleSearch() {
    const inputValue = searchInput.value.trim();
    if (!inputValue) return;

    const finalCity = selectedCity || inputValue;

    const formattedCity = finalCity.charAt(0).toUpperCase() + finalCity.slice(1).toLowerCase();

    console.log(`Navigating to archive for: ${formattedCity}`);
    window.location.href = `city.html?city=${encodeURIComponent(formattedCity)}`;
}