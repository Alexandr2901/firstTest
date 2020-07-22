const state = {
    qwerty: 'qwerty'
}
const actions = {
    test (context) {
        console.log('123654')
        console.log(context.state.qwerty)
    }
}
const getters = {

}
const mutations = {

}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
