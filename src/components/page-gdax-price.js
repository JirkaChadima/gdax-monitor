'use strict';

const PageGdaxPrice = {
    template: `
        <div>
            <loader v-if="!loaded"></loader>
            <div class="row align-items-center" style="height:430px;" v-if="loaded">
                <div class="col-sm text-center">
                    <img src="assets/ethereum-logo.png" style="height:100px;" />
                    <h1 class="display-5">ETH</h1>
                    <h3 class="display-5"><small class="text-secondary">USD</small> <span id="ETH-USD"><loader style="display:inline"></loader></span></h3>
                    <h3 class="display-5"><small class="text-secondary">EUR</small> <span id="ETH-EUR"><loader style="display:inline"></loader></span></h3>
                </div>
                <div class="col-sm text-center">
                    <img src="assets/bitcoin-logo.png" style="height:100px;" />
                    <h1 class="display-5">BTC</h1>
                    <h3 class="display-5"><small class="text-secondary">USD</small> <span id="BTC-USD"><loader style="display:inline"></loader></span></h3>
                    <h3 class="display-5"><small class="text-secondary">EUR</small> <span id="BTC-EUR"><loader style="display:inline"></loader></span></h3>
                </div>
                <div class="col-sm text-center">
                    <img src="assets/lif-logo.svg" style="height:100px;" />
                    <h1 class="display-5"><em>k</em>LÍF</h1>
                    <h3 class="display-5"><small class="text-secondary">ETH (Idex)</small> <span id="idex-ETH-kLIF"><loader style="display:inline"></loader></span></h3>
                    <!--<h4 class="display-5"><small class="text-secondary">ETH (OTCBTC)</small> <span id="otcbtc-ETH-kLIF"><loader style="display:inline"></loader></span></h4>-->
                    <!--<h4 class="display-5"><small class="text-secondary">Yobit</small> <span id="yobit-ETH-kLIF"><loader style="display:inline"></loader></span></h4>-->
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            websocket: null,
            loaded: false
        }
    },
    created: function () {
        this.websocket = new WebSocket('wss://ws-feed.gdax.com');

        this.websocket.onopen = () => {
            this.websocket.send(JSON.stringify({
                "type": "subscribe",
                "channels": [
                    {
                        "name": "ticker",
                        "product_ids": [
                            "ETH-USD",
                            "ETH-EUR",
                            "BTC-USD",
                            "BTC-EUR",
                        ]
                    }
                ]
            }));
        };

        let cachedTargets = {};

        let updateTarget = (id, price) => {
            if (! id) {
                return;
            }
            if (! cachedTargets[id]) {
                let target = document.getElementById(id);
                if (target) {
                    cachedTargets[id] = target;
                }
            }
            if (cachedTargets[id]) {
                cachedTargets[id].innerHTML = parseFloat(price).toFixed(2);
            }
        };

        this.websocket.onmessage = message => {
            this.loaded = true;
            let parsed = JSON.parse(message.data);
            updateTarget(parsed.product_id, parsed.price);
        };
        this.websocket.onerror = err => {
            console.log('error', err);
        };
        this.websocket.onclose = () => {
            console.log('closed');
        };

        let lifFromIdex = () => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.idex.market/returnTicker');
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                let lifData = JSON.parse(xhr.responseText);
                updateTarget('idex-ETH-kLIF', lifData.last ? lifData.last * 1000 : 'N/A');
            };
            xhr.send(JSON.stringify({
                market: 'ETH_LIF'
            }));
        }

        let lifFromOtcBtc = () => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://bb.otcbtc.com/api/v2/tickers/lifeth');
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                let lifData = JSON.parse(xhr.responseText);
                updateTarget('otcbtc-ETH-kLIF', lifData.ticker.last ? lifData.ticker.last * 1000 : 'N/A');
            };
            xhr.send();
        }

        let lifFromYobit = () => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://yobit.net/api/3/ticker/lif_eth');
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                let lifData = JSON.parse(xhr.responseText);
                updateTarget('yobit-ETH-kLIF', lifData.lif_eth.last ? lifData.lif_eth.last * 1000 : 'N/A');
                updateLifAverage();
            };
            xhr.send(JSON.stringify({
                market: 'ETH_LIF'
            }));
        }

        let refreshLif = () => {
            lifFromIdex();
            // OTCBTC has so small volume that the price does not really mean anything
            // lifFromOtcBtc();
            // Yobit has issues with CORS for some reason
            // lifFromYobit();
        };
        refreshLif();
        this.lifInterval = setInterval(refreshLif, 4000);
    },
    methods: {
    },
    beforeRouteLeave: function(to, from , next)  {
        clearInterval(this.lifInterval);
        this.websocket.close();
        next();
    }
};

export default PageGdaxPrice;