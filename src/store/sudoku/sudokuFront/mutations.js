export default {
    UNSELECTBUTTON (state) {
        state.fieldview.forEach(item =>{item.bgcolor = 'white'})
    },
    SELECTBUTTON (state, id) {
        state.selectedbutton = id
        //console.log(id % 9)
        //console.log(Math.floor(id / 9))
        //console.log(Math.floor(Math.floor(id/3) / 9) * 3 + Math.floor(id/3) % 3)
        state.fieldview.forEach(item =>{
            if(item.id % 9 === id % 9 || Math.floor(item.id / 9) === Math.floor(id / 9) ||
            (Math.floor(Math.floor(item.id/3) / 9) * 3 + Math.floor(item.id/3) % 3) ===
            (Math.floor(Math.floor(id/3) / 9) * 3 + Math.floor(id/3) % 3)) {
                //console.log('green')
                item.bgcolor = 'rgba(255, 255, 0, 0.25)'
            }
        })
        state.fieldview.find(item => item.id === id).bgcolor = 'rgba(255, 0, 0, 0.25)'
    },
    INITIALIZATION (state, stringField) {
        state.selectedbutton = -1
        state.selectedStringField = stringField
        let a = []
        for (let i = 0; i < stringField.length; i++) {
            a.push({
                id:i,
                const: stringField[i] === '0' ? 'rgba(0, 0, 0, 0.5)' : 'black',
                // glow: 0,
                bgcolor: false
            })
        }
        state.right.forEach(element => {
            a.find(item => item.id === element).sides = 'r'
        });
        state.bottom.forEach(element => {
            a.find(item => item.id === element).sides = 'b'
        });
        state.rightbottom.forEach(element => {
            a.find(item => item.id === element).sides = 'l'
        });
        state.fieldview = a
    }
}
