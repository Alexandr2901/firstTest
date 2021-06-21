const sudokuSquares = [
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80]
]

class sudokuData {
    constructor() {
        this.repeat = true
        this.option = new Set() //количество решений
        this.param = 0 // bulkhead
        this.advancedPossibly = [1, 0, 0]
        this.segments = []
        this.stack = []
    }

    setField(stringField) {
        this.stringField = stringField
        this.Field = this.fieldInit(stringField)
    }

    getField() {
        return this.Field
    }

    setAdvancedPossibly(number) {
        this.advancedPossibly[number] = !this.advancedPossibly[number]
        this.allPossibly(this.Field)
    }

    setAdvancedPossibles(parameter) {
        this.advancedPossibly = parameter
        this.allPossibly(this.Field)
    }

    fieldInit(stringField) {
        let field = []
        for (let i = 0; i < stringField.length; i++) {
            field.push({
                id: i,
                value: +stringField[i],
                possibly: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
                const: +stringField[i] !== 0
            })
        }
        this.allPossibly(field)
        return field
    }

    cycleInint(field) {
        field.forEach(item => {
            if (!item.const) {
                item.possibly = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
            }
        })
    }

    setFieldValue(id, value) {
        if (!this.Field[id].const) {
            this.stack.push({
                id: id,
                previousValue: this.Field[id].value
            })
            this.Field[id].value = value
            this.allPossibly(this.Field)
        }
    }
    undoLastValue () {
        if (this.stack.length !== 0) {
            let data = this.stack.pop()
            this.Field[data.id].value = data.previousValue
        }
    }

    allPossibly(field) {
        if (this.advancedPossibly.some(item => item)) {
            let error = 0
            this.cycleInint(field)
            while (this.repeat || error < 2) {
                error = error + 1
                this.repeat = false
                this.segmentsSeparate(field)
            }
        }
        return field
    }

    segmentsSeparate(field) {
        this.segments = []
        for (let i = 0; i < 9; i++) {
            let selectedrow = []
            let selectedcolumn = []
            let square = []
            for (let j = 0; j < 9; j++) {
                selectedrow.push(field[i * 9 + j])
                selectedcolumn.push(field[i + j * 9])
                square.push(field[sudokuSquares[i][j]])
            }
            this.segments.push(selectedrow)
            this.segments.push(selectedcolumn)
            this.segments.push(square)

        }
        this.segments.forEach(item => {
            if (this.advancedPossibly[0]) {
                this.existValue(item)
            }
            if (this.advancedPossibly[1]) {
                this.onlyHere(item)
            }
            if (this.advancedPossibly[2]) {
                this.onePossiblyDelete(item)
            }
        })
    }

    existValue(segment) {
        let segmentPossibly = new Set()
        segment.forEach(item => {
            if (item.value > 0) {
                segmentPossibly.add(item.value)
            }
        })
        segment.forEach(item => {
            segmentPossibly.forEach(item2 => {
                if (item.possibly.delete(item2)) {
                    this.repeat = true
                }
            })
        })
    }

    onlyHere(segment) {
        let possiblyes = []
        segment.forEach(item => {
            if (!item.const) {
            item.possibly.forEach(subitem => {
                possiblyes.push(subitem)
            })
        }
        })
        possiblyes = possiblyes.filter(value => {
            if (possiblyes.indexOf(value) === possiblyes.lastIndexOf(value)) {
                return value
            }
        })
        possiblyes.forEach(number => {
            segment.forEach(item => {
                if (item.possibly.has(number) && item.possibly.size > 1) {
                    this.repeat = true
                    item.possibly.clear()
                    item.possibly.add(number)
                }
            })
        })
        return
    }

    onePossiblyDelete(segment) {
        segment.forEach(item => {
            //let id = -100000
            if (item.possibly.size === 1 && item.value === 0) {
                let id = item.id
                segment.forEach(subitem => {
                    // console.log(this.repeat)
                    if (id !== subitem.id) {
                        item.possibly.forEach(elem => {
                            if (subitem.possibly.delete(elem)) {
                                this.repeat = true
                            }
                        })
                    }

                })
            }
        })
        return
    }

    checkWin(field) {
        let check = false
        field.forEach(item => {
            if (item.value > 0 && item.value < 10) {
                check = true
            }
        })
        return check
    }

    checkWinPossibly(field) {
        let check = true
        field.forEach(item => {
            if (item.value === 0 && item.possibly.size !== 1) {
                check = false
            }
        })
        return check
    }

    checkLose(field) {
        let x = false
        field.forEach(item => {
            if (item.value === 0 && item.possibly.size === 0) {
                x = true
            }
        })
        return x
    }

    checkWinPossiblyString(stringfield) {
        this.advancedPossibly = [1, 1, 1]
        return this.checkWinPossibly(this.allPossibly(this.fieldInit(stringfield)))
    }

    sudokuSolution(stringField) {
        this.setAdvancedPossibly([1, 1, 1])
        this.option.clear()
        this.Bulkhead(stringField)
        return this.option
    }

    Bulkhead2(stringField) {
        let field = this.fieldInit(stringField)
        this.possiblyend = false
        field = this.allPossibly(field, false)
        if (!this.checkLose(field) && this.option.size < 10) {
            if (this.checkWinPossibly(field)) {
                let string = ""
                field.forEach(item => {
                    if (item.possibly.size === 1) {
                        string += [...item.possibly][0]
                    } else {
                        string += item.value
                    }
                })
                this.option.add(string)
            } else {
                let item = field.find(x => x.possibly.size > 1 && x.value === 0)
                item.possibly.forEach(subitem => {
                    let litle = {}
                    litle.q1 = []
                    item.possibly.forEach(x => {
                        litle.q1.push(x)
                    })
                    litle.q2 = item.id
                    let string = ""
                    field.forEach(item1 => {
                        if (item.id !== item1.id) {
                            string = string + item1.value
                        } else {
                            string = string + subitem
                        }
                    })
                    if (this.param < 1) {
                        this.Bulkhead(string)
                        this.param++
                    }
                })
            }
        }

    }

    Bulkhead(stringField) {
        let field = this.allPossibly(this.fieldInit(stringField))
        if (this.checkWinPossibly(field)) {
            let str = ''
            field.forEach(item => {
                if (item.value > 0) {
                    str = str + item.value
                } else {
                    str = str + [...item.possibly][0]
                }
            })
            this.option.add(str)
        } else {
            if (!this.checkLose(field)) {
                let button = field.find(item => item.possibly.size > 1)
                button.possibly.forEach(item => {
                    let str = ''
                    field.forEach(item2 => {
                        if (item2.id === button.id) {
                            str = str + item
                        } else {
                            str = str + item2.value
                        }
                    })
                    if (this.option.size < 10) {
                        this.Bulkhead(str)
                    }
                })
            }
        }
    }

    newField() {
        this.setAdvancedPossibly([1, 1, 1])
        let stringField = ''
        let field = this.fieldInit('000000000000000000000000000000000000000000000000000000000000000000000000000000000')
        let count = 0
        let check = true
        let succes = true

        while ((count < 16 || check) && succes) {
            let place = Math.floor(Math.random() * (81))
            let value = Math.floor(Math.random() * (8)) + 1
            if (field[place].possibly.has(value) && field[place].value === 0) {
                count++
                field[place].value = value
                field[place].possibly.clear()
                this.allPossibly(field)
            }
            if (count > 16) {
                let str = ''
                field.forEach((item) => {
                    str += item.value
                })
                if (this.sudokuSolution(str).size === 0) {
                    succes = false
                }
                if (this.sudokuSolution(str).size === 1) {
                    check = false
                }
            }

        }
        if (succes) {
            field.forEach((item) => {
                stringField += item.value
            })
            console.log(this.sudokuSolution(stringField));
            return stringField
        } else {
            console.log('fail try again');
            return false
        }
    }
}

export default {
    sudokuData
}