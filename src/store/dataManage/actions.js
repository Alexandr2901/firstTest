import axios from 'axios'

const api = 'http://0.0.0.0/api/'

export default {
    init(context) {
        // console.log(localStorage.getItem('token') )
        // console.log(context.state.token)
        // context.dispatch('signIn').then(() => {
        context.dispatch('pullData').then(()=>{
            // console.log('hello')
            console.log(context.getters.field(1))
        })

        // context.dispatch('pullData').then(res => {
        //     console.log(res)
        // })
        // context.dispatch('solveSudoku').then(res => {
        //     console.log(res)
        //     })
        //
        // })

    },
    solveField({commit},difficulty){
        commit('SOLVE_FIELD',difficulty)
        // console.log(data)
    },
    getField(context, difficulty) {
        // let field
        // try {
        //     field = context.state.fields[difficulty][id]
        // } catch (e) {
        //     return ''
        // }
        // console.log(id, field)
        // console.log(context.getters.field(difficulty))
        return context.getters.field(difficulty)
        // this.pullData()
        // return  field
        // 000005160000060000240000000000020300070000004500100080000000000000000012003004000
        // 000000000000000012003004000000005160000060000240000000000020300070000004500100080
        //     '007000329003005040400930060031000400074690038008043005000020000010050080000706000'
        // return '074038690031400000008005043007329000003040005400060930010080050000000020000000706'
    },
    signUp() {
        return new Promise((resolve, reject) => {
            axios.post(api + 'auth/signup', {
                name: "Test Test Test",
                email: "authtest2@mail.local",
                password: "1234567890"
            })
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    signIn({commit}) {
        return new Promise((resolve, reject) => {
            axios.post(api + 'auth/signin', {
                email: "authtest2@mail.local",
                password: "1234567890"
            })
                .then(response => {
                    commit('SET_TOKEN', response.data.token)
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    check({state}) {
        return new Promise((resolve, reject) => {
            axios.get(api + 'auth/check', {
                headers: {
                    'Authorization': "Bearer " + state.token
                }
            })
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    console.log('error')
                    reject(error)
                })
        })
    },
    logOut({state, commit}) {
        return new Promise((resolve, reject) => {
            axios.get(api + 'auth/logout', {
                headers: {
                    'Authorization': "Bearer " + state.token
                }
            })
                .then(response => {
                    commit('LOG_OUT', response.data.token)
                    resolve(response)
                })
                .catch(error => {
                    console.log('error')
                    reject(error)
                })
        })
    },
    solveSudoku({state}) {
        return new Promise((resolve, reject) => {
            axios.post(api + 'sudoku/solve', {
                fields: [{
                    id: 3,
                    solution: '516378942793412856824965173265891437179243685348756219482637591657189324931524768'
                }]
            }, {
                headers: {
                    'Authorization': "Bearer " + state.token
                }
            })
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    console.log('error')
                    reject(error)
                })
        })
    },
    pullData({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(api + 'sudoku/index')
                .then(response => {
                    // commit('addPageToLocalPosts', {
                    //     data: response.data,
                    //     page: page
                    // })
                    // let data = []
                    // response.data.data.forEach(item => {
                    //     data.push(...item)
                    //     console.log(...item)
                    // })
                    // console.log(response.data.data[1].find(item => item.id === 14))
                    commit('SET_FIELDS', response.data.data)

                    // console.log(data)
                    // console.log(response.data.data)
                    // resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
}

// async function q() {
//     const x = 'http://0.0.0.0/api/sudoku/index'
//     let response = await fetch(x);
//     console.log(response.text())
// }
