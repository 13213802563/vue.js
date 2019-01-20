<template>
	<div>
		儿子-----{{getCount}}
		{{title}}
	   <button @click='sendMsg'>子传父</button>
	   <button @click='min'>减少</button>
	</div>
</template>

<script>
	export default{
		name:'child',
		data(){
			return{
				info:'恩恩恩'
			}
		},
		props:{
			title:{
				type:String,
				default:''
			}
		},
		methods:{
			sendMsg(){
				this.$emit('info',this.info)
			},
			min(){
//				this.$store.commit("decrease")
                 this.$store.dispatch("decrease")
			}
		},
		computed:{
			getCount(){
//				return this.$store.state.count;
                return this.$store.getters.getState;
			}
		}
	}
</script>

<style scoped>
</style>
