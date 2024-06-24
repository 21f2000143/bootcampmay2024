const HomeView = Vue.component('HomeView', {
    template: `
      <div>
        <header class="bg-success text-white text-center py-3">
            <h1>Welcome to Eat Fresh</h1>
        </header>

        <section class="container mt-4">
            <div class="text-center">
                <h2>Explore a World of Freshness</h2>
                <p class="lead">Discover a wide range of fresh and quality groceries delivered to your doorstep.</p>
                <p class="lead">Start your shopping journey now!</p>
                
                <!-- Visit Now Button with Tooltip -->
                <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Please login or register to continue.">
                    Visit Now
                </button>

                <!-- Login and Register Buttons -->
                <div class="mt-3">
                    <a class="btn btn-outline-dark btn-sm" @click="login">Login</a>
                    <a class="btn btn-outline-dark btn-sm" @click="register">Register</a>
                </div>
            </div>
        </section>
      </div>
    `,
    methods: {
      login(){
        if(this.$route.path!='/login'){
          this.$router.push('/login')
        }
      },
      register(){
        if(this.$route.path!='/register'){
          this.$router.push('/register')
        }
      },
      async fetchUser() {
        try {
          const response = await fetch('http://127.0.0.1:5000/auth/user', {
            method: 'GET',
            headers: {
              
            }
          });
          if (response.status === 200) {
            const data = await response.json();
            console.log(data, "products fetched")
            this.$store.commit('setAuthenticatedUser', data.resource);
            if(data.resource.role=='admin'){
              if(this.$route.path!='/admin'){
                this.$router.push('/admin')
              }
            }
            else if(data.resource.role=='manager'){
              if(this.$route.path!='/manager'){
                this.$router.push('/manager')
              }
            }
            else if(data.resource.role=='user'){
              if(this.$route.path!='/user'){
                this.$router.push('/user')
              }
            }
            else{
              if(this.$route.path!='/'){
                this.$router.push('/')
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      },         
    },
    mounted(){
      this.fetchUser()
    }
  });
export default HomeView; 