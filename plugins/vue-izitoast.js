import Vue from 'vue';
import VueIziToast from 'vue-izitoast';
 
import 'izitoast/dist/css/iziToast.css';
 
Vue.use(VueIziToast, {
  position: 'topRight',
  duration: 5000,
});