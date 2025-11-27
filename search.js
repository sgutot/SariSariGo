// Global search functionality
document.addEventListener('DOMContentLoaded', function() {
    setupGlobalSearch();
});

function setupGlobalSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
        const performGlobalSearch = () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // If on vendors page, search vendors
                if (document.getElementById('vendors-grid')) {
                    loadVendors(searchTerm);
                }
                // If on products page, search products
                else if (document.getElementById('products-grid')) {
                    if (typeof handleSearch === 'function') {
                        handleSearch();
                    }
                }
                // Otherwise, redirect to products page with search term
                else {
                    window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
                }
            }
        };

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performGlobalSearch();
        });
        
        searchBtn.addEventListener('click', performGlobalSearch);
    }
}