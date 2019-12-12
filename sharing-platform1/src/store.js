import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:'',
    QrCodeLink:'',
    QrCodeshow:false
  },
  mutations: {
    QrCodeshow (state, QrCodeshow) {
      state.QrCodeshow = QrCodeshow
    },
    QrCodeLink (state, QrCodeLink) {
      state.QrCodeLink = QrCodeLink
    }
  },
  actions: {

  }
})
