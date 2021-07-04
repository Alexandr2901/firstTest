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

    setField(stringField) {
        this.stringField = stringField
        this.Field = this.fieldInit(stringField)
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
        // this.advancedPossibly[number] = !this.advancedPossibly[number]
        this.advancedPossibly.splice(number, 1, !this.advancedPossibly[number])
        // console.log(this.advancedPossibly)
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
            // console.log(field)
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
                // console.log(add)
                setTimeout(() => {
                    if (item.possibly.size === 1 && this.wrongIds.size === 0 &&
                        this.autoSolve &&
                        item.value === 0) {
                        this.Field[item.id].value = [...item.possibly][0]
                        // this.setFieldValue(item.id, [...item.possibly][0])
                    }
                // console.log(delay)
                }, delay)
            })
            setTimeout(() => {
                this.allPossibly()
                // this.autoSolveOne()
            }, delay+10)
            // setTimeout(() => {
            //     // this.allPossibly()
            //     this.autoSolveOne()
            // }, 10000)
        }

    }

    // startAutoSolve() {
    //     if (this.autoSolve) {
    //         setTimeout(() => {
    //             if (this.autoSolve) {
    //                 if (!this.advancedPossibly[0]) {
    //                     this.advancedPossibly[0] = 1
    //                     this.allPossibly(this.Field)
    //                 }
    //                 if (this.Field.some(item => item.possibly.size === 1 && item.value === 0)) {
    //                     let x = this.Field.find(item => item.possibly.size === 1 && item.value === 0)
    //                     this.setFieldValue(x.id, ...[...x.possibly])
    //                     this.startAutoSolve()
    //                 }
    //             }
    //         }, 1000)
    //     }
    // }

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
        // console.log(stringField)
        this.Bulkhead(stringField)
        // console.log(this.option)
        return this.option
    }

    Bulkhead(stringField, value = 0) {
        let fieldClass = new sudokuData([1, 1, 1])
        fieldClass.setField(stringField)
        // console.log(fieldClass.getField());
        if (value) {
            // fieldClass.getField()[pos].value = value
            // console.log(fieldClass.getField().find(item => item.value === 0).possibly, value);
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
            // let fields = []
            fieldClasses.forEach(field => {
                // setTimeout(() => {
                let index = -1
                // console.log(field.getField())
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
                // }, 0)
            })
            // fieldClasses.push(result)

        })
        // this.newField2(fields)

        setTimeout(() => {
            // fieldClasses.forEach(item => {
            //     console.log(item.getFieldString())
            // })
            console.log(fieldClasses)
        }, 100)
        // console.log(fieldClasses["sudokuData"])
    }

    random81symbols() {
        let x = Math.random().toFixed(40).slice(2)
        let y = Math.random().toFixed(41).slice(2)
        return x + y
    }

    async newField() {
        let field = new sudokuData([1, 1, 1])
        field.setField('000000000000000000000000000000000000000000000000000000000000000000000000000000000')
        let count = 0
        while (count < 18 || (field.sudokuSolution(field.getFieldString()).size > 1)) {
            let pos = Math.floor(Math.random() * (81))
            if (field.getField()[pos].possibly.size !== 0) {
                count++
                let possibles = [...field.getField()[pos].possibly]
                let value = possibles[Math.floor(Math.random() * possibles.length)];
                field.getField()[pos].value = value
                field.allPossibly()
            }
        }
        if (field.sudokuSolution(field.getFieldString()).size === 1) {

            return field.getFieldString()
        } else {
            // console.log(1)
            // let res = await this.newField()
            // console.log(res)
            return await this.newField()
        }
    }

    newField3() {
        let stringField = this.random81symbols()
        let field = new sudokuData([1, 1, 1])
        field.setField(stringField)
        field.getField().forEach(item => {
            item.const = false
        })
        field.allPossibly()
        while (field.getWrongIds().size !== 0) {
            field.getField()[[...field.getWrongIds()][0]].value = 0
            field.allPossibly()
        }
        while (field.sudokuSolution(field.getFieldString()).size < 1) {
            field.getField().find(item => item.value !== 0).value = 0
            field.allPossibly()
        }

        // field.getWrongIds().forEach(item => {
        //     field.getField()[item].value = 0
        // })
        return field.getFieldString()
    }

    newField2() {
        let fieldClass = new sudokuData()
        let str = '000000000000000000000000000000000000000000000000000000000000000000000000000000000'

        fieldClass.setField('000000000000000000000000000000000000000000000000000000000000000000000000000000000')
        fieldClass.setAdvancedPossibles([1, 1, 1])
        let x = new Set()
        while (x.size !== 16) {
            x.add(Math.floor(Math.random() * (81)))
        }
        [...x].forEach(item => {
            str.charAt(item)
            // console.log(item)
            fieldClass.setFieldValue(item, [...fieldClass.getField()[item].possibly][0])
        })
        // while (this.sudokuSolution(fieldClass.getFieldString()).size !== 1) {
        //     fieldClass.getField().find(item => item.value === 0).possibly.forEach(item => {
        //         fieldClass.setFieldValue(fieldClass.getField().find(item => item.value === 0), item)
        //     })
        // }
        // if (this.sudokuSolution(fieldClass.getFieldString()).size !== 1) {
        //
        // }
        // console.log(fieldClass.getField())
    }

    newField5() {
        this.setAdvancedPossibly([1, 1, 1])
        let stringField = ''
        let field = this.fieldInit('000000000000000000000000000000000000000000000000000000000000000000000000000000000')
        let count = 0
        let check = true
        let success = true
        while ((count < 16 || check) && success) {
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
                    success = false
                }
                if (this.sudokuSolution(str).size === 1) {
                    check = false
                }
            }

        }
        if (success) {
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