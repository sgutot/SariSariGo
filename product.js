// Products Page Functionality with Enhanced Recommendations
document.addEventListener('DOMContentLoaded', function() {
    // Load featured products on home page
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }

    // Load all products on products page
    if (document.getElementById('products-grid')) {
        initializeProductsPage();
    }

    // Load categories on home page
    if (document.getElementById('categories-grid')) {
        loadHomepageCategories();
    }
    
    // Initialize product ratings
    initializeProductRatings();
});

function initializeProductsPage() {
    // Load categories
    loadCategories();
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('vendor');
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    if (vendorId) {
        const vendor = Utils.getVendorById(parseInt(vendorId));
        if (vendor) {
            renderVendorHeader(vendor);
        }
    }
    
    // Load products with URL parameters
    let initialCategory = 'All';
    let initialSearch = searchParam || '';
    
    // If category parameter exists, set it as active
    if (categoryParam) {
        initialCategory = categoryParam;
        setTimeout(() => {
            const categoryButton = document.querySelector(`[data-category="${categoryParam}"]`);
            if (categoryButton) {
                document.querySelectorAll('.category-filter-btn').forEach(btn => {
                    btn.classList.remove('filter-nav-active', 'bg-green-500', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                });
                categoryButton.classList.add('filter-nav-active', 'bg-green-500', 'text-white');
                categoryButton.classList.remove('bg-gray-200', 'text-gray-700');
            }
        }, 100);
    }
    
    // Load products with the correct category and search
    loadAllProducts(initialCategory, initialSearch);
    
    setupSearch();
    
    // Handle search parameter if present
    if (searchParam) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = searchParam;
        }
    }
}

function renderVendorHeader(vendor) {
    const vendorHeader = document.getElementById('vendor-header');
    if (!vendorHeader) return;

    vendorHeader.classList.remove('hidden');
    vendorHeader.innerHTML = `
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <div class="flex items-center space-x-6">
                <img src="${vendor.storeLogo || 'https://via.placeholder.com/100x100?text=Store'}" 
                     alt="${vendor.name}" 
                     class="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                     onerror="this.src='https://via.placeholder.com/100x100?text=Store'">
                <div class="flex-1">
                    <h2 class="text-3xl font-bold mb-2">${vendor.name}</h2>
                    <p class="text-purple-100 text-lg mb-3">${vendor.storeDescription || ''}</p>
                    <p class="text-sm opacity-90">
                        <i class="fas fa-map-marker-alt mr-2"></i> 
                        ${vendor.storeAddress || 'Address not provided'}
                    </p>
                </div>
                <div class="text-right">
                    <div class="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
                        <div class="text-yellow-300 text-2xl mb-1">
                            ${'★'.repeat(Math.floor(vendor.rating || 0))}${(vendor.rating || 0) % 1 >= 0.5 ? '½' : ''}
                        </div>
                        <div class="text-white font-semibold">${vendor.rating || '0'}/5.0</div>
                        <div class="text-purple-100 text-sm mt-1">Vendor Rating</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    // Get random featured products instead of first 8
    const featuredProducts = [...DB.products]
        .filter(p => p.active)
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
    
    if (featuredContainer) {
        featuredContainer.innerHTML = featuredProducts.map(product => 
            createProductCard(product)
        ).join('');
    }
}

// Load categories for homepage
function loadHomepageCategories() {
    const categoriesContainer = document.getElementById('categories-grid');
    if (!categoriesContainer) return;

    const categories = DB.categories;
    
    if (categories.length === 0) {
        categoriesContainer.innerHTML = '<p class="col-span-full text-center text-gray-500">No categories available</p>';
        return;
    }

    // Create modern category cards
    categoriesContainer.innerHTML = categories.map(category => {
        const icon = getCategoryIcon(category);
        const productCount = DB.products.filter(p => p.category === category && p.active).length;
        const colors = ['from-green-500 to-blue-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-red-500', 'from-blue-500 to-purple-500'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        return `
            <a href="products.html?category=${encodeURIComponent(category)}" 
               class="category-card bg-gradient-to-br ${randomColor} rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-white hover:scale-105">
                <div class="text-5xl mb-4 opacity-90">
                    ${icon}
                </div>
                <h3 class="font-bold text-xl mb-2">${category}</h3>
                <p class="text-white text-opacity-80">${productCount} products</p>
                <div class="mt-4 w-8 h-1 bg-white bg-opacity-50 rounded-full"></div>
            </a>
        `;
    }).join('');
}

// Helper function to get appropriate icons for categories
function getCategoryIcon(category) {
    const iconMap = {
        'Pantry': '<i class="fas fa-utensils"></i>',
        'Beverages': '<i class="fas fa-wine-bottle"></i>',
        'Snacks': '<i class="fas fa-cookie-bite"></i>',
        'Household': '<i class="fas fa-home"></i>',
        'Canned Foods': '<i class="fas fa-can-food"></i>',
    };
    
    return iconMap[category] || '<i class="fas fa-shopping-basket"></i>';
}

function loadCategories() {
    const filterContainer = document.querySelector('.flex-wrap.gap-2');
    if (!filterContainer) return;

    const categories = DB.categories;
    const categoryButtons = categories.map(category => 
        `<button class="category-filter-btn px-6 py-3 rounded-full bg-white text-gray-700 hover:bg-green-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200" data-category="${category}">
            <i class="${getCategoryIcon(category).match(/fa-[a-z-]+/)[0]} mr-2"></i>
            ${category}
        </button>`
    ).join('');
    
    const allButton = filterContainer.querySelector('[data-category="All"]');
    if (allButton) {
        allButton.insertAdjacentHTML('afterend', categoryButtons);
    }

    // Add event listeners to category buttons
    document.querySelectorAll('.category-filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('.category-filter-btn').forEach(btn => {
                btn.classList.remove('filter-nav-active', 'bg-green-500', 'text-white', 'shadow-md');
                btn.classList.add('bg-white', 'text-gray-700', 'shadow-sm');
            });
            this.classList.add('filter-nav-active', 'bg-green-500', 'text-white', 'shadow-md');
            this.classList.remove('bg-white', 'text-gray-700', 'shadow-sm');
            
            // Load products with selected category
            const category = this.dataset.category;
            const url = new URL(window.location);
            if (category === 'All') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.pushState({}, '', url);
            
            loadAllProducts(category);
        });
    });

    // Set initial active category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const categoryButton = document.querySelector(`[data-category="${categoryParam}"]`);
        if (categoryButton) {
            document.querySelectorAll('.category-filter-btn').forEach(btn => {
                btn.classList.remove('filter-nav-active', 'bg-green-500', 'text-white', 'shadow-md');
                btn.classList.add('bg-white', 'text-gray-700', 'shadow-sm');
            });
            categoryButton.classList.add('filter-nav-active', 'bg-green-500', 'text-white', 'shadow-md');
            categoryButton.classList.remove('bg-white', 'text-gray-700', 'shadow-sm');
        }
    }
}

function loadAllProducts(category = 'All', searchTerm = '') {
    const productsContainer = document.getElementById('products-grid');
    const noProductsElement = document.getElementById('no-products');
    if (!productsContainer) return;
    
    let filteredProducts = DB.products.filter(p => p.active);

    // Filter by vendor if viewing vendor-specific products
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('vendor');
    if (vendorId) {
        filteredProducts = filteredProducts.filter(p => p.vendorId === parseInt(vendorId));
    }

    // Filter by category
    if (category !== 'All') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filteredProducts.length === 0) {
        productsContainer.classList.add('hidden');
        noProductsElement.classList.remove('hidden');
        noProductsElement.innerHTML = `
            <div class="text-center py-16">
                <div class="text-6xl text-gray-300 mb-4">
                    <i class="fas fa-search"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-600 mb-2">No products found</h3>
                <p class="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button onclick="clearFilters()" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
                    Clear Filters
                </button>
            </div>
        `;
    } else {
        productsContainer.classList.remove('hidden');
        noProductsElement.classList.add('hidden');
        productsContainer.innerHTML = filteredProducts.map(product => 
            createProductCard(product)
        ).join('');
    }
}

function createProductCard(product) {
    const vendor = Utils.getVendorById(product.vendorId);
    const isLowStock = product.stock < 10;
    const isOutOfStock = product.stock === 0;
    const stockColor = isOutOfStock ? 'red' : isLowStock ? 'yellow' : 'green';
    const averageRating = calculateProductAverageRating(product.id);
    
    return `
        <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer group border border-gray-100">
            <div class="relative overflow-hidden">
                <img src="${product.imageUrl}" alt="${product.name}" 
                     class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="absolute top-3 right-3">
                    <span class="bg-${stockColor}-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ${isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div class="flex space-x-2">
                        <button onclick="event.stopPropagation(); viewProductDetails(${product.id})" 
                                class="bg-white text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center shadow-lg">
                            <i class="fas fa-eye mr-2"></i> Quick View
                        </button>
                        <button onclick="event.stopPropagation(); Cart.buyNow(${product.id})" 
                                class="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center shadow-lg ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${isOutOfStock ? 'disabled' : ''}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="p-5 flex flex-col flex-grow">
                <div class="flex-grow">
                    <div class="flex items-start justify-between mb-2">
                        <h3 class="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-1">${product.name}</h3>
                        <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">${product.category}</span>
                    </div>
                    <p class="text-sm text-gray-500 mb-2 flex items-center">
                        <i class="fas fa-store mr-2 text-gray-400"></i>
                        ${vendor ? vendor.name : 'Unknown Vendor'}
                    </p>
                    
                    <!-- Product Rating -->
                    <div class="flex items-center mb-3">
                        <div class="flex text-yellow-400 text-sm">
                            ${generateStarRating(averageRating)}
                        </div>
                        <span class="text-xs text-gray-600 ml-2">${averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}</span>
                        <span class="text-xs text-gray-400 ml-2">(${getProductRatingCount(product.id)})</span>
                    </div>
                    
                    <p class="text-sm text-gray-600 mb-4 line-clamp-2">${product.description}</p>
                </div>
                
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                        <span class="text-2xl font-bold text-green-600">${Utils.formatPrice(product.price)}</span>
                        <p class="text-xs ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-yellow-500' : 'text-gray-500'} mt-1">
                            <i class="fas fa-box mr-1"></i>
                            ${isOutOfStock ? 'Out of stock' : `${product.stock} available`}
                        </p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="event.stopPropagation(); viewProductDetails(${product.id})" 
                                class="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-2 rounded-xl text-sm transition-colors flex items-center">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="event.stopPropagation(); Cart.addToCart(${product.id})" 
                                class="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${isOutOfStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus mr-1"></i>
                        </button>
                        <button onclick="event.stopPropagation(); Cart.buyNow(${product.id})" 
                                class="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${isOutOfStock ? 'disabled' : ''}>
                            Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Enhanced product details with recommendations
function viewProductDetails(productId) {
    const product = DB.products.find(p => p.id === productId);
    if (!product) {
        Utils.showNotification('Product not found', 'error');
        return;
    }
    
    const vendor = Utils.getVendorById(product.vendorId);
    const recommendations = loadProductRecommendations(productId);
    const averageRating = calculateProductAverageRating(productId);
    const ratingCount = getProductRatingCount(productId);
    const userRating = getUserProductRating(productId);
    
    // Create a modern modal for product details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-start mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">${product.name}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div class="space-y-4">
                        <img src="${product.imageUrl}" alt="${product.name}" 
                             class="w-full h-96 object-cover rounded-2xl shadow-lg"
                             onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                        
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-green-50 p-4 rounded-2xl text-center">
                                <i class="fas fa-tag text-green-600 text-xl mb-2"></i>
                                <p class="font-semibold text-green-700">${product.category}</p>
                            </div>
                            <div class="bg-blue-50 p-4 rounded-2xl text-center">
                                <i class="fas fa-box text-blue-600 text-xl mb-2"></i>
                                <p class="font-semibold text-blue-700">${product.stock} in stock</p>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-2xl text-center">
                                <i class="fas fa-store text-purple-600 text-xl mb-2"></i>
                                <p class="font-semibold text-purple-700">${vendor ? vendor.name : 'Vendor'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <!-- Product Rating Section -->
                        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                            <h3 class="text-xl font-semibold text-gray-800 mb-3">Customer Reviews</h3>
                            <div class="flex items-center justify-between mb-4">
                                <div class="text-center">
                                    <div class="text-4xl font-bold text-gray-800">${averageRating > 0 ? averageRating.toFixed(1) : '0.0'}</div>
                                    <div class="flex text-yellow-400 text-lg mt-1">
                                        ${generateStarRating(averageRating)}
                                    </div>
                                    <div class="text-sm text-gray-600 mt-1">${ratingCount} review${ratingCount !== 1 ? 's' : ''}</div>
                                </div>
                                <div class="flex-1 ml-6">
                                    ${AppState.currentUser && AppState.currentUser.role === 'buyer' ? `
                                        <div id="user-rating-section">
                                            <p class="text-sm font-medium text-gray-700 mb-2">Your Rating:</p>
                                            <div class="flex space-x-1 mb-3">
                                                ${[1,2,3,4,5].map(star => `
                                                    <button onclick="rateProduct(${productId}, ${star})" 
                                                            class="text-2xl ${star <= (userRating || 0) ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors">
                                                        ★
                                                    </button>
                                                `).join('')}
                                            </div>
                                            ${userRating ? `
                                                <p class="text-sm text-green-600">You rated this ${userRating} star${userRating !== 1 ? 's' : ''}</p>
                                            ` : '<p class="text-sm text-gray-500">Click to rate this product</p>'}
                                        </div>
                                    ` : `
                                        <p class="text-sm text-gray-600">Login as buyer to rate this product</p>
                                    `}
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-3">Description</h3>
                            <p class="text-gray-600 leading-relaxed">${product.description}</p>
                        </div>
                        
                        <div class="bg-gray-50 p-6 rounded-2xl">
                            <h3 class="text-xl font-semibold text-gray-800 mb-3">Vendor Information</h3>
                            <div class="flex items-center space-x-4 mb-4">
                                <img src="${vendor?.storeLogo || 'https://via.placeholder.com/60x60?text=Store'}" 
                                     alt="${vendor?.name}" 
                                     class="w-16 h-16 rounded-xl object-cover"
                                     onerror="this.src='https://via.placeholder.com/60x60?text=Store'">
                                <div>
                                    <p class="font-semibold text-gray-800">${vendor?.name || 'Unknown Vendor'}</p>
                                    <p class="text-sm text-gray-600">${vendor?.storeAddress || 'Address not provided'}</p>
                                </div>
                            </div>
                            <p class="text-gray-600 text-sm">${vendor?.storeDescription || 'No description available'}</p>
                        </div>
                        
                        <div class="flex items-center justify-between pt-6 border-t">
                            <div>
                                <span class="text-4xl font-bold text-green-600">${Utils.formatPrice(product.price)}</span>
                                <p class="text-sm text-gray-500 mt-1">Price per item</p>
                            </div>
                            <div class="flex space-x-3">
                                <button onclick="Cart.addToCart(${product.id}); this.closest('.fixed').remove()" 
                                        class="bg-green-500 text-white hover:bg-green-600 px-8 py-4 rounded-xl font-semibold transition-colors flex items-center shadow-lg ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                                        ${product.stock === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-cart-plus mr-2"></i> Add to Cart
                                </button>
                                <button onclick="Cart.buyNow(${product.id}); this.closest('.fixed').remove()" 
                                        class="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-colors flex items-center shadow-lg ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                                        ${product.stock === 0 ? 'disabled' : ''}>
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Recommendations Section -->
                ${recommendations.length > 0 ? `
                <div class="border-t pt-8">
                    <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-star text-yellow-500 mr-3"></i>
                        You Might Also Like
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        ${recommendations.map(recProduct => {
                            const recVendor = Utils.getVendorById(recProduct.vendorId);
                            const isRecOutOfStock = recProduct.stock === 0;
                            const recAverageRating = calculateProductAverageRating(recProduct.id);
                            return `
                                <div class="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                                     onclick="this.closest('.fixed').remove(); viewProductDetails(${recProduct.id})">
                                    <div class="relative mb-3">
                                        <img src="${recProduct.imageUrl}" alt="${recProduct.name}" 
                                             class="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                                             onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                                        ${isRecOutOfStock ? `
                                            <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                                Out of Stock
                                            </div>
                                        ` : ''}
                                    </div>
                                    <h4 class="font-semibold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-1">${recProduct.name}</h4>
                                    <p class="text-sm text-gray-500 mb-1">${recVendor?.name || 'Vendor'}</p>
                                    <div class="flex items-center mb-2">
                                        <div class="flex text-yellow-400 text-xs">
                                            ${generateStarRating(recAverageRating)}
                                        </div>
                                        <span class="text-xs text-gray-600 ml-1">${recAverageRating > 0 ? recAverageRating.toFixed(1) : ''}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-green-600 font-bold">${Utils.formatPrice(recProduct.price)}</span>
                                        <button onclick="event.stopPropagation(); Cart.addToCart(${recProduct.id})" 
                                                class="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition ${isRecOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}"
                                                ${isRecOutOfStock ? 'disabled' : ''}>
                                            <i class="fas fa-cart-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function loadProductRecommendations(currentProductId) {
    const currentProduct = DB.products.find(p => p.id === currentProductId);
    if (!currentProduct) return [];

    // Get products from same category, excluding current product
    let recommendedProducts = DB.products.filter(p => 
        p.id !== currentProductId && 
        p.category === currentProduct.category && 
        p.active
    );

    // If not enough same-category products, get products from same vendor
    if (recommendedProducts.length < 4) {
        const sameVendorProducts = DB.products.filter(p => 
            p.id !== currentProductId && 
            p.vendorId === currentProduct.vendorId &&
            !recommendedProducts.some(rp => rp.id === p.id) &&
            p.active
        );
        recommendedProducts.push(...sameVendorProducts);
    }

    // If still not enough, get any active products
    if (recommendedProducts.length < 4) {
        const additionalProducts = DB.products.filter(p => 
            p.id !== currentProductId && 
            !recommendedProducts.some(rp => rp.id === p.id) &&
            p.active
        );
        recommendedProducts.push(...additionalProducts);
    }

    // Shuffle and return 4 products
    return recommendedProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
        const performSearch = () => {
            const searchTerm = searchInput.value;
            const activeCategory = document.querySelector('.category-filter-btn.filter-nav-active')?.dataset.category || 'All';
            loadAllProducts(activeCategory, searchTerm);
        };

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
        
        searchBtn.addEventListener('click', performSearch);
    }
}

function clearFilters() {
    // Clear search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    // Reset category to "All"
    const allButton = document.querySelector('[data-category="All"]');
    if (allButton) {
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.classList.remove('filter-nav-active', 'bg-green-500', 'text-white', 'shadow-md');
            btn.classList.add('bg-white', 'text-gray-700', 'shadow-sm');
        });
        allButton.classList.add('filter-nav-active', 'bg-green-500', 'text-white', 'shadow-md');
        allButton.classList.remove('bg-white', 'text-gray-700', 'shadow-sm');
    }
    
    // Reload all products
    loadAllProducts('All');
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.delete('category');
    url.searchParams.delete('search');
    window.history.pushState({}, '', url);
}

// Product Rating System
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

function calculateProductAverageRating(productId) {
    const product = DB.products.find(p => p.id === productId);
    if (!product || !product.ratings || product.ratings.length === 0) {
        return 0;
    }
    
    const sum = product.ratings.reduce((total, rating) => total + rating.rating, 0);
    return sum / product.ratings.length;
}

function getProductRatingCount(productId) {
    const product = DB.products.find(p => p.id === productId);
    return product && product.ratings ? product.ratings.length : 0;
}

function getUserProductRating(productId) {
    const currentUser = AppState.currentUser;
    if (!currentUser || currentUser.role !== 'buyer') return null;
    
    const product = DB.products.find(p => p.id === productId);
    if (!product || !product.ratings) return null;
    
    const userRating = product.ratings.find(r => r.userId === currentUser.id);
    return userRating ? userRating.rating : null;
}

function rateProduct(productId, rating) {
    const currentUser = AppState.currentUser;
    
    if (!currentUser) {
        Utils.showNotification('Please login to rate products', 'error');
        return;
    }
    
    if (currentUser.role !== 'buyer') {
        Utils.showNotification('Only buyers can rate products', 'error');
        return;
    }
    
    const product = DB.products.find(p => p.id === productId);
    if (!product) {
        Utils.showNotification('Product not found', 'error');
        return;
    }
    
    // Initialize ratings array if it doesn't exist
    if (!product.ratings) {
        product.ratings = [];
    }
    
    // Check if user already rated this product
    const existingRatingIndex = product.ratings.findIndex(r => r.userId === currentUser.id);
    
    if (existingRatingIndex !== -1) {
        // Update existing rating
        product.ratings[existingRatingIndex].rating = rating;
        product.ratings[existingRatingIndex].date = new Date().toISOString();
    } else {
        // Add new rating
        product.ratings.push({
            userId: currentUser.id,
            rating: rating,
            date: new Date().toISOString()
        });
    }
    
    // Save to database
    Utils.saveDB();
    Utils.showNotification(`You rated this product ${rating} star${rating !== 1 ? 's' : ''}`, 'success');
    
    // Refresh the product details modal to show updated rating
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
    viewProductDetails(productId);
}

// Initialize ratings for existing products
function initializeProductRatings() {
    DB.products.forEach(product => {
        if (!product.ratings) {
            product.ratings = [];
        }
    });
    Utils.saveDB();
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    if (document.getElementById('products-grid')) {
        initializeProductsPage();
    }
});