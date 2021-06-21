export default {
    initialization (context, payload) {
        context.commit('INITIALIZATION', payload)
    },
    selectButton (context,id) {
        context.commit('UNSELECTBUTTON')
        if (+id>=0 && +id<=80) {
        context.commit('SELECTBUTTON',id)
        }
    
    },
    setTargetValue (context, value) {
        context.dispatch('sudoku/setFieldValue', {
            target: context.state.selectedbutton,
            value: value
        }, { root: true })
    }
}
