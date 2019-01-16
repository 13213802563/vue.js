1.安装element-ui
	npm i element-ui -S

2.安装按需加载的依赖
	npm install babel-plugin-component -D

3.修改.babelrc文件
	{
	  "presets": [
	    ["env", {
	      "modules": false,
	      "targets": {
	        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
	      }
	    }],
	    "stage-2"
	  ],
	  "plugins": ["transform-vue-jsx", "transform-runtime",["component", [
	    {
	      "libraryName": "element-ui",
	      "styleLibraryName": "theme-chalk"
	    }
	  ]]]
	}

4.进入组件
	import { Button } from 'element-ui'
	Vue.use(Button)
