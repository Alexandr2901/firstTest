import methods from './sudoku'
export default {
    INITIALIZATION(state, stringField) {
        console.log('init')
        state.advanchedPossibly.onePossibly = false
        state.advanchedPossibly.onlyHere = false
        state.selectedStringField = stringField
        state.autoresolution = false
        let x = new methods.sudokuSolve
        state.field = x.fieldInit(stringField)
        // let a = []
        // for (let i = 0; i < stringField.length; i++) {
        //     a.push({
        //         id: i,
        //         value: +stringField[i],
        //         possibly: new Set()
        //     })
        // }
        //state.field = a
    },
    ONE_POSSIBLY_SWITCH(state) {
        state.advanchedPossibly.onePossibly = !state.advanchedPossibly.onePossibly
        //console.log('state.onePossibly',state.advanchedPossibly.onePossibly)
    },
    ONLY_HERE_SWITCH(state) {
        state.advanchedPossibly.onlyHere = !state.advanchedPossibly.onlyHere
        //console.log('state.onlyHere',state.advanchedPossibly.onlyHere)
    },
    POSSIBLY_APDATE(state) {
        state.possiblyApdated = !state.possiblyApdated
    },
    AUTO_RESOLUTIONS(state) {
        //console.log('autoResolution')
        state.autoresolution = !state.autoresolution
    },
    EXIST_VALUE (state, field) {
        let x = new methods.sudokuSolve
        let data = []
        // data.push(true)
        // data.push(true)
        data.push(state.advanchedPossibly.onlyHere)
        data.push(state.advanchedPossibly.onePossibly)
        state.field = x.allPossubly(field,data)
        //state.field = methods.sudokuSolve.allPossubly(field)
    },
    SET_FIELD_VALUE(state, payload) {
        //console.log(payload)
        if (!payload.unsave) {
            state.moveHistory.push({
                buttonid: payload.target,
                exvalue: state.field.find(item => item.id === payload.target).value
            })
        }
        state.field.find(item => item.id === payload.target).value = payload.value
        state.field.find(item => item.id === payload.target).possibly.clear()

    },
    ALL_ROW_POSSIBLY(state) {
        for (let i = 0; i < 9; i++) {
            let selectedrow = new Set()
            for (let j = 0; j < 9; j++) {
                selectedrow.add(state.field[i * 9 + j].value)
            }
            for (let j = 0; j < 9; j++) {
                if (!state.field[i * 9 + j].value) {
                    //state.field[i * 9 + j].possibly = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
                    selectedrow.forEach(item => {
                        state.field[i * 9 + j].possibly.delete(item)
                    })
                } else {
                    state.field[i * 9 + j].possibly = new Set()
                }
            }
        }
    },
    CYCLE_INIT(state) {
        state.field.forEach(item => {
            if (item.value === 0) {
                item.possibly = new Set([1,2,3,4,5,6,7,8,9])
            }
        })
    },
    ALL_POSSIBLY(state, segment) {
        //console.log(segment);
        let segmentPossibly = new Set()
        segment.forEach(item=>{
            if (item.value !== 0) {
                segmentPossibly.add(item.value)
            }
            //console.log(item.value);
        })
        segment.forEach(item=>{
            segmentPossibly.forEach(item2 => {
                item.possibly.delete(item2)
            })
        })
    },
    ALL_COLUMN_POSSIBLY(state) {
        for (let i = 0; i < 9; i++) {
            let selectedcolumn = new Set()
            for (let j = 0; j < 9; j++) {
                selectedcolumn.add(state.field[i + j * 9].value)
            }
            for (let j = 0; j < 9; j++) {
                //state.field[i+j*9].possibly = new Set([0,1,2,3,4,5,6,7,8,9])
                selectedcolumn.forEach(item => {
                    state.field[i + j * 9].possibly.delete(item)
                })
            }
        }
    },
    ALL_SQUARE_POSSIBLY(state) {
        for (let i = 0; i < 9; i++) {
            let square = []
            let squareValues = new Set()
            for (let j = 0; j < 9; j++) {
                square.push(state.field[state.sudokuSquares[i][j]])
                squareValues.add(state.field[state.sudokuSquares[i][j]].value)
            }
            for (let j = 0; j < 9; j++) {
                squareValues.forEach(item => {
                    square[j].possibly.delete(item)
                })
            }
            /*let selectedsquare = new Set()
            state.field.forEach(item => {
                if(i === Math.floor(Math.floor(item.id/3) / 9) * 3 + Math.floor(item.id/3) % 3 ) {
                    selectedsquare.add(item.value)
                }
            })*/
        }
    },
    ROW_ONE_POSSIBLY(state) {
        //console.log('ROW_ONE_POSSIBLY')
        //let has = true
        //while (has) {
        //console.log('ROW_ONE_POSSIBLY')
        //has = false
        for (let i = 0; i < 9; i++) {
            let selectedrow = new Set()
            for (let j = 0; j < 9; j++) {
                if (state.field[i * 9 + j].possibly.size === 1) {
                    //has = true
                    state.field[i * 9 + j].possibly.forEach(item => {
                        //console.log(item === selectedrow)
                        selectedrow.add(item)
                    })
                }
            }
            //console.log(selectedrow)
            if (selectedrow.size > 0) {
                for (let j = 0; j < 9; j++) {
                    selectedrow.forEach(item => {
                        if (state.field[i * 9 + j].possibly.size !== 1) {
                            //has = true
                            if (state.field[i * 9 + j].possibly.has(item)) {
                                state.field[i * 9 + j].possibly.delete(item)
                                //console.log(item)
                                state.possiblyApdated = true
                            } else {
                                //console.log(false)
                            }
                            //state.field[i * 9 + j].possibly.delete(item)
                        }
                    })
                }

            }
        }
        //}
    },
    COLUMN_ONE_POSSIBLY(state) {
        for (let i = 0; i < 9; i++) {
            let selectedcolumn = new Set()
            for (let j = 0; j < 9; j++) {
                if (state.field[i + j * 9].possibly.size === 1) {
                    state.field[i + j * 9].possibly.forEach(item => {
                        selectedcolumn.add(item)
                    })
                }
            }
            //console.log(selectedrow)
            if (selectedcolumn.size > 0) {
                for (let j = 0; j < 9; j++) {
                    selectedcolumn.forEach(item => {
                        if (state.field[i + j * 9].possibly.size !== 1) {
                            if (state.field[i + j * 9].possibly.has(item)) {
                                state.field[i + j * 9].possibly.delete(item)
                                //console.log(item)
                                state.possiblyApdated = true
                            } else {
                                //console.log(false)
                            }
                            //state.field[i + j * 9].possibly.delete(item)
                        }
                    })
                }
            }
        }
    },
    SQUARE_ONE_POSSIBLY(state) {
        //console.log('SQUARE_ONE_POSSIBLY')
        for (let i = 0; i < 9; i++) {
            let selectedsquare = new Set()
            let square = []
            for (let j = 0; j < 9; j++) {
                square.push(state.field[state.sudokuSquares[i][j]])
            }
            for (let j = 0; j < 9; j++) {
                if (square[j].possibly.size === 1) {
                    square[j].possibly.forEach(item => {
                        selectedsquare.add(item)
                    })
                }
            }
            if (selectedsquare.size > 0) {
                for (let j = 0; j < 9; j++) {
                    selectedsquare.forEach(item => {
                        if (square[j].possibly.size !== 1) {
                            if (square[j].possibly.has(item)) {
                                square[j].possibly.delete(item)
                                //console.log(item)
                                state.possiblyApdated = true
                            } else {
                                //console.log(false)
                            }
                            square[j].possibly.delete(item)
                        }
                    })
                }
            }
        }
    },
    ROW_ONLU_HERE (state) {
        for (let i = 0; i < 9; i++) {
            let possiblyes = []
            for (let j = 0; j < 9; j++) {
                state.field[i*9+j].possibly.forEach(item => {
                    possiblyes.push(item)
                })
            }
            possiblyes = possiblyes.filter(value => {
                if(possiblyes.indexOf(value) === possiblyes.lastIndexOf(value)) {
                    return value
                }
            })
            // if (possiblyes.length) {
            //     console.log(i,possiblyes)
            // }
            possiblyes.forEach(item =>{
            for (let j = 0; j < 9; j++) {
                if (state.field[i*9+j].possibly.has(item) && state.field[i*9+j].possibly.size >1) {
                    state.possiblyApdated = true
                    state.field[i*9+j].possibly.clear()
                    state.field[i*9+j].possibly.add(item)
                }
                //q.push([...state.field[1*9+j].possibly])
                // for (let k = 0; k < 9; k++) {
                // }
            }
        })
            //q = q.filter ((value, index) => q.indexOf(value) == index)
            //console.log(possiblyes)
        }
    },
    COLUMN_ONLU_HERE (state) {
        for (let i = 0; i < 9; i++) {
            let possiblyes = []
            for (let j = 0; j < 9; j++) {
                state.field[i+j*9].possibly.forEach(item => {
                    possiblyes.push(item)
                })
                //q.push([...state.field[1*9+j].possibly])
                // for (let k = 0; k < 9; k++) {
                // }
            }
            // q = q.sort()
            // console.log(q)
            possiblyes = possiblyes.filter(value => {
                if(possiblyes.indexOf(value) === possiblyes.lastIndexOf(value)) {
                    return value
                }
            })
            // if (possiblyes.length) {
            //     console.log(i,possiblyes)
            // }
            possiblyes.forEach(item =>{
            for (let j = 0; j < 9; j++) {
                if (state.field[i+j*9].possibly.has(item) && state.field[i+j*9].possibly.size >1) {
                    state.possiblyApdated = true
                    state.field[i+j*9].possibly.clear()
                    state.field[i+j*9].possibly.add(item)
                }
                //q.push([...state.field[1*9+j].possibly])
                // for (let k = 0; k < 9; k++) {
                // }
            }
        })
            //q = q.filter ((value, index) => q.indexOf(value) == index)
            //console.log(possiblyes)
        }
    },
    SQUARE_ONLU_HERE(state) {
        for (let i = 0; i < 9; i++) {
            let possiblyes = []
            //let selectedsquare = new Set()
            let square = []
            for (let j = 0; j < 9; j++) {
                square.push(state.field[state.sudokuSquares[i][j]])
            }
            square.forEach(line => {
                line.possibly.forEach(item => {
                    possiblyes.push(item)
                })
            })
            //possiblyes = possiblyes.sort()
            //console.log(i,possiblyes)
            possiblyes = possiblyes.filter(value => {
                if(possiblyes.indexOf(value) === possiblyes.lastIndexOf(value)) {
                    return value
                }
            })
            // console.log(i,possiblyes)
            possiblyes.forEach(item =>{
                square.forEach(line => {
                    if (line.possibly.has(item) && line.size >1) {
                        line.possibly.clear()
                        line.possibly.add(item)
                        // state.possiblyApdated = true
                    }
                })
            })
        }
    },
}