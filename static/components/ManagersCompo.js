const ManagersCompo = Vue.component('ManagersCompo', {
  template: `
  <div class="container">
    <div class="row">
        <!-- Repeat the following structure for each manager -->
        <div class="col-md-4">
            <div v-for="item in this.$store.state.managers" :key="item.id" class="manager-profile">
                <!-- Profile Icon -->
                <img :src="'data:image/jpeg;base64,' + item.image" alt="Manager Profile" class="profile-icon">

                <!-- Basic Info -->
                <div class="basic-info">
                    <p>{{ item.email }}</p>
                    <p>Date of Joining: {{ item.doj }}</p>
                    <p>Years of Service: {{ item.exp }}</p>
                </div>
                <!-- Action Buttons -->
                <div class="action-buttons">
                    <button class="btn btn-danger" @click="deletemanager(item.id)">Delete</button>
                    <button class="btn btn-warning" @click="warn">Send Warning</button>
                </div>
            </div>
            <div v-if="this.$store.state.managers.length==0">
                <h5>No Managers Found</h5>
            </div>
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
    warn(){
      if(this.$route.path!='/admin/warning'){
        this.$router.push('/admin/warning')
      }
    },
    submitForm() {
      fetch('http://127.0.0.1:5000/signup', {
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
      })
        .then(response => {
          if (response.status == 200) {
            if(this.$route.path!='/login'){
              this.$router.push('/login')
            }
          }
          if (response.status == 409) {
            this.message = "User already exists";
          }
          return response.json()
        })
        .then(data => {
          console.log('Server response:', data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    },
    async deletemanager(id) {
      if(confirm("Are you sure?")){
        try {
          const response = await fetch('http://127.0.0.1:5000/delete/man/'+id,{
            method: 'DELETE',
            headers: {
              
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 200) {
            const data = await response.json();
            console.log(data, "printed data")
            this.$store.commit('deleteManager', data.resource)
            alert(data.message);
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
    this.$store.dispatch('fetchManagers')
  }
})
export default ManagersCompo;