const EditCatCompo = Vue.component('EditCatCompo', {
  template: `
  <div class="row justify-content-center m-3 text-color-light">
  <div class="card bg-light" style="width: 18rem;">
    <div class="card-body">
    <div class="d-flex justify-content-end">
      <!-- Cross button to close the card -->
      <button type="button" class="btn-close" aria-label="Close" @click="closeCard"></button>
    </div>
      <h5 class="card-title">Add Category</h5>
      <form @submit.prevent="updatecategory">
        <div class="mb-3">
        <label for="name" class="form-label">Category Name</label>
        <input type="text" class="form-control" v-model="name" required>
          <div v-if="message" class="alert alert-warning">
            {{message}}
          </div>
        </div>
        <div class="d-flex">
        <button type="submit" class="btn btn-outline-primary me-5">Update</button>
        <a class="btn btn-outline-danger" @click="deletecategory">Delete</a>
        </div>
        </form>
    </div>
  </div>
</div>
    `,
  data() {
    return {
      name:'',
      message: ''
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
    async fetchcategory() {
      try {
        const response = await fetch('http://127.0.0.1:5000/update/'+this.$route.params.id,{
          method: 'GET',
          headers: {
            
            'Content-Type': 'application/json',
          }
        });
        if (response.status === 200) {
          const data = await response.json();
          this.name = data.name
        } else if(response.status === 404) {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updatecategory() {
      if(confirm("Are you sure?")){
        try {
          const response = await fetch('http://127.0.0.1:5000/update/'+this.$route.params.id,{
            method: 'PUT',
            headers: {
              
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: this.name
            }),
          });
          if (response.status === 201) {
            const data = await response.json();
            console.log(data, "printed data")
            if(this.$store.state.authenticatedUser.role==='admin'){
              this.$store.commit('updateCategory', data.resource)
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
    async deletecategory() {
      if(confirm("Are you sure?")){
        try {
          const response = await fetch('http://127.0.0.1:5000/update/'+this.$route.params.id,{
            method: 'DELETE',
            headers: {
              
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 201) {
            const data = await response.json();
            console.log(data, "printed data")
            if(this.$store.state.authenticatedUser.role==='admin'){
              this.$store.commit('deleteCategory', data.resource.id)
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
    }
  },
  mounted(){
    this.fetchcategory()
  }
})
export default EditCatCompo;