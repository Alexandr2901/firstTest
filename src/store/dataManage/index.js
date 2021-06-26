import actions from "./actions";
import state from "./state2";
import mutations from "./mutations"
import getters from "./getters"
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
