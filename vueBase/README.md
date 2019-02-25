#项目初始化	
	1.安装vue-cli
		npm install -g vue-cli
	2.初始化项目
		vue init webpack my-project
	3.进入项目
		cd my-project
	4.安装依赖
		npm install
	5.启动项目
		npm run dev
#项目目录结构
	index.html:项目根视图
	.postcssrc.js：postcss配置文件
	static：静态文件目录

#Vue基础

	Vue组件：
		包含三个部分
			template：视图
			script：逻辑
			style：样式

	Mustache:模板
		表现形式：{{ 语法 }}
		{{ hello }}
	    {{ 1+1 }}
	    {{ "哈哈" }}
	    {{ 0<10 ? '对的' : '错的' }}
	    {{ '注意：只能存在单行语句,并且不能作用在HTML属性' }}

	VUE基本指令：
		v-html:渲染文本
		v-text:渲染文本
		v-bind:绑定
		v-bind的简写：(:)
	条件渲染：
		v-if
		v-else
		v-else-if
		v-show
		问题：v-if与v-show有什么区别？
			v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
			v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
			相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
			一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。
	列表渲染：
		v-for
		每个列表都要添加key
	事件监听：
		v-on:
		methods:
		事件参数
		修饰符
		简写方法：@代替v-on
	数组更新检测:
		变异方法：引起视图更新
		替换数组：不会引起视图更新
	显示过滤/排序结果：
		filter
	计算属性和观察者
		computed
		计算属性和Methods区别
			我们可以将同一函数定义为一个方法而不是一个计算属性。两种方式的最终结果确实是完全相同的。然而，不同的是计算属性是基于它们的依赖进行缓存的。计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。
	表单输入绑定
		v-model:双向数据绑定
		修饰符:lazy、trim、number
	Class 与 Style 绑定
		绑定 HTML Class
		数组语法
