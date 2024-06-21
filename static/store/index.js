const store = new Vuex.Store({
  state: {
    products: [],
    categories: [],
    notifications: [],
    managers: [],
    cart: [],
    orders: [],
    authenticatedUser:'',
  },
  getters: {
    getProducts: (state) => state.products,
    getCategories: (state) => state.categories,
    getNotifications: (state) => state.notifications,
    getManagers: (state) => state.managers,
    getCart: (state) => state.cart,
    getOrders: (state) => state.orders,
    getAuthenticatedUser: (state) => state.authenticatedUser,
    getTotalAmount: (state) => {
      return state.cart.reduce((total, cart) => total + cart.quantity * cart.rpu, 0);
    },
  },
  mutations: {
    setProducts: (state, products) => {
      state.products = products;
    },
    setCategories: (state, categories) => {
      state.categories = categories;
    },
    setNotifications: (state, notifications) => {
      state.notifications = notifications;
    },
    setManagers: (state, managers) => {
      state.managers = managers;
    },
    setCart: (state, cart) => {
      state.cart = cart;
    },
    setOrders: (state, orders) => {
      state.orders = orders;
    },
    setAuthenticatedUser: (state, user) => {
      state.authenticatedUser = user;
    },
    addProduct: (state, newProduct) => {
      state.products.push(newProduct);
    },
    addCat: (state, newCategory) => {
      state.categories.push(newCategory);
    },
    addToCart: (state, newProduct) => {
      state.cart.push(newProduct);
    },
    addNoti: (state, newNoti) => {
      state.notifications.push(newNoti);
    },

    // Mutation for updating a product
    updateCategory: (state, updatedCategory) => {
      const index = state.categories.findIndex(p => p.id === updatedCategory.id);
      if (index !== -1) {
        // Replace the existing product with the updated one
        state.categories.splice(index, 1, updatedCategory);
      }
    },

    updateOrder: (state, updatedOrder) => {
      const index = state.orders.findIndex(p => p.id === updatedOrder.id);
      if (index !== -1) {
        // Replace the existing product with the updated one
        state.orders.splice(index, 1, updatedOrder);
      }
    },
    updateProduct: (state, updatedProduct) => {
      const index = state.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        // Replace the existing product with the updated one
        state.products.splice(index, 1, updatedProduct);
      }
    },
    updateToCart: (state, updatedProduct) => {
      const index = state.cart.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        // Replace the existing product with the updated one
        state.cart.splice(index, 1, updatedProduct);
      }
    },

    // Mutation for deleting a product
    deleteToCart: (state, itemId) => {
      state.cart = state.cart.filter(p => p.id !== itemId);
    },
    deleteCategory: (state, categoryId) => {
      state.categories = state.categories.filter(p => p.id !== categoryId);
    },
    // Mutation for deleting a product
    deleteProduct: (state, productId) => {
      state.products = state.products.filter(p => p.id !== productId);
    },

    // Similar mutations for categories, notifications, managers, cart, and orders
    // ...

    // Mutation for adding a new manager
    addManager: (state, newManager) => {
      state.managers.push(newManager);
    },

    // Mutation for updating a manager
    updateManager: (state, updatedManager) => {
      const index = state.managers.findIndex(m => m.id === updatedManager.id);
      if (index !== -1) {
        // Replace the existing manager with the updated one
        state.managers.splice(index, 1, updatedManager);
      }
    },

    // Mutation for deleting a manager
    deleteManager: (state, managerId) => {
      state.managers = state.managers.filter(m => m.id !== managerId);
    },
    deleteNotification: (state, notifiId) => {
      state.notifications = state.notifications.filter(m => m.id !== notifiId);
    },
    // ... Repeat similar mutations for other arrays (cart, orders, notifications, categories)
  },
  actions: {
  // Implement similar actions for other arrays (categories, notifications, etc.)

  // Example action for updating a product
  async updateProduct({ commit }, updatedProduct) {
    // Perform API call to update product
    // Example API call:
    // await api.updateProduct(updatedProduct);
    // After successful update, commit mutation to update state
    // commit('updateProduct', updatedProduct);
  },

  // Example action for deleting a product
  async deleteProduct({ commit }, productId) {
    // Perform API call to delete product
    // Example API call:
    // await api.deleteProduct(productId);
    // After successful deletion, commit mutation to update state
    // commit('deleteProduct', productId);
  },
  async fetchOrders({ commit }) {
    try {
      const response = await fetch('http://127.0.0.1:5000/get/orders', {
        method: 'GET',
        headers: {
          
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data, "products fetched")
        commit('setOrders', data);;
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async fetchCartItems({ commit }) {
    try {
      const response = await fetch('http://127.0.0.1:5000/get/cart/items', {
        method: 'GET',
        headers: {
          
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data, "products fetched")
        commit('setCart', data);;
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async fetchProducts({ commit }) {
    try {
      const response = await fetch('http://127.0.0.1:5000/get/products', {
        method: 'GET',
        headers: {
          
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data, "products fetched")
        commit('setProducts', data);;
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async fetchAuthUser({ commit }) {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/user', {
        method: 'GET',
        headers: {
          
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data, "categories fetched")
        commit('setAuthenticatedUser', data.resource);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async fetchManagers({ commit }) {
    try {
      const response = await fetch('http://127.0.0.1:5000/get/all/managers', {
        method: 'GET',
        headers: {
          
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data, "categories fetched")
        commit('setManagers', data.resource);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async fetchNoti({ commit }) {
    try {
      const response = await fetch('http://127.0.0.1:5000/get/all/noti', {
        method: 'GET',
        headers: {
          
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data, "categories fetched")
        commit('setNotifications', data.resource);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async fetchCategories({ commit }) {
    try {
      const response = await fetch('http://127.0.0.1:5000/get/categories', {
        method: 'GET',
        headers: {
          
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data, "categories fetched")
        commit('setCategories', data);;
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
},
});
export default store;