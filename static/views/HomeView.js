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
              

                <!-- Login and Register Buttons -->
                <div class="mt-3">
                    <a class="btn btn-outline-dark btn-sm" >Login</a>
                    <a class="btn btn-outline-dark btn-sm" >Register</a>
                </div>
            </div>
        </section>
      </div>
    `,
  });
export default HomeView; 