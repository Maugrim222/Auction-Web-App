import App from './App.vue'
import Home from './Home.vue'
import Auctions from './Auctions.vue'
import SingleAuction from './SingleAuction.vue'
import manageAuctions from './manageAuctions.vue'

import Vue from 'vue'

import VueRouter from 'vue-router';

Vue.use(VueRouter);

import VueResource from 'vue-resource';

Vue.use(VueResource);

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);

import Vuetify from 'vuetify'

Vue.use(Vuetify);

import 'vuetify/dist/vuetify.min.css'

/*Vue.http.options.emulateJSON = true;*/

const routes = [

  {
    path: "/",
    component: Auctions
  },

  {
    path: "/auctions",
    name: "auctions",
    component: Auctions
  },

  {
    path: "/manageAuctions",
    name: "manageAuctions",
    component: manageAuctions
  },

  {
    path: "/auctions/:auction_id",
    name: "auction",
    component: SingleAuction
  }

];


const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App),


});



