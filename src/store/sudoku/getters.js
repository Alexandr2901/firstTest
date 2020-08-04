export default {
    field: state =>  state.field,
    autoresolution: state =>  state.autoresolution,
    advanchedPossibly: state => state.advanchedPossibly,
    // testgeetter: (state,id)=> {
    //     let a = new Set()
    //     console.log(id)
    //     for (let i=0; i<9;i++) {
    //         a.add(state.field[i].value)
    //     }
    // },
    ButtonGetter: state => number => {
        //console.log('ButtonGetter')
        //console.log(number)
        let b = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
        number = Math.floor(number/9) * 9
        //console.log(number)
        //let arr = state.field.slice(number,number+9)
        //console.log(arr)
        for(let i=0;i<9;i++) {
            b.delete(state.field[number + i].value)
        }
        /*arr.forEach(item => {
            b.delete(item)
        })*/
        return b



        //console.log(number)
        //console.log(state.field[id])
        /*let a = new Set()
        let b = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
        for(let i=0;i<9;i++) {
            a.add(state.field[number + i].value)
        }
        a.forEach(item =>{
            b.delete(item)
        })
        return b*/
    },
      /* Uppgradedfield: state => {
       },*/
       possibleField: state => {
              //console.log('update')
              let a = []
              state.field.forEach((item, index) => {
                     let b = [1, 2, 3, 4, 5, 6, 7, 8, 9]
                     b.splice(+item.value-1, !!item||0)
                    //console.log('1')
                     a.push({
                            id: index,
                            value: item,
                            possibly:b
                     })
              })
              return a
       },
       fieldtest: (state, getters) => a => {
           a = []
           for (let i=0; i<9;i++) {
               a.push(getters.testgeetter(i))
           }
         /*return {
                a:[ [0, 0, 0, 0, 9, 0, 1, 0, 0],
                [0, 0, 4, 0, 2, 6, 0, 8, 9],
              [0, 1, 9, 5, 0, 3, 0, 4, 6],
                  [0, 9, 7, 2, 4, 5, 6, 0, 0],
                  [0, 0, 2, 0, 7, 0, 0, 5, 1],
                  [5, 6, 0, 9, 0, 1, 0, 0, 0],
                  [0, 0, 6, 0, 0, 0, 0, 0, 7],
                  [8, 0, 0, 0, 0, 2, 0, 9, 0],
                  [4, 0, 3, 0, 1, 0, 2, 6, 5]
                    ]
              }*/
       },
       possibleItemRow: (state, getters) => {
              getters.possibleField
       }
}
