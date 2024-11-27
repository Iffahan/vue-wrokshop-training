<template>
  <div class="shop">
    <h1>Our Products</h1>

    <!-- Create Product Button for Admin -->
    <v-btn v-if="isAdmin" color="green mb-4" dark @click="showCreateModal">
      Create Product
    </v-btn>

    <!-- Modal for Creating Product -->
    <v-dialog v-model="isCreateModalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Create New Product</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newProduct.name"
              label="Product Name"
              required
            />
            <v-text-field
              v-model="newProduct.price"
              label="Price"
              type="number"
              required
            />
            <v-textarea
              v-model="newProduct.description"
              label="Description"
              required
            />
            <v-text-field
              v-model="newProduct.quantity"
              label="Quantity Available"
              type="number"
              required
            />
            <!-- Image Upload -->
            <v-file-input
              v-model="imageFile"
              label="Product Image"
              accept="image/*"
              @change="onImageChange"
            />
            <div v-if="newProduct.image">
              <p><strong>Preview:</strong></p>
              <v-img :src="newProduct.image" max-width="200px" />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeCreateModal">Cancel</v-btn>
          <v-btn
            color="green"
            class="custom-button"
            @click="createProduct"
            :disabled="!valid"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading, Error, and Product List -->
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="products.length > 0" class="products-list">
      <ProductCard
        v-for="product in products"
        :key="product._id"
        :product="product"
        @add-to-cart="handleAddToCart"
        @delete-product="handleDeleteProduct"
        @edit-product="handleEditProduct"
      />
    </div>
    <div v-else class="no-products">No products available.</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import ProductCard from "@/components/ProductCard.vue"; // Import the ProductCard component

export default {
  components: {
    ProductCard, // Register the component
  },
  data() {
    return {
      products: [],
      loading: false,
      error: "",
      isCreateModalOpen: false,
      newProduct: {
        name: "",
        price: "",
        description: "",
        quantity: 1,
        image: "",
      },
      imageFile: null, // Store the image file object
      valid: false,
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getAdmin"]),
    isAdmin() {
      return this.getAdmin;
    },
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
        } else {
          this.error = "Failed to fetch products.";
        }
      } catch (err) {
        this.error = "An error occurred while fetching products.";
      } finally {
        this.loading = false;
      }
    },
    showCreateModal() {
      this.isCreateModalOpen = true;
    },
    closeCreateModal() {
      this.isCreateModalOpen = false;
      this.newProduct = {
        name: "",
        price: "",
        description: "",
        quantity: 0,
        image: "",
      };
      this.imageFile = null; // Reset the image file on close
    },

    onImageChange(file) {
      const reader = new FileReader();
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (file && allowedTypes.includes(file.type)) {
        reader.onloadend = () => {
          this.newProduct.image = reader.result; // Base64 image string
        };
        reader.readAsDataURL(file);
      } else {
        this.error = "Please upload a valid image file (JPEG, PNG, GIF).";
      }
    },

    async createProduct() {
      try {
        const response = await axios.post("/products", this.newProduct, {
          withCredentials: true,
        });
        if (response.data.success) {
          this.fetchProducts();
          this.closeCreateModal();
          console.log("Product created successfully:", response.data.product);
        } else {
          this.error = "Failed to create product.";
        }
      } catch (err) {
        this.error = "An error occurred while creating the product.";
      }
    },

    handleAddToCart(product) {
      console.log("Product added to cart:", product);
      // Implement the add-to-cart functionality here
    },

    async handleDeleteProduct(productId) {
      try {
        const response = await axios.delete(`/products/${productId}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          // Remove the deleted product from the local list
          this.products = this.products.filter(
            (product) => product._id !== productId
          );
          console.log("Product deleted successfully");
        } else {
          this.error = "Failed to delete product.";
        }
      } catch (err) {
        this.error = "An error occurred while deleting the product.";
      }
    },

    handleEditProduct(product) {
      this.newProduct = { ...product }; // Populate form with the product details
      this.showCreateModal(); // Reuse create modal for editing
    },
  },
  mounted() {
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.no-products {
  color: gray;
}

.custom-button {
  color: white;
  font-weight: bold;
}
</style>
