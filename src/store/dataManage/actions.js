import sudokuData from "@/store/sudoku/sudokuData";

export default {
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
    getField (context, id) {
        // if (context.state.fields.length < id + 250) {
        //     setTimeout(()=>{
        //         let x = new sudokuData.sudokuData()
        //         // x.newField()
        //         x.newField().then(res => {
        //             console.log(res)
        //         })
        //     },0)
        // } else {
            return  context.state.fields[id]
        // }
    }
}
