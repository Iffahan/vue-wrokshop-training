<template>
  <div class="shop">
    <h1>Our Products</h1>

    <!-- Create Product Button for Admin -->
    <v-btn v-if="isAdmin" color="green mb-4" dark @click="showCreateModal">
      Create Product
    </v-btn>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      absolute
      top
      right
    >
      {{ snackbar.text }}
    </v-snackbar>

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
            @click="handleSaveProduct"
            :disabled="!valid"
          >
            {{ isEditMode ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog for Deletion -->
    <v-dialog v-model="isDeleteDialogOpen" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Confirm Deletion</span>
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this product?
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeDeleteDialog">No</v-btn>
          <v-btn color="red" dark @click="confirmDelete">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading, Error, and Product List -->
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="products.length > 0" class="products-list">
      <!-- Inline ProductCard -->
      <div v-for="product in products" :key="product._id" class="product-card">
        <v-card>
          <v-img
            v-if="product.image"
            :src="product.image"
            alt="Product Image"
            height="200px"
          />
          <v-card-title>
            <span class="headline">{{ product.name }}</span>
          </v-card-title>
          <v-card-subtitle>
            <span class="price">${{ product.price }}</span>
          </v-card-subtitle>
          <v-card-text>
            <p><strong>Description:</strong> {{ product.description }}</p>
            <p><strong>Quantity:</strong> {{ product.quantity }} available</p>
          </v-card-text>
          <v-card-actions class="actions">
            <v-btn
              v-if="isAdmin"
              icon
              color="red"
              @click="openDeleteDialog(product._id)"
              aria-label="Delete Product"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              v-if="isAdmin"
              icon
              color="orange"
              @click="handleEditProduct(product)"
              aria-label="Edit Product"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              color="green"
              class="custom-button"
              @click="handleAddToCart(product)"
            >
              {{ addedToCart(product) ? "Added to Cart" : "Add to Cart" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <div v-else class="no-products">No products available.</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      loading: false,
      error: "",
      isCreateModalOpen: false,
      isEditMode: false, // Flag to differentiate between create and edit modes
      isDeleteDialogOpen: false, // Track the delete dialog state
      productToDelete: null, // Store the product ID to delete
      newProduct: {
        _id: "", // Add this field to hold the product ID for editing
        name: "",
        price: "",
        description: "",
        quantity: 1,
        image: "",
      },
      imageFile: null, // Store the image file object
      valid: false,
      cart: [],
      snackbar: {
        show: false,
        text: "",
        color: "",
      },
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
      this.isEditMode = false; // Set to create mode
    },
    closeCreateModal() {
      this.isCreateModalOpen = false;
      this.isEditMode = false; // Reset to create mode
      this.newProduct = {
        _id: "",
        name: "",
        price: "",
        description: "",
        quantity: 1,
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
    async updateProduct() {
      try {
        const response = await axios.put(
          `/products/${this.newProduct._id}`,
          this.newProduct,
          { withCredentials: true }
        );
        if (response.data.success) {
          this.fetchProducts();
          this.closeCreateModal();
          console.log("Product updated successfully:", response.data.product);
        } else {
          this.error = "Failed to update product.";
        }
      } catch (err) {
        this.error = "An error occurred while updating the product.";
      }
    },
    async handleAddToCart(product) {
      try {
        // Construct the payload
        const payload = {
          productId: product._id,
          quantity: 1, // Default quantity set to 1
        };

        // Make the API request
        const response = await axios.post("/carts", payload, {
          withCredentials: true,
        });

        // Check if the request was successful
        if (response.data.success || response.status === 200) {
          console.log("Product added to cart successfully:", response.data);
          // this.$notify({ type: "success", text: "Product added to cart!" });
          this.showSnackbar("Product added to cart!", "success");
        } else {
          throw new Error("Unexpected response from the server.");
        }
      } catch (err) {
        console.error(err);
        this.showSnackbar(err.message, "error");
        // this.$notify({ type: "error", text: "Failed to add product to cart." });
      }
    },

    addedToCart(product) {
      return this.cart.includes(product._id);
    },

    async handleDeleteProduct(productId) {
      try {
        const response = await axios.delete(`/products/${productId}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          this.products = this.products.filter((p) => p._id !== productId);
          console.log("Product deleted successfully");
        } else {
          this.error = "Failed to delete product.";
        }
      } catch (err) {
        this.error = "An error occurred while deleting the product.";
      }
    },
    handleEditProduct(product) {
      this.newProduct = { ...product }; // Populate form with product details
      this.isCreateModalOpen = true;
      this.isEditMode = true; // Set to edit mode
    },
    handleSaveProduct() {
      if (this.isEditMode) {
        this.updateProduct(); // Call updateProduct for editing
      } else {
        this.createProduct(); // Call createProduct for new product
      }
    },
    openDeleteDialog(productId) {
      this.productToDelete = productId;
      this.isDeleteDialogOpen = true;
    },
    closeDeleteDialog() {
      this.isDeleteDialogOpen = false;
      this.productToDelete = null;
    },
    async confirmDelete() {
      try {
        const response = await axios.delete(
          `/products/${this.productToDelete}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          this.products = this.products.filter(
            (p) => p._id !== this.productToDelete
          );
          this.productToDelete = null;
          this.closeDeleteDialog();
        } else {
          this.error = "Failed to delete product.";
        }
      } catch (err) {
        this.error = "An error occurred while deleting the product.";
      }
    },
    showSnackbar(message, color = "success") {
      this.snackbar = { show: true, text: message, color };
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

.product-card {
  margin: 10px;
}

.custom-button {
  color: white;
  font-weight: bold;
}
</style>
