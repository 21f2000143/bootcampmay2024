const CreateProCompo = Vue.component('CreateProCompo', {
  template: `
  <div class="row justify-content-center m-3 text-color-light">
  <div class="card bg-light" style="width: 36rem;">
    <div class="card-body">
    <div class="d-flex justify-content-end">
      <button type="button" class="btn-close" aria-label="Close" @click="closeCard"></button>
      </div>
        <h5 class="card-title">Add Product</h5>
        <form @submit.prevent="addProduct" enctype="multipart/form-data">
        <label class="form-label" for="name">Product Name:</label>
        <input class="form-control" v-model="product.name" type="text" id="name" name="name" required>
        <br>

        <label class="form-label" for="quantity">Quantity:</label>
        <input class="form-control" v-model="product.quantity" type="number" id="quantity" name="quantity" required>
        <br>

        <label class="form-label" for="manufacture">Manufacture Date:</label>
        <input class="form-control" v-model="product.manufacture" type="date" id="manufacture" name="manufacture" required>
        <br>

        <label class="form-label" for="expiry">Expiry Date:</label>
        <input class="form-control" v-model="product.expiry" type="date" id="expiry" name="expiry" required>
        <br>

        <label class="form-label" for="rpu">Rate Per Unit:</label>
        <input class="form-control" v-model="product.rpu" type="number" id="rpu" name="rpu" step="0.01" required>
        <br>

        <label class="form-label" for="description">description:</label>
        <textarea class="form-control" v-model="product.description" type="text" id="description" name="description" required></textarea>
        <br>
        <label class="form-label" for="Select Category">Select Category:</label>
        <select class="form-select" name="Select Category" id="Select Category"
            v-model="product.category_id" required>
            <option v-for="category in this.$store.state.categories" :key="category.id" :value="category.id">{{category.name}}</option>
        </select>        
        <label class="form-label" for="unit">Unit:</label>
        <select class="form-select" name="Select Unit"
        v-model="product.unit" required>
            <option  value="l">l</option>
            <option  value="ml">ml</option>
            <option  value="g">g</option>
            <option  value="kg">kg</option>
            <option  value="m">m</option>
            <option  value="cm">cm</option>
            <option  value="inch">inch</option>
            <option  value="piece">piece</option>
            <option  value="dozen">dozen</option>
            </select>
        <br>

        <label class="form-label" for="image">Image:</label>
        <input class="form-control" type="file" id="image" @change="handleFileUpload" accept="image/*" required>
        <br>
        <input type="submit" class="btn btn-outline-primary" value="Add Product">
      </form>
    </div>
  </div>
</div>
    `,
  data() {
    return {
      product: {
        name: '',
        quantity: 0,
        manufacture: '',
        expiry: '',
        rpu: 0,
        unit: '',
        description: '',
        image: null,
        category_id: ''
      }
  }
},
  methods: {
    closeCard(){
      if(this.$store.state.authenticatedUser.role==='admin'){
        if(this.$route.path!='/admin'){
          this.$router.push('/admin')
        }
      }
      else{
        if(this.$route.path!='/manager'){
          this.$router.push('/manager')
        }
      }
    },
    handleFileUpload(event) {
      this.product.image = event.target.files[0];
    },       
    async addProduct() {
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('quantity', this.product.quantity);
      formData.append('manufacture', this.product.manufacture);
      formData.append('expiry', this.product.expiry);
      formData.append('rpu', this.product.rpu);
      formData.append('unit', this.product.unit);
      formData.append('description', this.product.description);
      formData.append('image', this.product.image);
      formData.append('category_id', this.product.category_id);
      try {
        const response = await fetch('http://127.0.0.1:5000/add/product',{
          method: 'POST',
          headers: {
            
          },
          body: formData,
        });
        if (response.status === 201) {
          const data = await response.json();
          console.log(data.resource)
          if(this.$store.state.authenticatedUser.role==='admin'){
            this.$store.commit('addProduct', data.resource)
          }
          else{
            this.$store.commit('addNoti', data.resource)
          }           
          this.closeCard()
        } else if(response.status === 409){ 
          const data = await response.json();
          alert(data.message);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
})
export default CreateProCompo;