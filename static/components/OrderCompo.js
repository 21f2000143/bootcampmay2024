const OrderCompo = Vue.component('OrderCompo', {
  template: `
  <div class="container mt-5">
  <div class="row item-container">
      <!-- Item 1 -->
      <div v-for="(item, index) in this.$store.state.orders" :key="index" class="col-md-4">
          <div class="item">
              <img :src="'data:image/jpeg;base64,' + item.image" alt="item.product_name" class="product-image">
              <p>Quantity: {{ item.quantity }}</p>
              <p>Price: &#8377; {{ item.total }}</p>
              <button class="btn btn-success buy-again-btn" disabled>{{ item.order_date }}</button>
            <div v-if="item.rate>0" class="star-rating">
                <i v-for="n in item.rate" :key="n" class="fas fa-star"></i>
            </div>
            <div v-else class="star-rating pointer-on-hover">
                <i v-for="n in 5" :key="n" @click="rate(item.id, n)" class="far fa-star"></i>                
            </div>
          </div>
      </div>
      <div v-if="this.$store.state.orders.length == 0" class="col-md-12">
        <h5>No Orders Found</h5>
      </div>
  </div>
</div>
    `,

    data() {
      return {
        cartItems: [
          { name: 'Item 1', price: 10.99, quantity: 2 },
          { name: 'Item 2', price: 5.99, quantity: 3 },
          { name: 'Item 2', price: 5.99, quantity: 3 },
          { name: 'Item 2', price: 5.99, quantity: 3 },
          { name: 'Item 2', price: 5.99, quantity: 3 }
          // Add more items as needed
      ],
      }
    },
  methods: {
    async rate(id, value) {
        try {
          const response = await fetch('http://127.0.0.1:5000/update/order/'+id, {
            method: 'PUT',
            headers: {
              
              'Content-Type': 'Application/json'
            },
            body: JSON.stringify({
                'value':value
            })
          });
          if (response.status === 201) {
            const data = await response.json();
            console.log(data, "products fetched")
            this.$store.commit('updateOrder', data.resource)
            alert("Thank you for rating!")
          } else {
            const data = await response.json();
            alert(data.message);
          }
        } catch (error) {
          console.error(error);
        }
    },
  },
  mounted(){
    this.$store.dispatch('fetchOrders')
  }
})
export default OrderCompo;