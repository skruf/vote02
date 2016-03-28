<style>
.vote {
  padding-top: 10px;
}
.vote__action {
  cursor: pointer;
}
.vote__action:hover {
  color: #d9534f;
}
.sorter {
  margin-top: 10px;
}
hr {
  margin-left: 0px;
  width: 6em;
  background-color: #CCCCCC;
  height: .2em;
  border: none;
}
.link__action {
  display: none;
}
.link__content:hover .link__action {
  display: inline-block;
}
</style>

<template>
<header>
  <div class="container">

    <h1>Voting app</h1>

  </div>
</header>
<main>

  <section id="admin">
    <div class="container">

      <button type="submit" class="btn btn-primary" v-on:click="showForm()" v-if="!formOpened">Add Link</button>
      <form v-if="formOpened" v-on:submit.prevent="addLink">
        <legend>Add a new link</legend>
        <div class="form-group">
          <input type="text" class="form-control" v-model="newLink.title" placeholder="Title">
        </div>
        <div class="form-group">
          <input type="text" class="form-control" v-model="newLink.url" placeholder="http://">
        </div>
        <div class="form-group">
          <input type="text" class="form-control" v-model="newLink.desc" placeholder="Short Description">
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary">Publish</button> <span><a v-on:click="hideForm()">Cancel</a></span>
        </div>
      </form>

    </div>
  </section>

  <section id="votes">
    <div class="container">

      <div class="row" v-for="link in links">
        <div class="col-sm-1 text-center">
          <div v-if="yetToVote(link)">
            <h2 class="vote">{{ link.vote }}</h2>
            <p>
              <span class="glyphicon glyphicon-arrow-up vote__action" v-on:click="upVote(link)"></span>
              <span class="glyphicon glyphicon-arrow-down vote__action" v-on:click="downVote(link)"></span>
            </p>
          </div>
        </div>
        <div class="col-sm-10 link__content">
          <h2>
            <small><a href="{{link.url}}">{{ link.title }}</a></small>
            <small class="link_action">
              <button class="btn btn-xs btn-danger" v-on:click="removeLink(link)">Delete</button>
            </small>
          </h2>
          <p>{{ link.desc }}</p>
        </div>
        <div class="col-sm-1">
          <h2 class="vote">{{ getResults(link) }}</h2>
        </div>
      </div>

    </div>
  </section>

</main>
</template>

<script>
var Links = new Firebase("https://vote02.firebaseio.com/links")
var Clients = new Firebase("https://vote02.firebaseio.com/clients")

export default {

  ready() {
    var vm = this

    if(!this.user_id) {
      this.user_id = Math.floor(Date.now() / 1000)
      localStorage.setItem("user_id", this.user_id)
      Clients.push(this.user_id)
    }

    Links.on("child_added", function(snapshot) {
      var link = snapshot.val()
      link.id = snapshot.key()
      vm.links.push(link)
    })

    Links.on("child_removed", function(snapshot) {
      vm.links.$remove(snapshop.val())
    })
  },

  data() {
    return {
      user_id: parseInt(localStorage.getItem("user_id"), 10),
      clients: [],
      links: [],
      formOpened: false,
  		newLink: {
  			title: "",
  			url: "",
  			desc: "",
  			vote: 0
  		}
    }
  },

  methods: {
    getResults(link) {
      return link.up_votes - link.down_votes
    },
    yetToVote(link) {
      var yetVote = true
      var vm = this
      link.has_voted.filter(function(item) {
        yetVote = (item !== vm.user_id)
      })
      return yetVote
    },
    upVote(link) {
      link.up_votes++
      link.has_voted.push(this.user_id)
      this.updateLink(link)
    },
    downVote(link) {
      link.up_votes++
      link.has_voted.push(this.user_id)
      this.updateLink(link)
    },
    updateLink(link) {
      new Firebase('https://vote02.firebaseio.com/links/' + link.id).update(link)
    },
    showForm : function() {
			this.formOpened = true;
		},
		hideForm : function() {
			this.formOpened = false;
			this.resetNewLink();
		},
		resetNewLink	: function() {
			this.newLink = {
				title: "",
				url: "",
				desc: "",
				vote: 0
			}
		},
		addLink : function() {
			Links.push(this.newLink)
			this.resetNewLink();
			this.hideForm();
		},
		removeLink : function(link) {
			new Firebase('https://vote02.firebaseio.com/links/' + link.id).remove()
			this.links.$remove(link);
		}
  }

}
</script>
