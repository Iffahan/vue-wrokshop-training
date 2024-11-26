<template>
  <div class="shop">
    <h1>Our Products</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="products.length > 0" class="products-list">
      <div v-for="product in products" :key="product._id" class="product-card">
        <h2>{{ product.name }}</h2>
        <p><strong>Price:</strong> ${{ product.price }}</p>
        <p><strong>Description:</strong> {{ product.description }}</p>
        <p><strong>Quantity Available:</strong> {{ product.quantity }}</p>
      </div>
    </div>
    <div v-else class="no-products">No products available.</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      loading: false,
      error: "",
    };
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = "";
      try {
        const response = await axios.get("/products", {
          withCredentials: true,
        });
        if (response.data.success) {
          this.products = response.data.products;
          console.log(this.products);
        } else {
          this.error = "Failed to fetch products.";
        }
      } catch (err) {
        this.error = "An error occurred while fetching products.";
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    // Fetch products when the page is loaded
    this.fetchProducts();
  },
};
</script>

<style scoped>
.shop {
  padding: 20px;
}

.loading {
  color: blue;
}

.error {
  color: red;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.product-card h2 {
  margin-top: 0;
}

.no-products {
  color: gray;
}
</style>
