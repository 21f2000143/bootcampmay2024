const EditProCompo = Vue.component('EditProCompo', {
  template: `
  <div class="row justify-content-center m-3 text-color-light">
  <div class="card bg-light" style="width: 36rem;">
    <div class="card-body">
    <div class="d-flex justify-content-end">
      <button type="button" class="btn-close" aria-label="Close" @click="closeCard"></button>
      </div>
        <h5 class="card-title">Update Product</h5>
        <form @submit.prevent="updateproduct" enctype="multipart/form-data">
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

        <label class="form-label" for="description">description:</label>
        <textarea class="form-control" v-model="product.description" type="text" id="description" name="description" required></textarea>
        <br>

        <label class="form-label" for="rpu">Rate Per Unit:</label>
        <input class="form-control" v-model="product.rpu" type="number" id="rpu" name="rpu" step="0.01" required>
        <br>
        <label class="form-label" for="Select Category">Select Category:</label>
        <select class="form-select" name="Select Category"
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
        <div class="d-flex">
        <button type="submit" class="btn btn-outline-primary me-5">Update</button>
        <a class="btn btn-outline-danger" @click="deleteproduct">Delete</a>
        </div>
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
    async fetchproduct() {
      try {
        const response = await fetch('http://127.0.0.1:5000/update/product/'+this.$route.params.id,{
          method: 'GET',
          headers: {
            
          }
        });
        if (response.status === 200) {
          const data = await response.json();
          this.product = data
        } else if(response.status === 404) {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updateproduct() {
      if(confirm("Are you sure?")){
        try {
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
          const response = await fetch('http://127.0.0.1:5000/update/product/'+this.$route.params.id,{
            method: 'PUT',
            headers: {
              
            },
            body: formData,
          });
          if (response.status === 201) {
            const data = await response.json();
            console.log(data, "printed data")
            if(this.$store.state.authenticatedUser.role==='admin'){
              this.$store.commit('updateProduct', data.resource)
            }
            else{
              this.$store.commit('addNoti', data.resource)
            }                 
            this.closeCard()
          } else {
            const data = await response.json();
            alert(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async deleteproduct() {
      if(confirm("Are you sure?")){
        try {
          const response = await fetch('http://127.0.0.1:5000/update/product/'+this.$route.params.id,{
            method: 'DELETE',
            headers: {
              
            },
          });
          if (response.status === 201) {
            const data = await response.json();
            console.log(data, "printed data")
            if(this.$store.state.authenticatedUser.role==='admin'){
              this.$store.commit('deleteProduct', data.resource.id)
              alert(data.message);
            }
            else{
              this.$store.commit('addNoti', data.resource)
              alert(data.message);
            }                  
            this.closeCard()
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }    
  },
  mounted(){
    this.fetchproduct()
  }  
})
export default EditProCompo;