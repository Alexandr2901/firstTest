import actions from "./actions";
import state from "./state4";
import mutations from "./mutations"
import getters from "./getters"
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
