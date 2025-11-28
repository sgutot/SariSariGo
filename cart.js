// Cart Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cart-content')) {
        Cart.renderCart();
    }

    if (window.location.pathname.includes('checkout.html')) {
        renderCheckout();
    }
});

// Override Cart.renderCart to ensure it works properly
if (typeof Cart !== 'undefined') {
    // Store the original renderCart function
    const originalRenderCart = Cart.renderCart;
    
    // Override with our enhanced version
    Cart.renderCart = function() {
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

        // Determine selected items (persisted selection stored in localStorage)
        const selectedKey = 'sariSariGoSelected';
        let selected = [];
        try { selected = JSON.parse(localStorage.getItem(selectedKey)) || []; } catch (e) { selected = []; }

        const subtotal = this.getCartTotal();
        const deliveryFee = AppState.deliveryMethod === 'delivery' ? AppState.deliveryFee : AppState.pickupFee;
        const total = subtotal + deliveryFee;

        // Add this function to handle delivery method updates
    function updateDeliveryMethod(method) {
    AppState.deliveryMethod = method;
    localStorage.setItem('deliveryMethod', method);
    
    // Re-render the cart to update the delivery fee and totals
    if (document.getElementById('cart-content')) {
        Cart.renderCart();
    }
    
    // Also update checkout if we're on checkout page
    if (window.location.pathname.includes('checkout.html') && typeof renderCheckout === 'function') {
        renderCheckout();
    }
}

// Update the setDeliveryMethod function to use the new one
window.setDeliveryMethod = updateDeliveryMethod;
window.updateCheckoutDeliveryMethod = updateDeliveryMethod;

        cartContainer.innerHTML = `
     <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div class="lg:col-span-2">
              <div class="bg-white rounded-lg shadow-md p-6">
                 <h2 class="text-xl font-bold mb-4">Cart Items</h2>
                        <div class="flex items-center mb-3">
                            <label class="inline-flex items-center">
                                <input id="select-all-checkbox" type="checkbox" class="mr-2" ${selected.length === cartItems.length && cartItems.length > 0 ? 'checked' : ''}>
                                <span class="text-sm text-gray-600">Select all items</span>
                            </label>
                        </div>
                    <div class="space-y-4">
                            ${cartItems.map(item => `
                        <div class="flex items-center justify-between border-b pb-4">
                            <div class="flex items-center space-x-4">
                                <label class="inline-flex items-center mr-2">
                                    <input type="checkbox" class="cart-item-select mr-2" data-id="${item.productId}" ${selected.includes(item.productId) ? 'checked' : ''}>
                                </label>
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
                                    <button type="button" onclick="Cart.updateQuantity(${item.productId}, ${item.quantity + 1})" 
                                            ${item.product.stock <= item.quantity ? 'disabled' : ''}
                                            class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition ${item.product.stock <= item.quantity ? 'opacity-50 cursor-not-allowed' : ''}">
                                        <i class="fas fa-plus text-xs"></i>
                                    </button>
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
                    
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-semibold">Selected Subtotal:</span>
                            <span id="selected-subtotal">${Utils.formatPrice(0)}</span>
                        </div>
                        <button id="proceed-selected-btn" class="w-full bg-green-500 text-white text-center font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition block disabled:opacity-60" disabled>
                            Proceed to Checkout (Selected Items)
                        </button>
                    </div>
                    
                    <button onclick="Cart.clearCart()" 
                            class="w-full mt-3 bg-red-500 text-white text-center font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition">
                        Clear Cart
                    </button>
                </div>
            </div>
        `;

        // After rendering, wire up selection handlers
        (function wireSelection() {
            const selectedKey = 'sariSariGoSelected';
            let selected = [];
            try { selected = JSON.parse(localStorage.getItem(selectedKey)) || []; } catch (e) { selected = []; }

            const itemCheckboxes = Array.from(document.querySelectorAll('.cart-item-select'));
            const selectAll = document.getElementById('select-all-checkbox');
            const selectedSubtotalEl = document.getElementById('selected-subtotal');
            const proceedBtn = document.getElementById('proceed-selected-btn');

            function computeSelectedSubtotal() {
                let sum = 0;
                for (const item of cartItems) {
                    if (selected.includes(item.productId)) {
                        sum += (item.product.price || 0) * (item.quantity || 0);
                    }
                }
                return sum;
            }

            function updateSelectedUI() {
                const sum = computeSelectedSubtotal();
                if (selectedSubtotalEl) selectedSubtotalEl.textContent = Utils.formatPrice(sum);
                if (proceedBtn) {
                    proceedBtn.disabled = selected.length === 0;
                    proceedBtn.classList.toggle('opacity-60', selected.length === 0);
                }
                // update select-all checkbox
                if (selectAll) selectAll.checked = (selected.length === cartItems.length && cartItems.length > 0);
            }

            // Attach listeners to individual checkboxes
            itemCheckboxes.forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const id = parseInt(cb.getAttribute('data-id'));
                    if (cb.checked) {
                        if (!selected.includes(id)) selected.push(id);
                    } else {
                        selected = selected.filter(x => x !== id);
                    }
                    try { localStorage.setItem(selectedKey, JSON.stringify(selected)); } catch (e) { /* ignore */ }
                    updateSelectedUI();
                });
            });

            // Select-all handler
            if (selectAll) {
                selectAll.addEventListener('change', () => {
                    if (selectAll.checked) {
                        selected = cartItems.map(i => i.productId);
                        itemCheckboxes.forEach(cb => cb.checked = true);
                    } else {
                        selected = [];
                        itemCheckboxes.forEach(cb => cb.checked = false);
                    }
                    try { localStorage.setItem(selectedKey, JSON.stringify(selected)); } catch (e) { /* ignore */ }
                    updateSelectedUI();
                });
            }

            // Proceed button
            if (proceedBtn) {
                proceedBtn.addEventListener('click', () => {
                    if (selected.length === 0) return;
                    // Build checkout payload: array of { productId, quantity }
                    const checkoutItems = cartItems.filter(i => selected.includes(i.productId)).map(i => ({ productId: i.productId, quantity: i.quantity }));
                    try { localStorage.setItem('sariSariGoCheckout', JSON.stringify(checkoutItems)); } catch (e) { /* ignore */ }
                    // Navigate to checkout
                    window.location.href = 'checkout.html';
                });
            }

            // Initialize UI
            updateSelectedUI();
        })();
    };
}

function setDeliveryMethod(method) {
    AppState.deliveryMethod = method;
    localStorage.setItem('deliveryMethod', method);
    
    // Re-render the cart to update the delivery fee
    if (document.getElementById('cart-content')) {
        Cart.renderCart();
    }
}

// ... rest of your cart.js code for checkout functionality