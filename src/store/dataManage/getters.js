// import sudokuData from "@/store/sudoku/sudokuData";
export default {
    // field: (state) => id => {
    //     // if (context.state.fields.length + 250 > id) {
    //     //     setTimeout(()=>{
    //     //         console.log(1)
    //     //         let x = new sudokuData.sudokuData([1,1,1])
    //     //         x.newField().then(console.log)
    //     //     },10)
    //     // }
    //     return  state.fields[id]
    // },
    getDataOptions: state => {
        let x = []
        state.fields.forEach(item => {
            x.push(item.length-1)
        })
        return x
    },
    // fields: state => state.fields.slice(0,100),
    // fieldsN: state => (start,count) => {
    //     count = (count<state.fields.length) ? count : state.fields.length
    //     return state.fields.slice(start,count)
    // }
}
