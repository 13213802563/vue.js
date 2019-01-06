<template>
	<div class="hello">
		<ul>
		  get请求
			<li v-for='news in newsData'>
				<p>{{news.title}}</p>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'get',
		data() {
			return {
				newsData: []
				//    msg: 'Welcome to Your Vue.js App'
			}
		},
		created() {
			   var url=this.HOST+'/movie/top250';
//			   "http://www.wwtliu.com/sxtstu/news/juhenews.php"
			this.$axios.get(url, {
					params: {
//						type: 'junshi',
//						count: 30
              	count:10,
            		start:0
					}
				})
				.then(res => {
					this.newsData = res.data.subjects;
					console.log(res.data.subjects);
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
