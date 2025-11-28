// ------------------------------
// Global Application State
// ------------------------------
const AppState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    cart: JSON.parse(localStorage.getItem('sariSariGoCart')) || [],
    deliveryMethod: localStorage.getItem('deliveryMethod') || 'delivery',
    deliveryFee: 50.00,
    pickupFee: 0.00
};

// ------------------------------
// Mock Database
// ------------------------------
const DB = {
    users: [
        { id: 1, name: 'Seah Ubado', email: 'seah@example.com', password: 'seah123', role: 'buyer', address: 'Bacarra, Ilocos Norte', phone: '0912345678' },
        { id: 2, name: 'Janna Ylaicel Dacillo', email: 'janna@example.com', password: 'janna123', role: 'buyer', address: 'San Nicolas, Ilocos Norte', phone: '555-1234' },
        { id: 3, name: 'GAÑO STORE', email: 'ganovendor@example.com', password: 'passwordgano', role: 'vendor', storeDescription: 'Your friendly neighborhood grocery with the best products', storeAddress: 'Brgy. 11, Sta. Rosa, Sarrat, Ilocos Norte', storeLogo: 'products/GanoStore.png', rating: 4.5 },
        { id: 4, name: 'Amore Store', email: 'amorevendor@example.com', password: 'passwordamore', role: 'vendor', storeDescription: 'All your pantry needs, delivered to your doorstep.', storeAddress: 'Brgy. 35, Pipias, Bcarra, Ilocos Norte', storeLogo: 'products/amorelogo.png', rating: 4.8 },
        { id: 5, name: 'Zapays Bakery and Merchandise', email: 'zapays@example.com', password: 'passwordzapays', role: 'vendor', storeDescription: '100% organic products for a healthier lifestyle.', storeAddress: 'Brgy. 16, San Marcos, San Nicolas, Ilocos Norte', storeLogo: 'products/zapays.png', rating: 4.9 },
        { id: 6, name: 'Rosemaries Gulayan', email: 'rosemarie@example.com', password: 'passwordrosemarie', role: 'vendor', storeDescription: '100% organic products for a healthier lifestyle.', storeAddress: 'Brgy. 7, San Manuel, Sarrat, Ilocos Norte', storeLogo: 'products/gulayanlogo.png', rating: 4.9 },
    ],
    categories: ['Pantry', 'Beverages', 'Snacks', 'Household', 'Canned Foods', 'Vegetables'],
    products: [
        { id: 1, vendorId: 3, name: 'Giniling', description: 'Ready-to-cook ground meat for your favorite dishes.', price: 33.00, category: 'Canned Foods', stock: 50, imageUrl: 'products/giniling.jpg', active: true },
        { id: 2, vendorId: 3, name: 'Fresca Tuna - Adobo', description: 'Delicious adobo-style tuna in a can.', price: 32.00, category: 'Canned Foods', stock: 30, imageUrl: 'products/fresca.jpg', active: true },
        { id: 3, vendorId: 3, name: 'Inipit', description: 'Soft and creamy pastry sandwich snack.', price: 62.00, category: 'Snacks', stock: 20, imageUrl: 'products/inipit.jpg', active: true },
        { id: 4, vendorId: 4, name: 'Nissin Ramen Creamy Seafood - 63g', description: 'Smooth, flavorful noodle soup with a rich seafood broth.', price: 17.00, category: 'Pantry', stock: 100, imageUrl: 'products/Nissin.jpg', active: true },
        { id: 5, vendorId: 4, name: 'Lucky Me Pancit Canton Chilimansi - 80g', description: 'Stir-fry noodle packed with a zesty blend of chili and calamansi.', price: 21.00, category: 'Pantry', stock: 40, imageUrl: 'products/canton.jpg', active: true },
        { id: 6, vendorId: 3, name: 'Mogu-Mogu', description: 'Fruity drink with chewy nata de coco bits.', price: 48.00, category: 'Beverages', stock: 25, imageUrl: 'products/mogu.jpg', active: true },
        { id: 7, vendorId: 4, name: '555 Sardines - 155g', description: 'Classic canned sardine dish cooked in rich tomato sauce.', price: 29.00, category: 'Canned Foods', stock: 60, imageUrl: 'products/555 sardines.jpg', active: true },
        { id: 8, vendorId: 3, name: 'Angel - Kremdensada', description: 'Creamy blend of Angel Evaporated Milk and Angel Condensada', price: 55.00, category: 'Pantry', stock: 35, imageUrl: 'products/angel kremdensada.jpg', active: true },
        { id: 9, vendorId: 3, name: 'Gatorade', description: 'Sports drink designed to rehydrate and replenish electrolytes lost during physical activity.', price: 50.00, category: 'Beverages', stock: 15, imageUrl: 'products/gatorade.jpg', active: true },
        { id: 10, vendorId: 4, name: 'Papa Banana Ketchup - 320g', description: 'Sweet and tangy Filipino-style ketchup made from bananas.', price: 31.00, category: 'Pantry', stock: 40, imageUrl: 'products/ketchup.png', active: true },
        { id: 11, vendorId: 3, name: 'Nissin Waffer', description: 'Crunchy, layered wafer snack filled with sweet cream.', price: 67.00, category: 'Snacks', stock: 35, imageUrl: 'products/waffer.jpg', active: true },
        { id: 12, vendorId: 4, name: 'Mama Sitas Oyster Sauce with spout - 405g', description: 'Rich, savory cooking sauce made from real oyster extract.', price: 77.00, category: 'Pantry', stock: 25, imageUrl: 'products/oystersauce.jpg', active: true },
        { id: 13, vendorId: 3, name: 'Presto', description: 'A delicious crunchy biscuit filled with rich peanut butter cream.', price: 65.00, category: 'Snacks', stock: 20, imageUrl: 'products/presto.jpg', active: true },
        { id: 14, vendorId: 3, name: 'Chuckie - Small', description: 'Creamy chocolate milk drink packed in a convenient size for kids and adults alike.', price: 15.00, category: 'Beverages', stock: 30, imageUrl: 'products/chuckie.jpg', active: true },
        { id: 15, vendorId: 4, name: 'Argentina Meat Loaf - 150g', description: 'Ready-to-eat, seasoned meat loaf thats savory, tender, and perfect with rice or sandwiches.', price: 26.00, category: 'Canned Foods', stock: 25, imageUrl: 'products/meatloaf.jpg', active: true },
        { id: 16, vendorId: 4, name: 'Kopiko Coffee Blanca Twin', description: '3-in-1 instant coffee thats smooth, rich, and perfect for a quick cup anytime.', price: 15.00, category: 'Pantry', stock: 25, imageUrl: 'products/kopiko.jpg', active: true },
        { id: 17, vendorId: 3, name: 'Ice Candy Bag', description: 'Durable plastic bag designed for making homemade ice candies.', price: 17.00, category: 'Household', stock: 25, imageUrl: 'products/ice candy bag.jpg', active: true },
        { id: 18, vendorId: 5, name: 'Richoco', description: 'Light, crispy wafer layered with smooth chocolate cream.', price: 20.00, category: 'Snacks', stock: 35, imageUrl: 'products/richoco.jpeg', active: true },
        { id: 19, vendorId: 5, name: 'Nissin Creamy Seafood Cup Noodles - Small', description: 'Noodle soup with a rich seafood flavor in cup.', price: 35.00, category: 'Pantry', stock: 20, imageUrl: 'products/cupnoodles.jpg', active: true },
        { id: 20, vendorId: 6, name: 'Eggplant - 1kl', description: 'Noodle soup with a rich seafood flavor in cup.', price: 150.00, category: 'Vegetables', stock: 20, imageUrl: 'products/eggplant.jpg', active: true },
        { id: 21, vendorId: 6, name: 'Squash - 1kl', description: 'Noodle soup with a rich seafood flavor in cup.', price: 50.00, category: 'Vegetables', stock: 30, imageUrl: 'products/karabasa.jpg', active: true },
        { id: 22, vendorId: 6, name: 'Okra - 1kl', description: 'Noodle soup with a rich seafood flavor in cup.', price: 160.00, category: 'Vegetables', stock: 25, imageUrl: 'products/okra.jpg', active: true },
        { id: 23, vendorId: 6, name: 'Luffa Squash - 1kl', description: 'Noodle soup with a rich seafood flavor in cup.', price: 150.00, category: 'Vegetables', stock: 20, imageUrl: 'products/kabatiti.jpg', active: true },

    ],
    orders: []
};

// ------------------------------
// Utility Functions
// ------------------------------
const Utils = {
    formatPrice(price) {
        return `₱${parseFloat(price).toFixed(2)}`;
    },

    showNotification(message, type = 'info') {
        // Remove any existing notifications first
        const existingNotifications = document.querySelectorAll('[data-notification]');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.setAttribute('data-notification', 'true');
        const colors = {
            success: 'bg-green-100 border-green-400 text-green-700',
            error: 'bg-red-100 border-red-400 text-red-700',
            info: 'bg-blue-100 border-blue-400 text-blue-700'
        };
        notification.className = `fixed top-4 right-4 ${colors[type]} border px-4 py-3 rounded-md shadow-lg z-50 max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    ${type === 'success' ? ' ' : type === 'error' ? '' : ''}
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    },

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems > 0) {
                cartCount.textContent = totalItems;
                cartCount.classList.remove('hidden');
            } else {
                cartCount.classList.add('hidden');
            }
        }
    },

    updateAuthLinks() {
        const authLinks = document.getElementById('auth-links');
        if (!authLinks) return;

        if (AppState.currentUser) {
            // Show different links based on user role
            if (AppState.currentUser.role === 'vendor') {
                // Vendors only see Logout
                authLinks.innerHTML = `
                    <button id="logout-btn" class="text-gray-600 hover:text-green-600 transition">Logout</button>
                `;
            } else {
                // Buyers see Dashboard and Logout
                authLinks.innerHTML = `
                    <a href="dashboard.html" class="text-gray-600 hover:text-green-600 transition">Dashboard</a>
                    <button id="logout-btn" class="text-gray-600 hover:text-green-600 transition">Logout</button>
                `;
            }
            document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());
        } else {
            authLinks.innerHTML = `
                <a href="login.html" class="text-gray-600 hover:text-green-600 transition">Login</a>
                <a href="register.html" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Register</a>
            `;
        }
    },

    loadDB() {
        try {
            const raw = localStorage.getItem('sariSariGoDB');
            if (!raw) {
                // Initialize with default data if no DB exists
                this.saveDB();
                return;
            }
            const stored = JSON.parse(raw);

            // Merge stored data with default DB structure
            if (stored.users) DB.users = stored.users;
            if (stored.products) DB.products = stored.products;
            if (stored.orders) DB.orders = stored.orders;
            if (stored.categories) DB.categories = stored.categories;
        } catch (e) {
            console.warn('DB load error', e);
            // Initialize with default data if loading fails
            this.saveDB();
        }
    },

    saveDB() {
        try {
            localStorage.setItem('sariSariGoDB', JSON.stringify(DB));
        } catch (e) {
            console.warn('DB save error', e);
        }
    },

    // ========== VENDOR & PRODUCT UTILITY FUNCTIONS ==========

    // Function to get products by vendor
    getProductsByVendor(vendorId) {
        return DB.products.filter(product => product.vendorId === vendorId && product.active);
    },

    // Function to get vendor by ID
    getVendorById(vendorId) {
        return DB.users.find(user => user.id === vendorId && user.role === 'vendor');
    },

    // Function to get all vendors
    getAllVendors() {
        return DB.users.filter(user => user.role === 'vendor');
    },

    // ========== ADD/UPDATE FUNCTIONS ==========

    // Function to add new product
    addProduct(productData) {
        const newProduct = {
            id: DB.products.length > 0 ? Math.max(...DB.products.map(p => p.id)) + 1 : 1,
            ...productData,
            active: true
        };
        DB.products.push(newProduct);
        this.saveDB();
        Utils.showNotification('Product added successfully!', 'success');
        return newProduct;
    },

    // Function to update existing product
    updateProduct(productId, updates) {
        const productIndex = DB.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            DB.products[productIndex] = { ...DB.products[productIndex], ...updates };
            this.saveDB();
            Utils.showNotification('Product updated successfully!', 'success');
            return DB.products[productIndex];
        }
        Utils.showNotification('Product not found!', 'error');
        return null;
    },

    // Function to delete product (set inactive)
    deleteProduct(productId) {
        const productIndex = DB.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            DB.products[productIndex].active = false;
            this.saveDB();
            Utils.showNotification('Product deleted successfully!', 'success');
            return true;
        }
        Utils.showNotification('Product not found!', 'error');
        return false;
    },

    // Function to add new user
    addUser(userData) {
        // Check if email already exists
        if (DB.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            Utils.showNotification('Email already exists!', 'error');
            return null;
        }
        
        const newUser = {
            id: DB.users.length > 0 ? Math.max(...DB.users.map(u => u.id)) + 1 : 1,
            ...userData
        };
        DB.users.push(newUser);
        this.saveDB();
        Utils.showNotification('User added successfully!', 'success');
        return newUser;
    },

    // Function to update existing user
    updateUser(userId, updates) {
        const userIndex = DB.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            DB.users[userIndex] = { ...DB.users[userIndex], ...updates };
            this.saveDB();
            Utils.showNotification('User updated successfully!', 'success');
            return DB.users[userIndex];
        }
        Utils.showNotification('User not found!', 'error');
        return null;
    },

    // Function to add new category
    addCategory(categoryName) {
        if (!DB.categories.includes(categoryName)) {
            DB.categories.push(categoryName);
            this.saveDB();
            Utils.showNotification('Category added successfully!', 'success');
            return true;
        }
        Utils.showNotification('Category already exists!', 'error');
        return false;
    },

    // Function to add new order
    addOrder(orderData) {
        const newOrder = {
            id: DB.orders.length > 0 ? Math.max(...DB.orders.map(o => o.id)) + 1 : 1,
            ...orderData,
            orderDate: new Date().toISOString(),
            status: 'pending'
        };
        DB.orders.push(newOrder);
        this.saveDB();
        return newOrder;
    },

    // Function to update order status
    updateOrderStatus(orderId, newStatus) {
        const orderIndex = DB.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            DB.orders[orderIndex].status = newStatus;
            this.saveDB();
            Utils.showNotification(`Order status updated to ${newStatus}`, 'success');

            // Dispatch a global event so other open pages can react immediately
            try {
                window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { orderId, newStatus } }));
            } catch (e) {
                // ignore in non-browser environments
            }
            return true;
        }
        Utils.showNotification('Order not found!', 'error');
        return false;
    },

    // Function to cancel an order (called by buyers)
    cancelOrder(orderId, reason) {
        const orderIndex = DB.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            DB.orders[orderIndex].status = 'cancelled';
            DB.orders[orderIndex].cancellationReason = reason || null;
            DB.orders[orderIndex].cancellationDate = new Date().toISOString();
            this.saveDB();
            Utils.showNotification('Order cancelled', 'success');

            // Dispatch a global event so other open pages can react immediately
            try {
                window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { orderId, newStatus: 'cancelled' } }));
            } catch (e) {
                // ignore in non-browser environments
            }
            return true;
        }
        Utils.showNotification('Order not found!', 'error');
        return false;
    }

    // ========== END OF UTILITY FUNCTIONS ==========
};

// ------------------------------
// Authentication
// ------------------------------
const Auth = {
    login(email, password, role = null) {
        const emailNorm = (email || '').trim().toLowerCase();
        const user = DB.users.find(u => u.email.toLowerCase() === emailNorm);
        if (!user) {
            Utils.showNotification('No account found with that email', 'error');
            return false;
        }
        if (role && user.role !== role) {
            Utils.showNotification('Account type mismatch', 'error');
            return false;
        }
        if (user.password !== password) {
            Utils.showNotification('Incorrect password', 'error');
            return false;
        }

        AppState.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Restore user's saved cart (if any). If none, keep existing cart (guest cart) or empty.
        try {
            const saved = localStorage.getItem(`sariSariGoCart_user_${user.id}`);
            if (saved) {
                AppState.cart = JSON.parse(saved) || [];
            }
            // Ensure global cart reflects the current AppState for UI
            localStorage.setItem('sariSariGoCart', JSON.stringify(AppState.cart));
        } catch (e) {
            console.warn('Failed to restore user cart', e);
        }

        Utils.showNotification('Login successful!', 'success');

        Utils.updateAuthLinks();
        Utils.updateCartCount();

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
        return true;
    },

    logout() {
        // Save the current user's cart under their user key so it can be restored later
        try {
            if (AppState.currentUser && AppState.currentUser.id) {
                localStorage.setItem(`sariSariGoCart_user_${AppState.currentUser.id}`, JSON.stringify(AppState.cart || []));
            }
        } catch (e) {
            console.warn('Failed to save per-user cart on logout', e);
        }

        // Clear in-memory cart and global cart used by the UI so logged-out users see an empty cart
        AppState.currentUser = null;
        AppState.cart = [];
        localStorage.removeItem('currentUser');
        localStorage.setItem('sariSariGoCart', JSON.stringify([]));

        Utils.updateAuthLinks();
        Utils.updateCartCount();
        Utils.showNotification('Logged out successfully', 'success');

        // Redirect to home page immediately
        window.location.href = 'index.html';
    },

    register(userData) {
        if (DB.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            Utils.showNotification('Email already exists', 'error');
            return false;
        }
        const newUser = { 
            id: DB.users.length > 0 ? Math.max(...DB.users.map(u => u.id)) + 1 : 1, 
            ...userData 
        };
        DB.users.push(newUser);
        Utils.saveDB();
        AppState.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        Utils.updateAuthLinks();
        Utils.showNotification('Registration successful!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 500);
        return true;
    }
};

// ------------------------------
// Cart
// ------------------------------
const Cart = {
    addToCart(productId, quantity = 1) {
        // Check if user is logged in
        if (!AppState.currentUser) {
            Utils.showNotification('Please login to add items to cart', 'error');
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return false;
        }

        const product = DB.products.find(p => p.id === productId);
        if (!product) {
            Utils.showNotification('Product not found', 'error');
            return false;
        }
        if (product.stock < quantity) {
            Utils.showNotification(`Only ${product.stock} left in stock`, 'error');
            return false;
        }

        const existing = AppState.cart.find(i => i.productId === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            AppState.cart.push({ productId, quantity });
        }

        this.saveCart();
        Utils.updateCartCount();
        Utils.showNotification(`${product.name} added to cart!`, 'success');
        return true;
    },

    // NEW: Buy Now function
    buyNow(productId, quantity = 1) {
        // Check if user is logged in
        if (!AppState.currentUser) {
            Utils.showNotification('Please login to proceed with Buy Now', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return false;
        }

        const product = DB.products.find(p => p.id === productId);
        if (!product) {
            Utils.showNotification('Product not found', 'error');
            return false;
        }
        if (product.stock < quantity) {
            Utils.showNotification(`Only ${product.stock} left in stock`, 'error');
            return false;
        }

        // Clear cart and add only this product
        this.clearCart();
        AppState.cart.push({ productId, quantity });
        this.saveCart();
        Utils.updateCartCount();
        
        Utils.showNotification(`Proceeding to checkout with ${product.name}`, 'success');
        
        // Redirect to checkout immediately
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
        return true;
    },

    removeFromCart(productId) {
        AppState.cart = AppState.cart.filter(item => item.productId !== productId);
        this.saveCart();
        Utils.updateCartCount();
        Utils.showNotification('Item removed from cart', 'success');
        // Re-render the cart UI if a render function exists
        try {
            if (typeof this.renderCart === 'function') this.renderCart();
        } catch (e) { /* ignore */ }
    },

    updateQuantity(productId, quantity) {
        const item = AppState.cart.find(i => i.productId === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                const product = DB.products.find(p => p.id === productId);
                if (product && product.stock >= quantity) {
                    item.quantity = quantity;
                    this.saveCart();
                    Utils.updateCartCount();
                    // Re-render the cart UI if a render function exists
                    try {
                        if (typeof this.renderCart === 'function') this.renderCart();
                    } catch (e) { /* ignore */ }
                } else {
                    Utils.showNotification(`Only ${product.stock} available`, 'error');
                }
            }
        }
    },

    clearCart() {
        AppState.cart = [];
        this.saveCart();
        Utils.updateCartCount();
        Utils.showNotification('Cart cleared', 'success');
        // Re-render the cart UI if a render function exists
        try {
            if (typeof this.renderCart === 'function') this.renderCart();
        } catch (e) { /* ignore */ }
    },

    saveCart() {
        // Always keep a global cart for the UI
        localStorage.setItem('sariSariGoCart', JSON.stringify(AppState.cart));

        // If a user is logged in, also persist a per-user cart so it can be restored when they login again
        if (AppState.currentUser && AppState.currentUser.id) {
            try {
                localStorage.setItem(`sariSariGoCart_user_${AppState.currentUser.id}`, JSON.stringify(AppState.cart));
            } catch (e) {
                console.warn('Failed to save per-user cart', e);
            }
        }
    },

    getCartItems() {
        return AppState.cart.map(item => {
            const product = DB.products.find(p => p.id === item.productId);
            return product ? { 
                ...item, 
                product,
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl
            } : null;
        }).filter(item => item !== null);
    },

    getCartTotal() {
        return this.getCartItems().reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    },

    // Render cart function for cart.html
    renderCart() {
        const cartContainer = document.getElementById('cart-content');
        if (!cartContainer) return;

        const cartItems = this.getCartItems();

        if (cartItems.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
                    <p class="text-gray-500 mb-6">Add some products to get started!</p>
                    <a href="products.html" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
                        Start Shopping
                    </a>
                </div>
            `;
            return;
        }

        const subtotal = this.getCartTotal();
        const deliveryFee = AppState.deliveryMethod === 'delivery' ? AppState.deliveryFee : AppState.pickupFee;
        const total = subtotal + deliveryFee;

        cartContainer.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h2 class="text-xl font-bold mb-4">Cart Items</h2>
                        <div class="space-y-4">
                            ${cartItems.map(item => `
                                <div class="flex items-center justify-between border-b pb-4">
                                    <div class="flex items-center space-x-4">
                                        <img src="${item.product.imageUrl}" alt="${item.product.name}" 
                                             class="w-16 h-16 rounded object-cover"
                                             onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
                                        <div>
                                            <h3 class="font-semibold">${item.product.name}</h3>
                                            <p class="text-green-600 font-bold">${Utils.formatPrice(item.product.price)}</p>
                                            <p class="text-sm text-gray-500">Stock: ${item.product.stock}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <div class="flex items-center space-x-2">
                                            <button type="button" onclick="Cart.updateQuantity(${item.productId}, ${item.quantity - 1})" 
                                                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
                                                <i class="fas fa-minus text-xs"></i>
                                            </button>
                                            <span class="w-8 text-center font-medium">${item.quantity}</span>
                                            ${item.product.stock <= item.quantity ? `
                                            <button type="button" disabled
                                                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center opacity-50 cursor-not-allowed">
                                                <i class="fas fa-plus text-xs"></i>
                                            </button>
                                            ` : `
                                            <button type="button" onclick="Cart.updateQuantity(${item.productId}, ${item.quantity + 1})" 
                                                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
                                                <i class="fas fa-plus text-xs"></i>
                                            </button>
                                            `}
                                        </div>
                                        <button onclick="Cart.removeFromCart(${item.productId})" 
                                                class="text-red-500 hover:text-red-700 ml-4 transition">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-md p-6 h-fit">
                    <h2 class="text-xl font-bold mb-4">Order Summary</h2>
                    <div class="space-y-3 mb-4">
                        <div class="flex justify-between">
                            <span>Subtotal</span>
                            <span>${Utils.formatPrice(subtotal)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>${AppState.deliveryMethod === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}</span>
                            <span>${Utils.formatPrice(deliveryFee)}</span>
                        </div>
                        <div class="border-t pt-3">
                            <div class="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${Utils.formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="radio" name="deliveryMethod" value="delivery" 
                                       ${AppState.deliveryMethod === 'delivery' ? 'checked' : ''}
                                       onchange="setDeliveryMethod('delivery')"
                                       class="mr-2">
                                <span>Home Delivery (${Utils.formatPrice(AppState.deliveryFee)})</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="deliveryMethod" value="pickup" 
                                       ${AppState.deliveryMethod === 'pickup' ? 'checked' : ''}
                                       onchange="setDeliveryMethod('pickup')"
                                       class="mr-2">
                                <span>Store Pickup (Free)</span>
                            </label>
                        </div>
                    </div>
                    
                    <a href="checkout.html" 
                       class="w-full bg-green-500 text-white text-center font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition block">
                        Proceed to Checkout
                    </a>
                    
                    <button onclick="Cart.clearCart()" 
                            class="w-full mt-3 bg-red-500 text-white text-center font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition">
                        Clear Cart
                    </button>
                </div>
            </div>
        `;
    }
};

// ------------------------------
// Global Helper Functions
// ------------------------------
function setDeliveryMethod(method) {
    AppState.deliveryMethod = method;
    localStorage.setItem('deliveryMethod', method);
    
    // Re-render the cart to update the delivery fee
    if (document.getElementById('cart-content')) {
        Cart.renderCart();
    }
    
    // Also update checkout if we're on checkout page
    if (window.location.pathname.includes('checkout.html') && typeof renderCheckout === 'function') {
        renderCheckout();
    }
}

function updateDeliveryMethod(method) {
    setDeliveryMethod(method);
}

// ------------------------------
// Cart Auto-Update Setup
// ------------------------------
function setupCartAutoUpdate() {
    // Override cart methods to auto-update UI
    const originalRemoveFromCart = Cart.removeFromCart;
    const originalUpdateQuantity = Cart.updateQuantity;
    const originalClearCart = Cart.clearCart;
    
    Cart.removeFromCart = function(productId) {
        originalRemoveFromCart.call(this, productId);
        autoUpdateCartUI();
    };
    
    Cart.updateQuantity = function(productId, quantity) {
        originalUpdateQuantity.call(this, productId, quantity);
        autoUpdateCartUI();
    };
    
    Cart.clearCart = function() {
        originalClearCart.call(this);
        autoUpdateCartUI();
    };
}

function autoUpdateCartUI() {
    // Update cart count everywhere
    Utils.updateCartCount();
    
    // Re-render cart page if we're on it
    if (window.location.pathname.includes('cart.html') && typeof Cart.renderCart === 'function') {
        Cart.renderCart();
    }
}

// ------------------------------
// DOM Loaded
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
    Utils.loadDB();
    Utils.updateAuthLinks();
    Utils.updateCartCount();
    setupCartAutoUpdate();
    
    // Add global event listener for form submissions to auto-save
    document.addEventListener('submit', function(e) {
        // Auto-save DB when any form is submitted (except login/register)
        if (!e.target.matches('form[action*="login"], form[action*="register"]')) {
            setTimeout(() => Utils.saveDB(), 100);
        }
    });
    
    // Auto-save when input fields change (for product edits, etc.)
    document.addEventListener('change', function(e) {
        if (e.target.matches('input[name*="price"], input[name*="name"], input[name*="stock"], textarea[name*="description"]')) {
            setTimeout(() => Utils.saveDB(), 100);
        }
    });
});

// ------------------------------
// Global Helper Functions
// ------------------------------
function getStatusColor(status) {
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'Processing': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'shipped': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

// Make functions globally available
window.Cart = Cart;
window.Auth = Auth;
window.Utils = Utils;
window.AppState = AppState;
window.DB = DB;
window.setDeliveryMethod = setDeliveryMethod;
window.updateDeliveryMethod = updateDeliveryMethod;
window.getStatusColor = getStatusColor;

// Listen for storage changes in other tabs/windows and refresh UI accordingly
window.addEventListener('storage', (e) => {
    if (!e.key) return;
    if (e.key === 'sariSariGoDB') {
        try {
            Utils.loadDB();
        } catch (err) { /* ignore */ }

        // Try calling common refresh hooks if present on the page
        if (typeof refreshData === 'function') {
            try { refreshData(); } catch (err) { /* ignore */ }
        }
        if (typeof loadVendorOrders === 'function') {
            try { loadVendorOrders(); } catch (err) { /* ignore */ }
        }
        if (typeof Cart !== 'undefined' && typeof Cart.renderCart === 'function') {
            try { Cart.renderCart(); } catch (err) { /* ignore */ }
        }
    }
});

// Allow pages in the same tab to subscribe to order updates via the 'ordersUpdated' event
window.addEventListener('ordersUpdated', (ev) => {
    // Default handler: try to refresh relevant parts if functions available
    const detail = ev && ev.detail ? ev.detail : {};
    if (typeof loadVendorOrders === 'function') {
        try { loadVendorOrders(); } catch (err) { /* ignore */ }
    }
    if (typeof loadBuyerOrders === 'function') {
        try { loadBuyerOrders(); } catch (err) { /* ignore */ }
    }
});