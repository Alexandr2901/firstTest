//import sud from './sudoku'
export default {
    initialization(context, id) {
        // function test (x) {
        //     return '123' + x
        // }
        //let y = 
        // console.log(test('321'));
        // let q = new sud.solution('123')
        // q
        // q
        //context.dispatch('testinit')
        //console.log(context.rootGetters['dataManage/field'](id))
        //console.log('init')
        //console.log(sud.test('222'))
        context.commit('INITIALIZATION', context.rootGetters['dataManage/field'](id))
        //context.dispatch('selectRows')
        context.dispatch('allPossubly')
        context.dispatch('front/initialization', context.state.selectedStringField)
        //context.dispatch('allPossubly')
    },
    autoResolution(context) {
        context.commit('AUTO_RESOLUTIONS')
        if (context.state.autoresolution) {
            context.dispatch('onePossubly')
        }
    },
    
    onlePossiblySwitch(context) {
        if (context.state.autoresolution) {
            context.commit('AUTO_RESOLUTIONS')
        }
        context.commit('ONE_POSSIBLY_SWITCH')
        context.dispatch('allPossubly')
    },
    onlyHereSwitch(context) {
        if (context.state.autoresolution) {
            context.commit('AUTO_RESOLUTIONS')
        }
        context.commit('ONLY_HERE_SWITCH')
        context.dispatch('allPossubly')
    },
    allPossubly(context) {
        //var noerror = 0
        //context.commit('CYCLE_INIT')
        //context.dispatch('selectSegments')
        context.commit('EXIST_VALUE',context.state.field)
        // context.commit('ALL_ROW_POSSIBLY')
        // context.commit('ALL_COLUMN_POSSIBLY')
        // context.commit('ALL_SQUARE_POSSIBLY')
        //context.commit('POSSIBLY_APDATE')
        // while (context.state.possiblyApdated) {
        //     context.commit('POSSIBLY_APDATE')
        //     if (context.state.advanchedPossibly.onePossibly) {
        //         context.commit('ROW_ONE_POSSIBLY')
        //         context.commit('COLUMN_ONE_POSSIBLY')
        //         context.commit('SQUARE_ONE_POSSIBLY')
        //     }
        //     if (context.state.advanchedPossibly.onlyHere) {
        //         context.commit('ROW_ONLU_HERE')
        //         context.commit('COLUMN_ONLU_HERE')
        //         context.commit('SQUARE_ONLU_HERE')
        //     }
        // }
        if (context.state.autoresolution) {
            setTimeout(() => {
                if (context.state.autoresolution) {
                    context.dispatch('onePossubly')
                }
            }, 1000)
        }
        //context.dispatch('onePossubly')
        //context.commit('ROW_ONLU_HERE')
        context.commit('POSSIBLY_APDATE')
    },
    onePossubly(context) {
        let haspossibly = false
        let payload = {
            value: null,
            target: null
        }
        for (let i = 0; i < 81; i++) {
            if (context.state.field[i].possibly.size === 1 && context.state.field[i].value === 0) {
                haspossibly = true
                //console.log(context.state.field[i].possibly)
                //console.log(context.state.field[i].possibly.size)
                context.state.field[i].possibly.forEach(item => {
                    //console.log(item)
                    payload.value = item
                })
                payload.target = i
                //console.log(payload)
            }
        }
        //console.log(payload)
        if (haspossibly) {
            context.dispatch('setFieldValue', payload)
        }
    },
    /*FillInitialPossubility (context) {
        context.commit('INITIALIZATION')
    },*/
    fieldPossubly (context, stringField) {
        //stringField is string
        let field = []
        stringField.forEach((item, index) => {
            field.push({
                id: index,
                value: +item,
                possibly: new Set()
            })
        })
        context.dispatch('segmentsPossubly',field)
    },
    segmentsPossubly (context, field) {
        for (let i = 0; i < 9; i++) {
            let selectedrow = []
            let selectedcolumn = []
            let square = []
            for (let j = 0; j < 9; j++) {
                selectedrow.push(field[i*9+j])
                selectedcolumn.push(field[i+j*9])
                square.push(field[context.state.sudokuSquares[i][j]])
            }
            context.dispatch('allPossublyInSegment', selectedrow)
            context.dispatch('allPossublyInSegment', selectedcolumn)
            context.dispatch('allPossublyInSegment', square)
        }
    },
    allPossublyInSegment(context, segment){
        context.dispatch('ALL_POSSIBLY',segment)
    },
    selectSegments (context) {
        for (let i = 0; i < 9; i++) {
            let selectedrow = []
            let selectedcolumn = []
            let square = []
            for (let j = 0; j < 9; j++) {
                selectedrow.push(context.state.field[i*9+j])
                selectedcolumn.push(context.state.field[i+j*9])
                square.push(context.state.field[context.state.sudokuSquares[i][j]])
            }
            context.dispatch('allPossublyInSegment', selectedrow)
            context.dispatch('allPossublyInSegment', selectedcolumn)
            context.dispatch('allPossublyInSegment', square)
        }
    },
    setFieldValue(context, payload) {
        //console.log(payload)
        if (context.state.selectedStringField[payload.target] === '0' &&
            (context.state.field[payload.target].possibly.has(payload.value) || payload.value === 0)) {
            //let a = new Set([1,2,3,4,5])
            //a.delete(2)
            //console.log(a)
            context.commit('SET_FIELD_VALUE', payload)
            context.dispatch('allPossubly')
            // if (context.state.field.every(item => item.value !== 0)) {
            //     setTimeout(() => {
            //         console.log("Решено")
            //     }, 2000)
            // }
        }
    },
    undoLastValue(context) {
        if (context.state.autoresolution) {
            context.commit('AUTO_RESOLUTIONS')
        }
        if (context.state.moveHistory.length) {
            let local = context.state.moveHistory.pop()
            //console.log(local)
            context.dispatch('setFieldValue', {
                value: local.exvalue,
                target: local.buttonid,
                unsave: true
            })
        }
    }
}