const ProductUserCompo = Vue.component('ProductUserCompo', {
  template: `
  <div class="container d-flex justify-content-center mt-2" style="margin-bottom: 100px; overflow-y: scroll;">
    <div class="row gap-2">
        <!-- card -->
        <div v-for="item in this.$store.state.products" :key="item.id" class="card shadow p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem;">
            <img :src="'data:image/jpeg;base64,' + item.image" class="card-img-top img-thumbnail"
                :alt="item.name">
            <div class="card-body">
                <h5 class="card-title">{{ item.name }}</h5>
                <p class="card-text"> Price: &#x20B9; {{item.rpu}}</p>
                <p class="card-text">{{item.description}}</p>
                <button v-if="item.quantity>0" class="btn btn-outline-primary" @click="addToCart(item.id, item.name, item.rpu)">Add to cart</button>
                <button v-else class="btn btn-danger" disabled>out of stock</button>
            </div>
            <div v-if="item.avg_rate" class="card-footer">
              <i v-for="n in item.avg_rate" :key="n" class="fas fa-star"></i>
            </div>            
        </div>
    </div>
</div>
  `,
  methods:{
    async addToCart(id, name, rpu) {
      try {
        const response = await fetch('http://127.0.0.1:5000/add/to/cart',{
          method: 'POST',
          headers: {
            
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "id":id,
            'name':name,
            'rpu':rpu
          }),
        });
        if (response.status === 201) {
          const data = await response.json();
          console.log(data.resource)
          this.$store.commit('addToCart', data.resource)      
        } else if(response.status===209) {
          const data = await response.json();
          alert(data.message);
          this.$store.commit('updateToCart', data.resource)
        }else if(response.status===200) {
          const data = await response.json();
          alert(data.message);
        }
        else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted(){
    this.$store.dispatch('fetchProducts')
  }  
});
export default ProductUserCompo; 
