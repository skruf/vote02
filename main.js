var Vue = require("vue")

new Vue({
  el: "body",
  components: {
    tabs: require("vueboot").tabs,
    app: require("./app.vue")
  }
})
