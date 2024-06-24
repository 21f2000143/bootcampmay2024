const NotifiManCompo = Vue.component('NotifiManCompo', {
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
            </div>
        </div>
        <div v-if="this.$store.state.notifications.length==0">
            <h5>No notifications</h5>
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
  }
})
export default NotifiManCompo;