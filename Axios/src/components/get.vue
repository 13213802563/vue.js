<template>
	<div class="hello">
		<ul>
			<!--<li v-for='news in newsData'>
				<p>{{news.title}}</p>
			</li>-->
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'HelloWorld',
		data() {
			return {
				newsData: []
				//    msg: 'Welcome to Your Vue.js App'
			}
		},
		created() {
			this.$axios("http://www.wwtliu.com/sxtstu/news/juhenews.php", {
					params: {
						type: 'junshi',
						count: 30
					}
				})
				.then(res => {
					this.newsData = res.data;
					console.log(res.data);
				})
				.catch(error => {
					console.log(error);
				})
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1,
	h2 {
		font-weight: normal;
	}
	
	ul {
		list-style-type: none;
		padding: 0;
	}
	
	li {
		display: inline-block;
		margin: 0 10px;
	}
	
	a {
		color: #42b983;
	}
</style>
