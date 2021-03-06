import Vue from 'vue';

Vue.component('app-menu', {
    template: `
        <div class="row">
            <div class="col-sm">
                <div class="btn-group" role="group">
                    <router-link to="/" class="btn btn-secondary btn-sm">home</router-link>
                    <router-link to="/gdax-price" class="btn btn-secondary btn-sm">price</router-link>
                </div>
            </div>
            <div class="col-sm text-right">
                <button v-if="autoPlayRoutes" v-on:click="toggleAutoplay()" class="btn btn-primary btn-sm">autoplay: ENABLED</button>
                <button v-if="!autoPlayRoutes" v-on:click="toggleAutoplay()" class="btn btn-secondary btn-sm">autoplay: DISABLED</button>
            </div>
        </div>
    `,
    props: [
        'toggleAutoPlayRoutes'
    ],
    data: function () {
        return {
            autoPlayRoutes: true
        }
    },
    methods: {
        toggleAutoplay: function () {
            this.autoPlayRoutes = !this.autoPlayRoutes;
            this.toggleAutoPlayRoutes();
        }
    },
    created: function () {
    }
});
