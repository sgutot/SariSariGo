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
                                            <button onclick="Cart.updateQuantity(${item.productId}, ${item.quantity - 1})" 
                                                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
                                                <i class="fas fa-minus text-xs"></i>
                                            </button>
                                            <span class="w-8 text-center font-medium">${item.quantity}</span>
                                            <button onclick="Cart.updateQuantity(${item.productId}, ${item.quantity + 1})" 
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