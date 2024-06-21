const RegisterCompo = Vue.component('RegisterCompo', {
  template: `
  <div class="row justify-content-center m-3 text-color-light">
  <div class="card bg-light" style="width: 18rem;">
    <div class="card-body">
    <div class="d-flex justify-content-end">
      <!-- Cross button to close the card -->
      <button type="button" class="btn-close" aria-label="Close" @click="closeCard"></button>
    </div>
      <h5 class="card-title">Sign up</h5>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Email address</label>
          <input type="email" v-model="email" class="form-control">
          <div v-if="message" class="alert alert-warning">
            {{message}}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Your Name</label>
          <input type="text" v-model="name" class="form-control" >
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" v-model="password" class="form-control">
        </div>
        <div class="mb-3">
          <select class=" input is-large" v-model="role" required>
            <option class="input is-large" value="user">User</option>
            <option class="input is-large" value="manager">Manager</option>
          </select>
        </div>
        <button type="submit" class="btn btn-outline-primary">Sign up</button>
      </form>
    </div>
  </div>
</div>
    `,
  data() {
    return {
      email: '',
      name: '',
      password: '',
      role: '',
      message: ''
    }
  },
  methods: {
    closeCard(){
      if(this.$route.path!='/'){
        this.$router.push('/')
      }
    },
    async submitForm() {
      try {
        const response = await fetch('http://127.0.0.1:5000/signup',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            "email": this.email,
            "name": this.name,
            "password": this.password,
            "role": this.role
          }),
        });
        if (response.status === 201) {
          const data = await response.json();
          alert(data.message);
          if(this.$route.path!='/login'){
            this.$router.push('/login')
            this.closeCard()
          }
        } else if(response.status === 409) {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
}
})
export default RegisterCompo;