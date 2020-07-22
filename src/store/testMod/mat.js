const actions = {
    test (context) {
        //context.dispatch('test')
        context.commit('testmut')
        context.dispatch('testdispatch')
    },
    testdispatch() {
        console.log('dispatch')
    }
}
const state = {}
const getters = {}
const mutations = {
    testmut () {
        console.log('testmut')
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
