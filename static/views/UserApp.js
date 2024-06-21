const UserApp = Vue.component('UserApp', {
    template: `
    <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-success">
        <div class="container">
            <a class="navbar-brand" href="#">Eat Fresh</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link pointer-on-hover" @click="home">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link pointer-on-hover" @click="orders">Your Orders</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link pointer-on-hover" @click="shareViaWhatsApp" >Refer</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link pointer-on-hover" @click="logout">logout</a>
                    </li>
                </ul>

                <!-- Search Bar -->
                <form class="d-flex ms-auto" @submit.prevent="search">
                    <input class="form-control me-2" type="search" v-model="query" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-light" type="submit">Search</button>
                </form>

                <a @click="cart" class="nav-link pointer-on-hover ms-auto position-relative">
                    <i class="fas fa-shopping-cart" style="font-size: 1.5rem; color: white;"></i>
                    <!-- Badge for cart items -->
                    <span v-show="this.$store.state.cart.length > 0" class="badge bg-danger position-absolute top-0 start-100 translate-middle" v-if="cartItemsCount > 0">
                        {{ this.$store.state.cart.length }}
                    </span>
                </a>              
            </div>
        </div>
    </nav>
    <main>
    <div class="sidebar bg-black">
        <div class="sidebar-icon mb-5">
            <!-- Add your icon or content here -->
            <span style="color: #343a40; font-size: 24px; display: inline-block; overflow: hidden; width: 100px; height: 100px; border-radius: 50%;">
                <img v-if="this.$store.state.authenticatedUser.image" :src="'data:image/jpeg;base64,' + this.$store.state.authenticatedUser.image" alt="Profile"
                    style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                <i v-else class="fas fa-user" style="font-size: 100%;"></i>
            </span>
            <a class="pointer-on-hover" @click="change">change</a>
            <form v-if="picUpdate" @submit.prevent="updatePic" enctype="multipart/form-data">
                <label class="form-label" for="image">upload</label>
                <input class="form-control" type="file" id="image" @change="handleFileUpload" accept="image/*" required>
                <br>
                <input type="submit" class="btn btn-outline-secondary" value="update">
            </form>
        </div>
        <ul class="list-group">
            <li class="list-group-item" v-for="category in this.$store.state.categories" :key="category.id">
                <input @click="searchByCat(category.name, category.id)" class="form-check-input me-1 pointer-on-hover" type="radio" :name="category.name" :value="category.id" :id="category.id" :checked="checkedValue === category.id" >
                <label class="form-check-label" :for="category.id">{{ category.name }}</label>
            </li>
        </ul>
    </div>
    <router-view></router-view>
</main>
    <footer class="bg-success text-white text-center py-2">
        &copy; 2023 Eat Fresh. All rights reserved.
    </footer>
</div>
    `,
    data() {
        return {
            cartItemsCount: 3,
            picUpdate:false,
            profilePic:null,            
            query:'', // Replace this with the actual count of items in your shopping cart,
            checkedValue:-1
        };
    },
    methods: {
        handleFileUpload(event) {
            this.profilePic = event.target.files[0];
        },               
        home(){
            if(this.$route.path!='/user'){
                this.$router.push('/user')
            }
        },
        createCat(){
            if(this.$route.path!='/user/cat/create'){
                this.$router.push('/user/cat/create')
            }
        },
        editCat(){
            if(this.$route.path!='/user/cat/edit'){
                this.$router.push('/user/cat/edit')
            }
        },
        createPro(){
            if(this.$route.path!='/user/pro/create'){
                this.$router.push('/user/pro/create')
            }
        },
        notifi(){
            if(this.$route.path!='/user/notifications'){
                this.$router.push('/user/notifications')
            }
        },
        async logout() {
            try {
              const response = await fetch('http://127.0.0.1:5000/logout', {
                method: 'GET',
                headers: {
                  
                },
              });
              if (response.status === 200) {
                const data = await response.json();
                this.$store.commit('setAuthenticatedUser', '')
                if(this.$route.path!='/'){
                    this.$router.push('/')
                }                
              } else {
                const data = await response.json();
                alert(data.message);
              }
            } catch (error) {
              console.error(error);
            }
          }, 
        stats(){
            if(this.$route.path!='/user/report'){
                this.$router.push('/user/report')
            }
        },
        async searchByCat(catName, catId) {
            this.checkedValue=catId;
            try {
                const response = await fetch('http://127.0.0.1:5000/search/by/catgory',{
                  method: 'POST',
                  headers: {
                    
                    'Content-type': 'application/json'
                  },
                  body: JSON.stringify({
                      "query": catName
                    }),
                });
                if (response.status === 200) {
                  const data = await response.json();
                  this.$store.commit('setProducts', data.pro)
                  console.log(data.resource)
              } else {
                  const data = await response.json();
                  alert(data.message);
                }
              } catch (error) {
                console.error(error);
              }
        },
        shareViaWhatsApp() {
            // Replace 'your_share_message' with the message you want to share
            const message = encodeURIComponent('Check out this amazing app! Join now.');
      
            // Replace 'your_web_url' with the URL of your web application
            const url = encodeURIComponent('http://127.0.0.1:5000/');
      
            // Construct the WhatsApp share URL
            const whatsappUrl = `https://api.whatsapp.com/send?text=${message}%20${url}`;
      
            // Open a new window with the WhatsApp share URL
            window.open(whatsappUrl, '_blank');
          },        
        async search() {
            try {
              const response = await fetch('http://127.0.0.1:5000/search/for',{
                method: 'POST',
                headers: {
                  
                  'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    "query": this.query
                  }),
              });
              if (response.status === 200) {
                const data = await response.json();
                this.$store.commit('setCategories', data.cat)
                this.$store.commit('setProducts', data.pro)
                console.log(data.resource)
            } else {
                const data = await response.json();
                alert(data.message);
              }
            } catch (error) {
              console.error(error);
            }
          },        
        cart(){
            if(this.$route.path!='/user/CartCompo'){
                this.$router.push('/user/CartCompo')
            }
        },
        orders(){
            if(this.$route.path!='/user/your/orders'){
                this.$router.push('/user/your/orders')
            }
        },
        change(){
            if(this.picUpdate==false){
                this.picUpdate=true
            }
        },        
        notifi() {
            // Your notification logic here
        },
        async updatePic() {
            const formData = new FormData();
            formData.append('image', this.profilePic);
            try {
              const response = await fetch('http://127.0.0.1:5000/update/profile/'+this.$store.state.authenticatedUser.id,{
                method: 'PUT',
                headers: {
                  
                },
                body: formData,
              });
              if (response.status === 201) {
                const data = await response.json();
                console.log(data.resource)
                this.$store.commit('setAuthenticatedUser', data.resource)
                this.picUpdate=false
            } else {
                alert(data.message);
              }
            } catch (error) {
              console.error(error);
            }
          }        
    },
    mounted(){
        const source = new EventSource("/stream");
        source.addEventListener(this.$store.state.authenticatedUser.email, event => {
          let data = JSON.parse(event.data);
          alert(data.message)
        }, false);
        this.$store.dispatch('fetchCategories')
        this.$store.dispatch('fetchAuthUser')
        this.$store.dispatch('fetchCartItems')
    }    
  });
export default UserApp; 
