import actions from "./actions";
import state from "./state";
import mutations from "./mutations"
import getters from "./getters"
import sudokuFront from "./sudokuFront"
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
    modules: {
        front: {
            ...sudokuFront
        },
    }
}
