const state = {
    exampleFieldq: [
        [0, 0, 0, 0, 9, 0, 1, 0, 0],
        [0, 0, 4, 0, 2, 6, 0, 8, 9],
        [0, 1, 9, 5, 0, 3, 0, 4, 6],
        [0, 9, 7, 2, 4, 5, 6, 0, 0],
        [0, 0, 2, 0, 7, 0, 0, 5, 1],
        [5, 6, 0, 9, 0, 1, 0, 0, 0],
        [0, 0, 6, 0, 0, 0, 0, 0, 7],
        [8, 0, 0, 0, 0, 2, 0, 9, 0],
        [4, 0, 3, 0, 1, 0, 2, 6, 5]
    ],
    exampleFields: [
        "000090100004026089019503046097245600002070051560901000006000007800002090403010265",
        "700000000249000080050000300300050000000096000006084700000670500000000049000049020"
    ],
    exampleField: "700000000249000080050000300300050000000096000006084700000670500000000049000049020"
    //700000000249000080050000300300050000000096000006084700000670500000000049000049020
};
const getters = {
    field: state => state.exampleField
};
const actions = {
    getDataMain(context) {
        // console.log('132')
        //dispatch("receiveData.actions.getData")
        console.log('context.getters.Field')
        console.log(context.getters.field)
        //dispatch('receiveData/getData')
        //console.log(receiveData)
        //commit('TEST')
        //console.log(commit)
        //receiveData.actions.getData()
        // context.commit('TEST')
    },
    testget() {
        console.log('testget')
    }
};
const mutations = {
    TEST() {
        console.log('test')
    }
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
