import matter from './matter';
import mat from './mat';
export default {
    namespaced: true,
    modules: {
        matter: {
            ...matter
        },
        mat: {
            ...mat
        }
    },
    actions: {
        test(context) {
            context.dispatch('matter/test')
        }
    }
}
