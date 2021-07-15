export default{
    SET_TOKEN(state, token) {
        state.token = token
        localStorage.setItem('token',token)
        // console.log('hello')
        // console.log( localStorage.getItem('token'))
    },
    LOG_OUT(state) {
        state.token = ''
        localStorage.removeItem('token')
    },
    SET_FIELDS(state,payload) {
        state.fields = payload
        localStorage.setItem('fields' ,JSON.stringify(state.fields))
        // console.log(JSON.parse(JSON.stringify(payload)))
    },
    IGNORE_FIELD(state,difficulty) {
        // state.fields[difficulty].indexOf(item => item.id === id)
        // console.log('ignor')
        state.ignored.push(state.fields[difficulty].shift())
        localStorage.setItem('ignored' ,JSON.stringify(state.ignored))
        // console.log(state.fields[difficulty].length)
    },
    SOLVE_FIELD(state,payload) {
        // let data = {
        //     id: state.fields[payload[0]].shift().id,
        //     solution: payload[1]
        // }
        state.solved.push({
            id: state.fields[payload[0]].shift().id,
            solution: payload[1]
        })
        localStorage.setItem('solved' ,JSON.stringify(state.solved))
        // console.log(state.solved)
    }
}
