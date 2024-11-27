<template>
  <v-card class="product-card" :key="product._id">
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

    <!-- Action Buttons (Only for Admin) -->
    <v-card-actions class="actions">
      <v-btn
        v-if="isAdmin"
        icon
        color="red"
        @click="handleDelete"
        aria-label="Delete Product"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn
        v-if="isAdmin"
        icon
        color="orange"
        @click="handleEdit"
        aria-label="Edit Product"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn color="green" class="custom-button" @click="handleAddToCart">
        {{ addedToCart ? "Added to Cart" : "Add to Cart" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      addedToCart: false, // Flag to track if the product is added to cart
    };
  },
  computed: {
    ...mapGetters(["getAdmin"]), // Mapping the getAdmin getter to the computed property
    isAdmin() {
      return this.getAdmin; // If the user is admin, return true
    },
  },
  methods: {
    async handleAddToCart() {
      try {
        // Emit add-to-cart event to parent component
        await this.$emit("add-to-cart", this.product);
        this.addedToCart = true; // Update local state
      } catch (error) {
        console.error("Failed to add product to cart:", error);
      }
    },
    handleDelete() {
      // Emit delete event to parent
      this.$emit("delete-product", this.product._id);
    },
    handleEdit() {
      // Emit edit event to parent
      this.$emit("edit-product", this.product);
    },
  },
};
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  position: relative;
}

.product-card:hover {
  transform: scale(1.05);
}

.price {
  font-weight: bold;
  color: #00b140;
}

.custom-button {
  color: white;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

.v-btn {
  min-width: 36px;
}

.v-icon {
  font-size: 24px;
}

/* Add padding and margins for better UI */
.v-card-title,
.v-card-subtitle,
.v-card-text {
  padding: 10px;
}

/* Buttons layout adjustments */
.v-btn.icon {
  padding: 0;
}
</style>
