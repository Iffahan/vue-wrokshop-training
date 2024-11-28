<template>
  <div class="cart-order-page">
    <h1>My Cart & Orders</h1>

    <!-- Tabs -->
    <div class="tabs">
      <button
        :class="{ active: activeTab === 'Cart' }"
        @click="activeTab = 'Cart'"
      >
        Cart
      </button>
      <button
        :class="{ active: activeTab === 'Order' }"
        @click="activeTab = 'Order'"
      >
        Order
      </button>
    </div>

    <!-- Cart Tab -->
    <div v-if="activeTab === 'Cart'" class="tab-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading">Loading...</div>

      <!-- Error State -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- Cart Cards -->
      <div v-if="cart && cart.items.length > 0" class="cart-list">
        <!-- Confirm Button with Total Price -->
        <div class="confirm-section">
          <button
            class="confirm-order-button"
            :disabled="selectedItems.length === 0"
            @click="confirmOrder"
          >
            Confirm Order (${{ calculateTotalPrice().toFixed(2) }})
          </button>
        </div>

        <div class="cart-card" v-for="item in cart.items" :key="item._id">
          <!-- Column 1: Select Checkbox -->
          <div class="cart-column select-column">
            <input type="checkbox" :value="item" v-model="selectedItems" />
          </div>
          <!-- Column 1: Product Image -->
          <div class="cart-column image-column">
            <img
              v-if="item.product && item.product.image"
              :src="item.product.image"
              alt="Product Image"
            />
            <span v-else>No Image</span>
          </div>

          <!-- Column 2: Product Name & Price -->
          <div class="cart-column details-column">
            <h3>{{ item.product ? item.product.name : "Unknown Product" }}</h3>
            <p>
              {{
                item.product.description
                  ? item.product.description
                  : "Unknown Description"
              }}
            </p>
            <p>
              {{ item.product ? `$${item.product.price.toFixed(2)}` : "-" }}
            </p>
          </div>

          <!-- Column 4: Quantity Controls -->
          <div class="cart-column quantity-column">
            <button
              @click="updateQuantity(item, -1)"
              :disabled="item.quantity <= 1"
              class="quantity-button"
            >
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item, 1)" class="quantity-button">
              +
            </button>
          </div>

          <!-- Column 3: Total Price -->
          <div class="cart-column total-column">
            Total:
            {{
              item.product
                ? `$${(item.product.price * item.quantity).toFixed(2)}`
                : "-"
            }}
          </div>

          <!-- Column 5: Delete -->
          <div class="cart-column delete-column">
            <button class="delete-button" @click="removeFromCart(item)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty Cart Message -->
      <div v-else-if="cart && cart.items.length === 0" class="empty-cart">
        Your cart is empty.
      </div>
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'Order'" class="tab-content">
      <div v-if="orders.length > 0" class="order-list">
        <div class="order-card" v-for="order in orders" :key="order._id">
          <!-- Column 1: Order ID -->
          <div class="order-column order-id-column">
            <p><strong>Order ID: </strong>{{ order._id }}</p>
            <div class="order-column product-list-column">
              <ul>
                <li
                  v-for="productItem in order.products"
                  :key="productItem._id"
                >
                  {{ productItem.product?.name || "Unknown Product" }}
                  x{{ productItem.quantity || 0 }} - ${{
                    (productItem.price || 0).toFixed(2)
                  }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Column 3: Total Price -->
          <div class="order-column total-column">
            <p class="black-text"><strong>Total:</strong></p>
            <p>${{ order.total_price.toFixed(2) }}</p>
          </div>

          <!-- Column 5: Order Date -->
          <div class="order-column date-column">
            <p><strong>Placed At:</strong></p>
            <p>{{ new Date(order.createdAt).toLocaleString() }}</p>
          </div>

          <!-- Column 4: Status -->
          <div class="order-column status-column">
            <p><strong>Status</strong></p>
            <div v-if="isAdmin">
              <select
                :value="order.status"
                @change="updateOrderStatus(order._id, $event.target.value)"
                :class="`status-${order.status}`"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div v-else>
              <p :class="`status-${order.status}`">{{ order.status }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <p>No orders yet.</p>
      </div>
    </div>
    <!-- Order Details Modal -->
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  name: "CartOrderPage",
  data() {
    return {
      activeTab: "Cart", // Default to Cart tab
      cart: null,
      orders: [],
      loading: false,
      error: null,
      selectedItems: [], // Track selected cart items
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getAdmin"]),
    isAdmin() {
      return this.getAdmin;
    },
  },
  methods: {
    async fetchCart() {
      try {
        this.loading = true;
        const response = await axios.get("/carts/me");
        this.cart = response.data.data;
        console.log("Cart:", this.cart);
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          "Failed to fetch cart. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    async fetchOrders() {
      try {
        const response = await axios.get("/orders/me");
        this.orders = response.data.data;
        console.log("Orders:", this.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    },

    async fetchAllOrders() {
      try {
        const response = await axios.get("/orders/");
        this.orders = response.data.data;
        console.log("Orders:", this.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    },

    async updateOrderStatus(orderId, newStatus) {
      try {
        await axios.put(`/orders/${orderId}`, { status: newStatus });
        alert(`Order status updated to ${newStatus}`);
        this.fetchOrders(); // Refresh the orders list
      } catch (error) {
        console.error("Failed to update order status:", error);
        alert("Failed to update order status. Please try again.");
      }
    },

    async updateQuantity(item, change) {
      try {
        const updatedQuantity = item.quantity + change;
        if (updatedQuantity < 1) return; // Prevent invalid quantity

        await axios.put(`/carts/${item.product._id}`, {
          quantity: updatedQuantity, // Send the new absolute quantity
        });

        this.fetchCart(); // Refresh cart data after update
      } catch (err) {
        console.error("Failed to update quantity:", err);
      }
    },

    async removeFromCart(item) {
      try {
        await axios.delete(`/carts/${item.product._id}`);
        this.fetchCart(); // Refresh cart data
      } catch (err) {
        console.error("Failed to remove item from cart:", err);
      }
    },

    calculateTotalPrice() {
      return this.selectedItems.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
    },

    async confirmOrder() {
      try {
        // Map selected items to match API payload structure
        const selectedItemsPayload = this.selectedItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        }));

        // Send POST request to create an order
        const response = await axios.post("/orders/", {
          products: selectedItemsPayload,
        });

        alert("Order placed successfully!");
        console.log("Order Response:", response.data);

        // Refresh cart and orders data after placing the order
        this.fetchCart();
        this.fetchOrders();

        // Clear selected items
        this.selectedItems = [];
      } catch (err) {
        console.error("Failed to confirm order:", err);
        alert(err.response?.data?.message || "Failed to confirm order.");
      }
    },
  },
  created() {
    this.fetchCart();
    if (this.isAdmin) {
      this.fetchAllOrders(); // Fetch all orders if the user is an admin
    } else {
      this.fetchOrders(); // Fetch user-specific orders otherwise
    }
  },
};
</script>

<style scoped>
.cart-order-page {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
}

h1 {
  text-align: center;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

.tabs button.active {
  background-color: green;
  color: white;
  font-weight: bold;
}

/* Cart List */
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-card {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 2fr 1fr 1fr;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  gap: 10px;
  background-color: #f9f9f9;
}

/* Column Styling */
.cart-column {
  text-align: center;
}

.image-column img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.details-column h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.details-column p {
  margin: 5px 0;
  color: #666;
}

.quantity-column {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.quantity-button {
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
}

.delete-button {
  background-color: #ff4d4d;
  color: white;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button {
  background-color: #28a745;
  color: white;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  color: #666;
}

.confirm-order {
  text-align: center;
  margin-top: 20px;
}

.select-column input {
  transform: scale(1.2);
  cursor: pointer;
}

.confirm-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.confirm-order-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.confirm-order-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  display: grid;
  grid-template-columns: 5fr 3fr 3fr 2fr;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
  gap: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

/* Order Columns */
.order-column {
  text-align: center;
}

.product-list-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-list-column li {
  font-size: 14px;
  color: #444;
}

.view-details-button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.view-details-button:hover {
  background-color: #0056b3;
}

/* Status Label Colors */
.status-pending {
  color: orange;
  font-weight: bold;
}

.status-completed {
  color: green;
  font-weight: bold;
}

.status-cancelled {
  color: red;
  font-weight: bold;
}

/* Dropdown Styling */
.status-column select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-weight: bold;
  text-transform: capitalize;
}

/* Dropdown Styling */
.black-text {
  color: black;
}

.status-column select.status-pending {
  background-color: #fff8e1;
  color: orange;
}

.status-column select.status-completed {
  background-color: #e8f5e9;
  color: green;
}

.status-column select.status-cancelled {
  background-color: #ffebee;
  color: red;
}
</style>
