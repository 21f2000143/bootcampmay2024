const CartCompo = Vue.component('CartCompo', {
  template: `
  <div class="container mt-5">
    <h2 class="text-center mb-4">Shopping Cart</h2>
    <div class="card">
        <div class="card-body">
            <!-- Cart Items -->
            <div v-for="(item, index) in this.$store.state.cart" :key="index" class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title">{{ item.product_name }}</h5>
                    <p class="mb-0">
                        <button class="btn btn-outline-secondary btn-sm" @click="decreaseQuantity(item.id)">-</button>
                        {{ item.quantity }}
                        <button class="btn btn-outline-secondary btn-sm" @click="increaseQuantity(item.id)">+</button>
                    </p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <p class="mb-0">Price: &#8377; {{ item.rpu }}</p>
                    <p class="mb-0">Subtotal: &#8377; {{ item.rpu * item.quantity }} </p>
                    <button class="btn btn-danger btn-sm" @click="removeItem(item.id)">Remove</button>
                </div>
            </div>
            <!-- Total Amount -->
            <div class="mt-4">
                <h5>Total Amount: {{ totalAmount }}</h5>
            </div>

            <!-- Pay and Confirm Button -->
            <div class="mt-4 text-center">
                <button v-if="this.$store.state.cart.length > 0" class="btn btn-success" @click="payAndConfirm">Pay and Confirm</button>
                <button v-else class="btn btn-success" disabled>Pay and Confirm</button>
            </div>
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
    async increaseQuantity(id) {
        try {
          const response = await fetch('http://127.0.0.1:5000/cart/item/increment/'+id,{
            method: 'PUT',
            headers: {
              
              'Content-Type': 'application/json',
            }
          });
          if (response.status === 201) {
            const data = await response.json();
            console.log(data.resource)
            this.$store.commit('updateToCart', data.resource)      
          }
          else {
            const data = await response.json();
            alert(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      },
    async decreaseQuantity(id) {
        try {
          const response = await fetch('http://127.0.0.1:5000/cart/item/decrement/'+id,{
            method: 'PUT',
            headers: {
              
              'Content-Type': 'application/json',
            }
          });
          if (response.status === 201) {
            const data = await response.json();
            console.log(data.resource)
            this.$store.commit('updateToCart', data.resource)      
          } else if(response.status===200){
            const data = await response.json();
            this.$store.commit('deleteToCart', data.resource)
          }
          else {
            const data = await response.json();
            alert(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      },
    async removeItem(id) {
        try {
          const response = await fetch('http://127.0.0.1:5000/cart/item/remove/'+id,{
            method: 'DELETE',
            headers: {
              
              'Content-Type': 'application/json',
            }
          });
          if (response.status === 200) {
            const data = await response.json();
            this.$store.commit('deleteToCart', data.resource)      
            console.log(data.resource)
          } 
          else {
            const data = await response.json();
            alert(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      },
    async payAndConfirm() {
        try {
          const response = await fetch('http://127.0.0.1:5000/cart/items/buy',{
            method: 'GET',
            headers: {
              
              'Content-Type': 'application/json',
            }
          });
          if (response.status === 200) {
            const data = await response.json();
            this.$store.commit('setCart', data.resource)      
            alert(data.message)
          } 
          else {
            const data = await response.json();
            alert(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      },
  },
// In your component
computed: {
    totalAmount() {
      return this.$store.getters.getTotalAmount;
    },
  },
  
})
export default CartCompo;