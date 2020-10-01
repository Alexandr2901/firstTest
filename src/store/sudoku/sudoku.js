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
class sudokuSolve {
    constructor() {
        this.repeat = true
        this.option = new Set() //количество решений
        this.possiblyends = 0
        this.param = 0
        this.advanchedPossibly = [1, 0, 0]
    }
    optionk() {
        return this.option
    }
    setAdvanchedPossibly(parametr) {
        this.advanchedPossibly = parametr
    }
    fieldInit(stringField) {
        let a = []
        for (let i = 0; i < stringField.length; i++) {
            a.push({
                id: i,
                value: +stringField[i],
                possibly: new Set()
            })
        }
        this.cycleInint(a)
        // setTimeout(() => {
        //     return a
        // }, 1000)
        return a
    }
    cycleInint(field) {
        field.forEach(item => {
            if (item.value === 0) {
                item.possibly = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
            } else {
                item.possibly.clear()
            }
        })
        return
    }
    allPossubly(field) {
        //console.log('allPossublystart');
        //console.log(this.advanchedPossibly)
        let error = 0
        //this.methods = data
        this.cycleInint(field)
        // if (cycle) {
        //     this.cycleInint(field)
        // }
        while (this.repeat || error < 2) {
            console.log('1');
            error++
            this.repeat = false
            this.segmentsSeparate(field)
            //alert('123')
        }
        //console.log(field);
        // setTimeout(()=>{
        //     return  field
        // },0)
        // setTimeout(()=>{
        //     this.possiblyend = true
        // },0)
        this.possiblyends++
        //console.log('allPossublyend');
        return field
    }
    segmentsSeparate(field) {
        //console.log('segmentsSeparate');
        for (let i = 0; i < 9; i++) {
            let selectedrow = []
            let selectedcolumn = []
            let square = []
            for (let j = 0; j < 9; j++) {
                selectedrow.push(field[i * 9 + j])
                selectedcolumn.push(field[i + j * 9])
                square.push(field[sudokuSquares[i][j]])
            }
            //console.log(selectedrow);
            this.allPossublyInSegment(selectedrow)
            this.allPossublyInSegment(selectedcolumn)
            this.allPossublyInSegment(square)
        }
        return
    }
    allPossublyInSegment(segment) {
        if (this.advanchedPossibly[0]) {
            this.existValue(segment)
        }
        if (this.advanchedPossibly[1]) {
            this.onlyHere(segment)
        }
        if (this.advanchedPossibly[2]) {
            this.onePossiblyDelete(segment)
        }
        return
        // if (this.methods === 4) {
        //     this.onlyHere(segment)
        //     this.onePossiblyDelete(segment)
        //     //console.log('123'); 
        // } else {
        //     if (this.methods[0]) {
        //         this.onlyHere(segment)
        //     }
        //     if (this.methods[1]) {
        //         this.onePossiblyDelete(segment)
        //     }
        // }
    }
    existValue(segment) {
        let segmentPossibly = new Set()
        segment.forEach(item => {
            if (item.value > 0) {
                segmentPossibly.add(item.value)
            }
            // } else {
            //     if (item.possibly.size === 1) {
            //         alert('what')
            //         segmentPossibly.add()
            //     }
            // }
        })
        segment.forEach(item => {
            segmentPossibly.forEach(item2 => {
                item.possibly.delete(item2)
            })
        })
        return
        // console.log('segmentPossibly');
        // console.log(segmentPossibly);
        // segmentPossibly.forEach(item => {
        //     console.log(item);

        // })
        // if (segmentPossibly.size > 0) {
        //     console.log('segment');
        //     console.log(segment);

        // }
        //console.log(segment);
    }
    onlyHere(segment) {
        //console.log('onlyHere');
        let possiblyes = []
        segment.forEach(item => {
            
                item.possibly.forEach(subitem => {
                    //console.log();
                    possiblyes.push(subitem)
                })
            
        })
        //let test = possiblyes
        //console.log(possiblyes);

        possiblyes = possiblyes.filter(value => {
            if (possiblyes.indexOf(value) === possiblyes.lastIndexOf(value)) {
                return value
            }
        })
        //console.log(possiblyes);
        possiblyes.forEach(number => {
            segment.forEach(item => {
                if (item.possibly.has(number) && item.possibly.size > 1) {
                    //console.log(segment);
                    //console.log(item);
                    //console.log(possiblyes);
                    //console.log(test);
                    //console.log('2');
                    this.repeat = true
                    item.possibly.clear()
                    item.possibly.add(number)
                }
            })
        })
        return
    }
    onePossiblyDelete(segment) {
        // let only = new Set()
        // segment.forEach(item => {
        //     if (item.possibly.size === 1) {
        //         item.possibly.forEach(elem => {
        //             //console.log(elem);
        //             only.add(+elem)
        //         })
        //     }
        // })
        // if (only.size > 0) {
        //     segment.forEach(item => {
        //         only.forEach(elem => {
        //             if (item.possibly.size > 1) {
        //                 //console.log('3');
        //                 //this.repeat = true
        //                 item.possibly.delete(elem)
        //             }

        //         })
        //     })
        // }
        //return
        segment.forEach(item => {
            let id = 10
            if (item.possibly.size === 1) {
                id = item.id
                segment.forEach(subitem => {
                    if (id !== subitem.id) {
                        item.possibly.forEach(elem => {
                            subitem.possibly.delete(elem)
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
        //let check = field.every(item => item.value !== 0 || item.possibly.size === 1)
        let check = true
        field.forEach(item => {
            if (item.value === 0 && item.possibly.size !== 1) {
                check = false
            }
        })
        // if(field[1].value === field[2].value) {
        //     check = false
        // }
        //console.log(check);
        return check
        //return field.every(item => (item.value !== 0 & item.possibly.size === 1))
    }
    checkLose(field) {
        let x = false
        field.forEach(item => {
            if (item.value === 0 && item.possibly.size === 0) {
                x = true
            }
        })
        // if (x) {
        //     console.log(field); 
        // }
        return x
    }
    checkWinPossiblyString(stringfield) {
        this.advanchedPossibly = [1, 1, 1]
        return this.checkWinPossibly(this.allPossubly(this.fieldInit(stringfield)))
        //return false
    }
    setValue(field, id, value) {
        //console.log('setValue')
        if (field[id].possibly.has(value)) {
            field[id].value = value
            field[id].possibly.clear()
        }
        return this.allPossubly(field)
    }
    sudokuSolution(stringField) {
        //this.bulkhead(field, option)
        //console.log(stringField);
        // setTimeout(() => this.Bulkhead(stringField),10000)
        //let x = 0
        this.Bulkhead(stringField)
        //.then(x++)
        // if (x === 10) {
        //     return this.option
        // }
        //setTimeout(() => {return this.option},10000)
        // return new Promise(() => {

        // })
        return this.option

    }
    Bulkhead2(stringField) {
        //console.log(stringField);
        //let param = 0
        // let xxx = 0
        // while (xxx<100) {
        //     xxx++
        //     console.log(xxx);
        // }
        // console.log('xxx');
        //перебор
        //console.log('stringField');
        //console.log(stringField);
        //console.log('stringField')
        //console.log(stringField)
        //let snapshot = this.possiblyends + 1
        //let times = 0
        let field = this.fieldInit(stringField)
        this.possiblyend = false
        field = this.allPossubly(field, false)
        //console.log(field);
        // while (snapshot !== this.possiblyends) {
        //     console.log('1');

        //     //times++
        // }
        //this.possiblyends
        //console.log(this.fieldInit(stringField))
        //this.allPossubly(field)
        //console.log('field')
        //console.log(field)
        //field = this.allPossubly(field)
        //this.possiblyend.onchange = () => {
        if (!this.checkLose(field) && this.option.size < 10) {
            //console.log('1');
            //this.checkWinPossibly(field)
            if (this.checkWinPossibly(field)) {
                let string = ""
                field.forEach(item => {
                    if (item.possibly.size === 1) {
                        string += [...item.possibly][0]
                    } else {
                        string += item.value
                    }
                })
                //console.log('1');
                this.option.add(string)
                //return data
            } else {
                //console.log('1')
                //let item
                //console.log('x');
                //let item
                // field.forEach(x => {
                //     if (x.possibly.size > 1) {
                //         item = x
                //     }
                // })
                //console.log(field);
                let item = field.find(x => x.possibly.size > 1 && x.value === 0)
                //console.log(item);
                // item = field.find(x => {
                //      if (x.value === 0 && x.possibly.size > 1) {
                //        return x
                //      }
                // })
                //console.log('item');
                //console.log(field);
                //JSON.parse(JSON.stringify(obj))
                // let litle = []
                // item.possibly.forEach(x => {
                //     litle.push(x)
                // })
                // console.log(litle);
                //let litle = JSON.parse(JSON.stringify([...item.possibly]))
                item.possibly.forEach(subitem => {
                    //if (item.possibly.has(subitem)) {
                    //console.log(item)
                    let litle = {}
                    litle.q1 = []
                    item.possibly.forEach(x => {
                        litle.q1.push(x)
                    })
                    litle.q2 = item.id
                    // console.log(litle);
                    // console.log('subitem',subitem);
                    //this.setValue(field,item.id,subitem)
                    // if (item.possibly.has(subitem)) {
                    //     item.value = subitem
                    // }
                    let string = ""
                    field.forEach(item1 => {
                        if (item.id !== item1.id) {
                            string = string + item1.value
                        } else {
                            string = string + subitem
                        }
                    })
                    //string[item.id] = subitem
                    //setTimeout(() => this.Bulkhead(string), 100)
                    // console.log(string);
                    // console.log(field);
                    if (this.param < 1) {
                        this.Bulkhead(string)
                        this.param++
                        //console.log('Bulkhead');
                    }
                    //this.Bulkhead(string)
                })
            }
        }

    }
    Bulkhead(stringField) {
        let field = this.allPossubly(this.fieldInit(stringField))
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
export default {
    sudokuSolve
}