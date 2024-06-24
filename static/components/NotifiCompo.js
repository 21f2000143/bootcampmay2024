const NotifiCompo = Vue.component('NotifiCompo', {
  template: `
  <div class="container">
    <div class="row">
        <!-- Repeat the following structure for each notification -->
        <div v-for="item in this.$store.state.notifications" class="col-md-6">
            <div class="notification-item">
                <!-- Notification Message -->
                <p>{{ item.message }}</p>

                <!-- Message Status -->
                <p class="message-status">Status: {{ item.state }}</p>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <button class="btn btn-success" @click="approve(item.id)">Approve</button>
                    <button class="btn btn-danger" @click="decline(item.id)">Decline</button>
                </div>
            </div>
        </div>
        <div v-if="this.$store.state.notifications.length == 0">
            <h5>No notifications</h5>
        </div>
    </div>
  </div>
    `,
  methods: {
    async decline(id) {
      try {
        const response = await fetch('http://127.0.0.1:5000/decline/'+id, {
          method: 'GET',
          headers: {
            
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          this.$store.commit('deleteNotification', id)
          alert(data.message);
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async approve(id) {
      try {
        const response = await fetch('http://127.0.0.1:5000/approve/'+id, {
          method: 'GET',
          headers: {
            
          },
        });
        if (response.status === 201) {
          const data = await response.json();
          console.log("added requested category", data.type=='category')
          if(data.type=='manager')
            this.$store.commit('addManager', data.resource)
          else if (data.type==='category'){
            this.$store.commit('addCat', data.resource)
            console.log("added requested category")
          }
          else if (data.type=='product')
            this.$store.commit('addProduct', data.resource)
          else if (data.type=='category update')
            this.$store.commit('updateCategory', data.resource)
          else if (data.type=='category delete')
            this.$store.commit('deleteCategory', data.resource.id)
          else if (data.type=='product update')
            this.$store.commit('updateProduct', data.resource)
          else if (data.type=='product delete')
            this.$store.commit('deleteProduct', data.resource)
          this.$store.commit('deleteNotification', id)
          alert(data.message);
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
})
export default NotifiCompo;