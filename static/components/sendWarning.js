const sendWarning = Vue.component('sendWarning', {
  template: `
  <div class="row justify-content-center m-3 text-color-light">
  <div class="card bg-light" style="width: 36rem;">
    <div class="card-body">
    <div class="d-flex justify-content-end">
      <button type="button" class="btn-close" aria-label="Close" @click="closeCard"></button>
      </div>
        <h5 class="card-title">Send Warning</h5>
        <form @submit.prevent="sendWarning" enctype="multipart/form-data">
        <label class="form-label" for="message">message:</label>
        <textarea class="form-control" v-model="message" type="text" id="message" name="message" required></textarea>
        <br>
        <label class="form-label" for="Select Manager">Select Manager:</label>
        <select class="form-select" name="Select Category" id="Select Manager"
            v-model="managers.email" required>
            <option v-for="manager in managers" :key="manager.id" :value="manager.email">{{manager.email}}</option>
        </select>
        <br>        
        <input type="submit" class="btn btn-outline-primary" value="Send">
      </form>
    </div>
  </div>
</div>
    `,
    data() {
      return {
        managers: {
          id: '',
          name: '',
          email: '',
        },
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
      async fetchManagers() {
        try {
          const response = await fetch('http://127.0.0.1:5000/send/alert',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (response.status === 200) {
            const data = await response.json();
            console.log(data, "managers alerts")
            this.managers = data
            console.log(this.managers, "printed managers")
          } else if(response.status === 404) {
            alert(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      },
      async sendWarning() {
        if(confirm("Are you sure?")){
          try {
            const response = await fetch('http://127.0.0.1:5000/send/alert',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                'id': this.managers.id,
                'message': this.message,
                'email': this.managers.email
              }),
            });
            if (response.status === 200) {
              const data = await response.json();
              console.log(data, "printed data")
              alert(data.message)               
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
      this.fetchManagers()
    } 
})
export default sendWarning;