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
    constructor(advancedPossibly = [1, 0, 0], autoSolve = false) {
        // console.log(advancedPossibly, autoSolve)
        this.repeat = true
        this.option = new Set() //количество решений
        this.param = 0 // bulkhead
        this.advancedPossibly = advancedPossibly
        this.segments = []
        this.stack = [] // история поставленных значений
        this.autoSolve = autoSolve
        this.wrongIds = new Set()
    }
    getStack() {
        return this.stack
    }

    setField(stringField) {
        let x = this.autoSolve
        this.autoSolve = false
        this.stack = []
        this.stringField = stringField
        this.Field = this.fieldInit(stringField)
        this.autoSolve = x
        return this.Field
    }

    getField() {
        return this.Field
    }

    getFieldString() {
        let x = ''
        this.Field.forEach(item => {
            x += item.value
        })
        return x
    }

    getWrongIds() {
        return this.wrongIds
    }

    setAdvancedPossibly(number) {
        this.autoSolve = false
        this.advancedPossibly.splice(number, 1, !this.advancedPossibly[number])
        this.allPossibly(this.Field)
    }

    setAdvancedPossibles(parameters) {
        if (this.advancedPossibly !== [1, 1, 1] && parameters !== [1, 1, 1]) {
            this.autoSolve = false
            this.advancedPossibly = parameters
            this.allPossibly(this.Field)
        }
    }

    getAdvancedPossibles() {
        return this.advancedPossibly
    }

    setAutoSolve() {
        this.autoSolve = !this.autoSolve
        this.autoSolveStart()
    }

    getAutoSolve() {
        return this.autoSolve
    }
    autoSolveStart() {
        if (this.autoSolve) {
            let field
            if (this.advancedPossibly[1] && !this.advancedPossibly[2]) {
                let x = new sudokuData([1, 1, 1])
                x.setField(this.getFieldString())
                field = x.getField()
            } else {
                field = this.Field
            }
            if (field.every(item => item.possibly.size === 1 || item.value !== 0)) {
                this.autoSolveOne()
            }
        }
    }

    autoSolveOne() {
        if (this.Field.some(item => item.possibly.size === 1 && item.value === 0) &&
            this.Field.every(element => (element.possibly.size !== 0 || element.value !== 0))) {
            let delay = 0
            let add = 25
            this.Field.forEach(item => {
                delay += add
                add = add*0.97
                setTimeout(() => {
                    if (item.possibly.size === 1 && this.wrongIds.size === 0 &&
                        this.autoSolve &&
                        item.value === 0) {
                        this.Field[item.id].value = [...item.possibly][0]
                    }
                }, delay)
            })
            setTimeout(() => {
                this.allPossibly()
            }, delay+10)
        }

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

    cycleInint(field = this.Field) {
        field.forEach(item => {
            if (item.value === 0) {
                item.possibly = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
            }
        })
        if (this.stack.some(item => item.possibly)) {
            this.stack.filter(item => item.possibly).forEach(item => {
                field[item.id].possibly.delete(item.possibly)
            })
        }
    }

    setFieldValue(id, value) {
        if (id < 81 && id >= 0 && value >= 0 && value <= 9) {
            if (!this.Field[id].const) {
                this.stack.push({
                    id: id,
                    previousValue: this.Field[id].value
                })
                let x = {...this.Field[id]}
                x.value = value
                this.Field[id] = x
                this.allPossibly()
            }
        }
    }

    removeFieldPossibly(id, value) {
        if (id < 81 && id >= 0 && !this.Field[id].const && this.Field[id].possibly.has(value)) {
            if (this.Field[id].possibly.size !== 1) {
                this.stack.push({
                    id: id,
                    possibly: value
                })
                this.allPossibly()
            } else {
                this.setFieldValue(id, value)
            }
        } else if (this.stack.some(item => item.id === id && item.possibly === value)) {
            this.stack.splice(this.stack.indexOf(item => item.id === id && item.possibly === value),1)
            this.allPossibly()
            // this.stack.find(item => item.id === id && item.possibly === value).id = null
        }
    }


    undoLastValue() {
        if (this.stack.length !== 0) {
            // this.autoSolve = false
            let data = this.stack.pop()
            if (!data.possibly) {
                this.Field[data.id].value = data.previousValue
            }
            this.allPossibly()
        }
    }

    allPossibly(field = this.Field) {
        // let time = new Date()
        // setTimeout(()=> {
        this.cycleInint(field)
        if (this.advancedPossibly.some(item => item)) {
            let error = 0
            while (this.repeat || error < 2) {
                error = error + 1
                this.repeat = false
                this.segmentsSeparate(field)
            }
        }
        // let time = new Date()
        setTimeout(() => {
            // console.log(new Date() - time)
            this.autoSolveStart()
        }, 1000)
        // console.log(new Date() - time)
        return field
        // },1)

    }

    segmentsSeparate(field) {
        this.wrongIds = new Set()
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
        return true
    }

    existValue(segment) {
        let segmentPossibly = new Set()
        let checkWrong = new Set()
        segment.forEach(item => {
            if (item.value > 0) {
                if (segmentPossibly.has(item.value)) {
                    checkWrong.add(item.value)
                }
                segmentPossibly.add(item.value)
            }
        })
        if (checkWrong.length !== 0) {
            segment.forEach(item => {
                if (checkWrong.has(item.value) && !item.const) {
                    this.wrongIds.add(item.id)
                }
            })
        }
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
            if (!item.const && item.value === 0) {
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
    }

    checkWin() {
        // console.log(this.wrongIds)
        return this.Field.every(item => item.value > 0 && item.value <= 9)
            //&& this.wrongIds.size === 0
    }

    checkGuaranteedWin(str = this.getFieldString()) {
        // this.setAdvancedPossibles([1, 1, 1])
        let field = new sudokuData([1, 1, 1])
        field.setField(str)
        return field.Field.every(item => (item.value > 0 && item.value <= 9) || (item.possibly.size === 1 && item.value === 0))
    }

    checkDeadlock() {
        this.setAdvancedPossibles([1, 1, 1])
        return this.Field.some(item => item.value === 0 && item.possibly.size === 0)
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

    checkLose(field = this.Field) {
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
        this.option.clear()
        this.Bulkhead(stringField)
        return this.option
    }

    Bulkhead(stringField, value = 0) {
        let fieldClass = new sudokuData([1, 1, 1])
        fieldClass.setField(stringField)
        if (value) {
            fieldClass.getField().find(item => item.value === 0 && item.possibly.size > 1).value = value
        }
        let string = fieldClass.getFieldString()
        if (this.option.size < 2 && !fieldClass.checkDeadlock()) {
            if (!fieldClass.checkGuaranteedWin()) {
                fieldClass.getField().find((item) => item.value === 0 && item.possibly.size > 1).possibly.forEach(item => {
                    this.Bulkhead(string, item)
                })
            } else {
                this.option.add(string)
            }
        }
    }

    newFields() {
        let fieldClasses = [new sudokuData([1, 1, 1])]
        fieldClasses[0].setField('000000000000000000000000000000000000000000000000000000000000000000000000000000000')
        let x = new Set()
        while (x.size !== 4) {
            x.add(Math.floor(Math.random() * (81)))
        }
        [...x].forEach(pos => {
            fieldClasses.forEach(field => {
                let index = -1
                field.getField()[pos].possibly.forEach((value) => {
                    let strF = field.getFieldString()
                    index++
                    if (index === 0) {
                        field.getField()[pos].value = value
                    } else {
                        let fieldClass = new sudokuData([1, 1, 1])
                        fieldClass.setField(strF)
                        fieldClass.getField()[pos].value = value
                        fieldClasses.push(fieldClass)
                    }
                })
            })
        })
        setTimeout(() => {
            console.log(fieldClasses)
        }, 100)
    }

    random81symbols() {
        let x = Math.random().toFixed(40).slice(2)
        let y = Math.random().toFixed(41).slice(2)
        return x + y
    }
}

export default {
    sudokuData
}