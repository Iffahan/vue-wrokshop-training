<template>
  <div class="cart-page">
    <h1>Your Cart</h1>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="cartItems.length > 0">
      <div v-for="item in cartItems" :key="item.product._id" class="cart-item">
        <v-img :src="item.product.image" alt="Product Image" height="100px" />
        <div>
          <span class="product-name">{{ item.product.name }}</span>
          <span class="quantity">Quantity: {{ item.quantity }}</span>
          <span class="price">${{ item.product.price * item.quantity }}</span>
        </div>
      </div>
      <v-btn color="green" @click="checkout">Checkout</v-btn>
    </div>
    <div v-else class="no-items">Your cart is empty.</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cartItems: [],
      loading: false,
      error: "",
    };
  },
  methods: {
    async fetchCart() {
      this.loading = true;
      try {
        const response = await axios.get("/carts/me", {
          withCredentials: true,
        });

        if (response.data.success) {
          this.cartItems = response.data.cart;
        } else {
          this.error = "Failed to fetch cart.";
        }
      } catch (error) {
        this.error = "An error occurred while fetching the cart.";
      } finally {
        this.loading = false;
      }
    },
    checkout() {
      // Implement checkout functionality
      console.log("Proceeding to checkout...");
    },
  },
  mounted() {
    this.fetchCart();
  },
};
</script>

<style scoped>
.cart-page {
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.product-name {
  font-weight: bold;
}

.quantity {
  margin-left: 10px;
}

.price {
  margin-left: 10px;
}

.no-items {
  color: gray;
}

.loading {
  color: blue;
}

.error {
  color: red;
}
</style>
