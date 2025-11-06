// Static list of cities (simulating autocomplete data)
const cities = ['Vienna', 'Berlin', 'Paris', 'London'];

let selectedCity = null;
let currentFocusIndex = -1;

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const autocompleteList = document.getElementById('autocompleteList');
const errorMessage = document.getElementById('errorMessage');

// Input event listener for autocomplete
searchInput.addEventListener('input', function() {
    const inputValue = this.value.trim();

    // Hide error message when typing
    errorMessage.classList.add('hidden');

    // Clear autocomplete if input is empty
    if (!inputValue) {
        closeAutocomplete();
        selectedCity = null;
        return;
    }

    // Filter cities based on input
    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Show autocomplete results
    showAutocomplete(filteredCities);
    selectedCity = null;
});

// Function to show autocomplete results
function showAutocomplete(filteredCities) {
    closeAutocomplete();

    if (filteredCities.length === 0) {
        return;
    }

    filteredCities.forEach((city, index) => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = city;

        // Click event for selecting a city
        item.addEventListener('click', function() {
            searchInput.value = city;
            selectedCity = city;
            closeAutocomplete();
        });

        autocompleteList.appendChild(item);
    });

    autocompleteList.classList.remove('hidden');
}

// Function to close autocomplete
function closeAutocomplete() {
    autocompleteList.innerHTML = '';
    autocompleteList.classList.add('hidden');
    currentFocusIndex = -1;
}

// Close autocomplete when clicking outside
document.addEventListener('click', function(e) {
    if (e.target !== searchInput && e.target !== autocompleteList) {
        closeAutocomplete();
    }
});

// Keyboard navigation for autocomplete
searchInput.addEventListener('keydown', function(e) {
    const items = autocompleteList.getElementsByClassName('autocomplete-item');

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentFocusIndex++;
        if (currentFocusIndex >= items.length) currentFocusIndex = 0;
        setActive(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentFocusIndex--;
        if (currentFocusIndex < 0) currentFocusIndex = items.length - 1;
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

// Set active item in autocomplete
function setActive(items) {
    if (!items || items.length === 0) return;

    // Remove selected class from all items
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('selected');
    }

    // Add selected class to current item
    if (currentFocusIndex >= 0 && currentFocusIndex < items.length) {
        items[currentFocusIndex].classList.add('selected');
        searchInput.value = items[currentFocusIndex].textContent;
        selectedCity = items[currentFocusIndex].textContent;
    }
}

// Search button click handler
searchButton.addEventListener('click', handleSearch);

// Handle search
function handleSearch() {
    const inputValue = searchInput.value.trim();

    // Check if the input matches a valid city
    const isValidCity = cities.some(city =>
        city.toLowerCase() === inputValue.toLowerCase()
    );

    if (!isValidCity || !selectedCity) {
        // Show error message
        errorMessage.classList.remove('hidden');
        return;
    }

    // Navigate to city page
    window.location.href = `city.html?city=${encodeURIComponent(selectedCity)}`;
}

