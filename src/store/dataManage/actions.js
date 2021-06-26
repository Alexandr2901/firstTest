export default {
    getField(context, id) {
        // setTimeout(()=>{
        //     let x = new sudokuData.sudokuData()
        //     x.newField().then(res => {
        //         console.log(res)
        //     })
        // },0)
        return context.state.fields[id]
    }
}
