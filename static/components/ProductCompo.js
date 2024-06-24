const ProductCompo = Vue.component('ProductCompo', {
  template: `
  <div class="container d-flex justify-content-center mt-2">
    <div class="row gap-2">
        <div v-for="item in this.$store.state.products" :key="item.id"
            class="card shadow p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem;">
            <img :src="'data:image/jpeg;base64,' + item.image" class="card-img-top img-thumbnail" :alt="item.name">
            <div class="card-body">
                <h5 class="card-title">{{ item.name }}</h5>
                <p class="card-text"> Price: &#x20B9; {{item.rpu}}</p>
                <p class="card-text">{{item.description}}</p>
                <button class="btn btn-dark" @click="editPro(item.id)">Edit</button>
            </div>
            <div v-if="item.avg_rate" class="card-footer">
              <i v-for="n in item.avg_rate" :key="n" class="fas fa-star"></i>
            </div>
        </div>
        <div v-if="this.$store.state.products.length == 0">
            <h5>No Products</h5>
        </div>
    </div>
  </div>
  `,
  methods: {
    editPro(id) {
      if (this.$route.path != '/admin/pro/edit/' + id) {
        this.$router.push('/admin/pro/edit/' + id)
      }
    },
  },
  mounted() {
    this.$store.dispatch('fetchProducts')
  }
});
export default ProductCompo; 
