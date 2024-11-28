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

      <!-- Cart Table -->
      <div v-if="cart && cart.items.length > 0">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart.items" :key="item._id">
              <td>
                <img
                  v-if="item.product && item.product.image"
                  :src="item.product.image"
                  alt="Product Image"
                  class="product-image"
                />
                <span v-else>No Image</span>
              </td>
              <td>
                {{ item.product ? item.product.name : "Unknown Product" }}
              </td>
              <td>
                {{ item.product ? `$${item.product.price.toFixed(2)}` : "-" }}
              </td>
              <td>
                <button
                  @click="updateQuantity(item, -1)"
                  :disabled="item.quantity <= 1"
                >
                  -
                </button>
                {{ item.quantity }}
                <button @click="updateQuantity(item, 1)">+</button>
              </td>
              <td>
                {{
                  item.product
                    ? `$${(item.product.price * item.quantity).toFixed(2)}`
                    : "-"
                }}
              </td>
              <td>
                <button class="delete-button" @click="removeFromCart(item)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Confirm Order Button -->
        <div class="confirm-order">
          <button class="confirm-button" @click="confirmOrder">
            Confirm Order
          </button>
        </div>
      </div>

      <!-- Empty Cart Message -->
      <div v-else-if="cart && cart.items.length === 0" class="empty-cart">
        Your cart is empty.
      </div>
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'Order'" class="tab-content">
      <div v-if="orders.length > 0">
        <ul class="order-list">
          <li v-for="order in orders" :key="order._id">
            <h3>Order #{{ order._id }}</h3>
            <p>Total Items: {{ order.items.length }}</p>
            <p>Placed At: {{ new Date(order.createdAt).toLocaleString() }}</p>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No orders yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CartOrderPage",
  data() {
    return {
      activeTab: "Cart", // Default to Cart tab
      cart: null,
      orders: [],
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchCart() {
      try {
        this.loading = true;
        const response = await axios.get("/carts/me");
        this.cart = response.data.data;
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
      } catch (err) {
        console.error("Failed to fetch orders:", err);
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

    async confirmOrder() {
      try {
        await axios.post("/orders", { items: this.cart.items });
        this.fetchCart(); // Clear cart after order confirmation
        this.fetchOrders(); // Refresh orders list
        alert("Order placed successfully!");
      } catch (err) {
        console.error("Failed to confirm order:", err);
        alert("Failed to confirm order. Please try again.");
      }
    },
  },
  created() {
    this.fetchCart();
    this.fetchOrders();
  },
};
</script>

<style scoped>
.cart-order-page {
  max-width: 800px;
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
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.tabs button:not(:last-child) {
  margin-right: 5px;
}

/* Table */
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.cart-table th,
.cart-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.cart-table th {
  background-color: #f4f4f4;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

/* Actions */
button {
  cursor: pointer;
  border: none;
  padding: 5px 10px;
  margin: 2px;
}

button.delete-button {
  background-color: #ff4d4d;
  color: white;
}

button.confirm-button {
  background-color: #28a745;
  color: white;
}

.confirm-order {
  text-align: center;
}

.empty-cart {
  text-align: center;
  color: #666;
}

.order-list {
  list-style: none;
  padding: 0;
}

.order-list li {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
