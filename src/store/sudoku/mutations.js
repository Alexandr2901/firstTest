import methods from './sudoku'
export default {
    SET_PERSONAL_DATA(state) {
        // let x = {
        //     advanchedPossibly: [1, true, true],
        //     lastField: '',
        //     lastFieldFill: '',
        //     solved: [
        //         '000000012000035000000600070700000300000400800100000000000120000080000040050000600', '000000012003600000000007000410020000000500300700000600280000040000300500000000000', '000000012008030000000000040120500000000004700060000000507000300000620000000100000', '000000012040050000000009000070600400000100000000000050000087500601000300200000000', '000000012050400000000000030700600400001000000000080000920000800000510700000003000', '000000012300000060000040000900000500000001070020000000000350400001400800060000000', '000000012400090000000000050070200000600000400000108000018000000000030700502000000',
        //     ],
        //     ignored: [
        //         '000000012000035000000600070700000300000400800100000000000120000080000040050000600', '000000012003600000000007000410020000000500300700000600280000040000300500000000000', '000000012008030000000000040120500000000004700060000000507000300000620000000100000', '000000012040050000000009000070600400000100000000000050000087500601000300200000000', '000000012050400000000000030700600400001000000000080000920000800000510700000003000', '000000012300000060000040000900000500000001070020000000000350400001400800060000000', '000000012400090000000000050070200000600000400000108000018000000000030700502000000',
        //     ]
        // }
        // localStorage.setItem('savedData', JSON.stringify(x))
        // console.log(JSON.parse(localStorage.getItem('savedData')));
        localStorage.setItem('savedData', JSON.stringify(state.savedData))
    },
    GET_PERSONAL_DATA(state) {
        console.log('GET_PERSONAL_DATA');
        state.savedData = JSON.parse(localStorage.getItem('savedData')) || {
            advanchedPossibly: [1, 0, 0],
            //lastField: '',
            //lastFieldFill: '',
            solved: [
                //'000000012000035000000600070700000300000400800100000000000120000080000040050000600', '000000012003600000000007000410020000000500300700000600280000040000300500000000000', '000000012008030000000000040120500000000004700060000000507000300000620000000100000', '000000012040050000000009000070600400000100000000000050000087500601000300200000000', '000000012050400000000000030700600400001000000000080000920000800000510700000003000', '000000012300000060000040000900000500000001070020000000000350400001400800060000000', '000000012400090000000000050070200000600000400000108000018000000000030700502000000',
            ],
            ignored: [
                //'000000023480000000010000000503000060000010800000000000170000400000602000000300005','000000023600010000000400000000080700502000000000000100080203000010000640000500000','000000023600700000000000080000038500200000800000010000000200640003400000010000000','000000023800000050000100000010600400507030000000000000300052000064000100000000000','000000024000010000000000080107000900300800100000200000020400060500070300000000000','000000024000010000000000080307000100100800500000200000020400060500070300000000000','000000024000080010600005000000300700040700000010000000000040501300600000200000000','000000024007000000006000000500090100000300600020000000940000050000607300000800000','000000024010008000000070000600201500400000003000000000070000810500430000000000000',
            ]
        }
    },
    INITIALIZATION(state, stringField) {
        state.selectedStringField = stringField
        state.autoresolution = false
        let x = new methods.sudokuSolve
        state.field = x.fieldInit(stringField)
    },
    ONE_POSSIBLY_SWITCH(state) {
        state.advanchedPossibly.onePossibly = !state.advanchedPossibly.onePossibly
        console.log(state.savedData);
    },
    ONLY_HERE_SWITCH(state) {
        state.advanchedPossibly.onlyHere = !state.advanchedPossibly.onlyHere
        console.log(state.savedData);
    },
    POSSIBLY_APDATE(state) {
        state.possiblyApdated = !state.possiblyApdated
    },
    AUTO_RESOLUTIONS(state) {
        state.autoresolution = !state.autoresolution
    },
    EXIST_VALUE(state, field) {
        let x = new methods.sudokuSolve
        x.setAdvanchedPossibly([
            1,
            state.savedData.advanchedPossibly[1],
            state.savedData.advanchedPossibly[2],
        ])
        state.field = x.allPossubly(field, 1)
    },
    SET_FIELD_VALUE(state, payload) {
        if (!payload.unsave) {
            state.moveHistory.push({
                buttonid: payload.target,
                exvalue: state.field.find(item => item.id === payload.target).value
            })
        }
        state.field.find(item => item.id === payload.target).value = payload.value
        state.field.find(item => item.id === payload.target).possibly.clear()

    },
    CYCLE_INIT(state) {
        state.field.forEach(item => {
            if (item.value === 0) {
                item.possibly = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
            }
        })
    },
    ALL_POSSIBLY(state, segment) {
        //console.log(segment);
        let segmentPossibly = new Set()
        segment.forEach(item => {
            if (item.value !== 0) {
                segmentPossibly.add(item.value)
            }
            //console.log(item.value);
        })
        segment.forEach(item => {
            segmentPossibly.forEach(item2 => {
                item.possibly.delete(item2)
            })
        })
    },
}