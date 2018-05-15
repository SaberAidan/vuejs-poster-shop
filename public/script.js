var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        results: [],
        cart: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE,
    },
    methods: {
        addItem: function(index) {
            this.total += PRICE;
            var item = this.items[index];
            var found = false;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
        },
        inc: function(item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function(item) {
            item.qty--;
            this.total -= PRICE;
            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        },
        onSubmit: function() {
            if (this.newSearch.length) {
                this.items = [];
                this.loading = true;
                this.$http.get('/search/'.concat(this.newSearch))
                /*axios.get('/search/'.concat(this.search))*/
                    .then(function(response) {
                        this.lastSearch = this.newSearch;
                        this.results = response.data;
                        this.items = response.data.slice(0, LOAD_NUM);
                        this.loading = false;
                    });
            };
        },
        appendItems: function () {
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        }
    },
    filters: {
        currency: function (price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted: function() {
        this.onSubmit();
        var vueInstance = this;
        var elem = document.getElementById("product-list-bottom")
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function() {
            vueInstance.appendItems()
        })
    },
    computed: {
        noMoreItems: function () {
            return this.items.length === this.results.length && this.results.length > 0;
        }
    }
});



