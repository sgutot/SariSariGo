// Order Status Management
const OrderStatus = {
    PROCESSING: 'Processing',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    READY_FOR_PICKUP: 'Ready for Pickup',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
};

function updateOrderStatus(orderId, newStatus, notes = '') {
    const order = DB.orders.find(o => o.id === orderId);
    if (!order) {
        Utils.showNotification('Order not found', 'error');
        return false;
    }

    // Update status and add to status history
    order.status = newStatus;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        notes: notes
    });

    // Save changes
    try {
        Utils.saveDB();
        Utils.showNotification(`Order ${orderId} updated to ${newStatus}`, 'success');
        // Re-render dashboard if we're on it
        if (typeof renderDashboard === 'function') {
            renderDashboard();
        }
        return true;
    } catch (e) {
        console.error('Failed to save order status update', e);
        Utils.showNotification('Failed to update order status', 'error');
        return false;
    }
}

function getStatusBadgeClass(status) {
    const classes = {
        [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
        [OrderStatus.CONFIRMED]: 'bg-yellow-100 text-yellow-800',
        [OrderStatus.PREPARING]: 'bg-indigo-100 text-indigo-800',
        [OrderStatus.OUT_FOR_DELIVERY]: 'bg-purple-100 text-purple-800',
        [OrderStatus.READY_FOR_PICKUP]: 'bg-green-100 text-green-800',
        [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
        [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

function renderOrderStatusTimeline(order) {
    if (!order.statusHistory) return '';
    
    return `
        <div class="mt-4 border-t pt-4">
            <h4 class="font-semibold mb-2">Order Timeline</h4>
            <div class="space-y-3">
                ${order.statusHistory.map((entry, index) => `
                    <div class="flex items-center gap-3">
                        <div class="h-2 w-2 rounded-full ${entry.status === order.status ? 'bg-green-500' : 'bg-gray-300'}"></div>
                        <div class="flex-1">
                            <p class="text-sm font-medium">${entry.status}</p>
                            <p class="text-xs text-gray-500">${new Date(entry.timestamp).toLocaleString()}</p>
                            ${entry.notes ? `<p class="text-sm text-gray-600 mt-1">${entry.notes}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// For vendors to update order status with a modal
function showOrderStatusModal(orderId) {
    const order = DB.orders.find(o => o.id === orderId);
    if (!order) {
        Utils.showNotification('Order not found', 'error');
        return;
    }

    // Create modal HTML
    const modalContainer = document.createElement('div');
    modalContainer.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modalContainer.id = 'status-modal';
    
    const availableStatuses = order.paymentMethod === 'pickup' ? 
        [OrderStatus.PROCESSING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP, OrderStatus.COMPLETED, OrderStatus.CANCELLED] :
        [OrderStatus.PROCESSING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.COMPLETED, OrderStatus.CANCELLED];

    modalContainer.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-bold mb-4">Update Order Status</h3>
            <p class="text-sm text-gray-600 mb-4">Order #${order.id}</p>
            
            <form id="status-update-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="new-status" class="w-full border border-gray-300 rounded-md py-2 px-3">
                        ${availableStatuses.map(status => `
                            <option value="${status}" ${order.status === status ? 'selected' : ''}>
                                ${status}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                    <textarea id="status-notes" rows="3" class="w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
                </div>

                <div class="flex justify-end gap-3">
                    <button type="button" onclick="document.getElementById('status-modal').remove()" 
                            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Update Status
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalContainer);

    // Handle form submission
    document.getElementById('status-update-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const newStatus = document.getElementById('new-status').value;
        const notes = document.getElementById('status-notes').value;
        
        if (updateOrderStatus(orderId, newStatus, notes)) {
            modalContainer.remove();
        }
    });
}