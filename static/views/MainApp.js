const MainApp = Vue.component('MainApp', {
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
                        <a class="nav-link pointer-on-hover" @click="createCat">Add category</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link pointer-on-hover" @click="createPro">Add product</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link pointer-on-hover" href="#">Managers</a>
                    </li>
                </ul>

                <!-- Search Bar -->
                <form class="d-flex ms-auto">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-light" type="submit">Search</button>
                </form>

                <a href="#" class="nav-link ms-auto">
                    <i class="fas fa-bell" style="font-size: 1.5rem; color: white;"></i>
                </a>                
            </div>
        </div>
    </nav>
    <main>
    <div class="sidebar bg-black">
        <div class="sidebar-icon mb-5">
            <!-- Add your icon or content here -->
            <span style="color: #343a40; font-size: 24px;"><img src="/static/Mark-Zuckerberg.jpg" alt="Profile"
                    style="width: 100%; border-radius: 50%;"></span>
            <a href="#">change</a>
        </div>
        <ul class="list-group">
            <li class="list-group-item">
                <input class="form-check-input me-1" type="radio" name="listGroupRadio" value="" id="firstRadio"
                    checked>
                <label class="form-check-label" for="firstRadio">First radio</label>
            </li>
            <li class="list-group-item">
                <input class="form-check-input me-1" type="radio" name="listGroupRadio" value="" id="secondRadio">
                <label class="form-check-label" for="secondRadio">Second radio</label>
            </li>
            <li class="list-group-item">
                <input class="form-check-input me-1" type="radio" name="listGroupRadio" value="" id="thirdRadio">
                <label class="form-check-label" for="thirdRadio">Third radio</label>
            </li>
        </ul>
        <!-- Add any sidebar content here -->
    </div>
    <router-view></router-view>
</main>
    <footer class="bg-success text-white text-center py-2">
        &copy; 2023 Eat Fresh. All rights reserved.
    </footer>
</div>
    `,
    methods: {
        home(){
            if(this.$route.path!='/admin'){
                this.$router.push('/admin')
            }
        },
        createCat(){
            if(this.$route.path!='/admin/cat/create'){
                this.$router.push('/admin/cat/create')
            }
        },
        editCat(){
            if(this.$route.path!='/admin/cat/edit'){
                this.$router.push('/admin/cat/edit')
            }
        },
        createPro(){
            if(this.$route.path!='/admin/pro/create'){
                this.$router.push('/admin/pro/create')
            }
        },
        editPro(){
            if(this.$route.path!='/admin/pro/edit'){
                this.$router.push('/admin/pro/edit')
            }
        }
    }
  });
export default MainApp; 
