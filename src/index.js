import Vue from 'vue';
import VueRouter from 'vue-router';
import webRTCAdapter from 'webrtc-adapter';

import PageDailyHighLow from './components/page-daily-high-low';
import PageGdaxPrice from './components/page-gdax-price';
import PageHome from './components/page-home';
import PhotoBooth from './components/photo-booth';


require('./components/app-menu');
require('./components/loader.css');
require('./components/loader.js');

Vue.use(VueRouter);

const routes = [
    { path: '/', component: PageHome, pageTimeout: 10000 },
    { path: '/gdax-price', component: PageGdaxPrice, pageTimeout: 30000 },
    { path: '/daily-high-low', component: PageDailyHighLow, pageTimeout: 30000 },
    { path: '/photo-booth', component: PhotoBooth, pageTimeout: 15000 }
];

const router = new VueRouter({
    routes
});

var app = new Vue({
    el: '#app',
    router,
    data: {
        lastRouteIndex: 0,
        autoPlayRoutes: true,
    },
    created: function () {
        this.autoLoadNextPage();
    },
    methods: {
        autoLoadNextPage: function () {
            var self = this;
            self.lastRouteIndex++;
            if (self.lastRouteIndex >= routes.length) {
                self.lastRouteIndex = 0;
            }
            if (self.autoPlayRoutes) {
                router.push(routes[self.lastRouteIndex].path);
            }
            setTimeout(self.autoLoadNextPage, routes[self.lastRouteIndex].pageTimeout);
        },
        toggleAutoPlayRoutes: function () {
          this.autoPlayRoutes = !this.autoPlayRoutes;
        }
    }
});

