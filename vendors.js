// Vendors Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeVendorsPage();
});

function initializeVendorsPage() {
    // Update auth links and cart count
    if (typeof Utils !== 'undefined') {
        Utils.updateAuthLinks();
        Utils.updateCartCount();
    }
    
    // Load vendors
    loadVendors();
    // Populate debug status if debug area exists
    if (typeof checkDB === 'function') {
        try { checkDB(); } catch (e) { console.warn('checkDB failed on init', e); }
    }
}



function loadVendors(searchTerm = '') {
    const vendorsContainer = document.getElementById('vendors-grid');
    const loadingElement = document.getElementById('loading');
    const noVendorsElement = document.getElementById('no-vendors');
    
    if (!vendorsContainer) return;

    // Show loading
    loadingElement.classList.remove('hidden');
    vendorsContainer.innerHTML = '';
    noVendorsElement.classList.add('hidden');
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
        try {
            const vendors = Utils.getAllVendors();
            
            // Filter by search term
            const filteredVendors = vendors.filter(vendor => {
                if (!searchTerm) return true;
                
                const nameMatch = vendor.name.toLowerCase().includes(searchTerm);
                const descMatch = vendor.storeDescription && vendor.storeDescription.toLowerCase().includes(searchTerm);
                return nameMatch || descMatch;
            });
            
            // Hide loading
            loadingElement.classList.add('hidden');
            
            // Show message if no vendors
            if (filteredVendors.length === 0) {
                noVendorsElement.classList.remove('hidden');
                return;
            }
            
            // Calculate product counts for each vendor
            const productCounts = {};
            DB.products.forEach(product => {
                if (product.active) {
                    productCounts[product.vendorId] = (productCounts[product.vendorId] || 0) + 1;
                }
            });
            
            // Render vendors
            vendorsContainer.innerHTML = filteredVendors.map(vendor => 
                createVendorCard(vendor, productCounts[vendor.id] || 0)
            ).join('');
            
        } catch (error) {
            console.error('Error loading vendors:', error);
            loadingElement.classList.add('hidden');
            showError('Error loading vendors. Please try again.');
        }
    }, 100);
}

function createVendorCard(vendor, productCount) {
    const vendorName = vendor.name || 'Unknown Vendor';
    const vendorDescription = vendor.storeDescription || 'No description available';
    const vendorRating = vendor.rating || 0;
    const vendorLogo = vendor.storeLogo || 'https://via.placeholder.com/100x100?text=Store';
    
    // Use centralized star renderer for consistent icons
    const stars = (typeof Utils !== 'undefined' && typeof Utils.generateStarRating === 'function') ? Utils.generateStarRating(vendorRating) : ('★'.repeat(Math.floor(vendorRating)) + (vendorRating % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.floor(vendorRating) - (vendorRating % 1 >= 0.5 ? 1 : 0)));
    
    // Determine whether the current user is a vendor
    const isVendor = (typeof AppState !== 'undefined' && AppState.currentUser && AppState.currentUser.role === 'vendor');

    // Buttons: vendors see Products + Orders + Account, buyers/guests see only Products
    const buttonsHtml = isVendor ? `
            <div class="mt-4 grid grid-cols-3 gap-2 w-full">
                <button onclick="viewVendorProducts(${vendor.id})" 
                    class="col-span-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition duration-300">
                    <i class="fas fa-store mr-2"></i>Products
                </button>
            </div>
        ` : `
            <div class="mt-4 w-full">
                <button onclick="viewVendorProducts(${vendor.id})" 
                    class="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition duration-300">
                    <i class="fas fa-store mr-2"></i>Products
                </button>
            </div>
        `;

    return `
        <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition duration-300">
            <img src="${vendorLogo}" 
                 alt="${vendorName}" 
                 class="h-20 w-20 rounded-full object-cover mb-4 border-2 border-gray-200"
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/100x100?text=Store'">
            <h3 class="text-xl font-bold text-gray-800">${vendorName}</h3>
            <p class="text-gray-600 mt-2 line-clamp-2 h-12 overflow-hidden">${vendorDescription}</p>
            <div class="mt-4 flex items-center">
                <span class="text-yellow-500 text-lg">${stars}</span>
                <span class="text-gray-500 ml-2">${(Number(vendorRating) || 0).toFixed(1)}/5.0</span>
            </div>
            <p class="text-sm text-gray-500 mt-2">${productCount} product${productCount !== 1 ? 's' : ''} available</p>

            ${buttonsHtml}
        </div>
    `;
}

function goToVendorOrders(vendorId) {
    // Redirect to vendor orders page; vendor page will handle auth/role check
    window.location.href = `vendor-orders.html?vendor=${vendorId}`;
}

function goToVendorAccount(vendorId) {
    // Redirect to vendor account page; vendor page will handle auth/role check
    window.location.href = `vendor-account.html?vendor=${vendorId}`;
}

function viewVendorProducts(vendorId) {
    // Redirect to products page with vendor filter
    window.location.href = `products.html?vendor=${vendorId}`;
}

function showError(message) {
    const vendorsContainer = document.getElementById('vendors-grid');
    vendorsContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 class="text-xl font-bold text-gray-800">Error Loading Vendors</h3>
            <p class="text-gray-600 mt-2">${message}</p>
            <button onclick="loadVendors()" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Try Again
            </button>
        </div>
    `;
}

// Debug helper: update the Debug Information area (`#db-status`) and return status
function checkDB() {
    const statusEl = document.getElementById('db-status');
    if (!statusEl) return;

    try {
        const parts = [];

        if (typeof DB !== 'undefined' && DB) {
            const prodCount = Array.isArray(DB.products) ? DB.products.length : 'N/A';
            const userCount = Array.isArray(DB.users) ? DB.users.length : 'N/A';
            parts.push(`DB loaded: ${prodCount} products, ${userCount} users`);
        } else {
            parts.push('DB not found');
        }

        if (typeof Utils !== 'undefined') {
            parts.push('Utils available');
        } else {
            parts.push('Utils missing');
        }

        try {
            const storage = localStorage.getItem('sariSariGoDB');
            parts.push(storage ? 'localStorage DB present' : 'localStorage DB empty');
        } catch (e) {
            parts.push('localStorage inaccessible');
        }

        statusEl.textContent = parts.join(' · ');
    } catch (err) {
        console.error('checkDB error', err);
        statusEl.textContent = 'Error checking DB (see console)';
    }
}
