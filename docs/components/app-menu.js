Vue.component('app-menu', {
    template: `
        <div class="row">
            <div class="col-sm">
                <div class="btn-group" role="group">
                    <router-link to="/" class="btn btn-secondary btn-sm">home</router-link>
                    <router-link to="/gdax-price" class="btn btn-secondary btn-sm">price</router-link>
                    <router-link to="/daily-high-low" class="btn btn-secondary btn-sm">graph</router-link>
                </div>
            </div>
            <div class="col-sm text-right">
                <button v-if="autoPlayRoutes" v-on:click="toggleAutoPlayRoutes()" class="btn btn-primary btn-sm">autoplay: ENABLED</button>
                <button v-if="!autoPlayRoutes" v-on:click="toggleAutoPlayRoutes()" class="btn btn-secondary btn-sm">autoplay: DISABLED</button>
            </div>
        </div>
    `,
    data: function () {
        return {
            autoPlayRoutes: autoPlayRoutes
        }
    },
    methods: {
        toggleAutoPlayRoutes: function () {
            autoPlayRoutes = !autoPlayRoutes;
            this.autoPlayRoutes = autoPlayRoutes;
        }
    },
    created: function () {
    }
});
