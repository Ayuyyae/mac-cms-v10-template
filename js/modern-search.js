document.addEventListener('DOMContentLoaded', () => {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = searchContainer.querySelector('input');
    const searchButton = searchContainer.querySelector('button');

    const toggleSearch = () => {
        searchContainer.classList.toggle('expanded');
        if (searchContainer.classList.contains('expanded')) {
            searchInput.focus();
        } else {
            searchInput.value = ''; // Clear input when closing
            searchInput.blur(); // Remove focus from the input
        }
    };

    searchButton.addEventListener('click', (e) => {
        if (!searchContainer.classList.contains('expanded')) {
            e.preventDefault();
            toggleSearch();
        } else if (!searchInput.value.trim()) {
            e.preventDefault();
            toggleSearch();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && searchContainer.classList.contains('expanded')) {
            toggleSearch();
        }
    });

    // Close search when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContainer.classList.contains('expanded')) {
            toggleSearch();
        }
    });

    // Handle form submission
    searchContainer.closest('form').addEventListener('submit', (e) => {
        if (!searchInput.value.trim()) {
            e.preventDefault();
            toggleSearch();
        }
    });

    // Add event listener for input changes
    searchInput.addEventListener('input', function() {
        if (this.value.trim() && !searchContainer.classList.contains('expanded')) {
            toggleSearch();
        }
    });
});