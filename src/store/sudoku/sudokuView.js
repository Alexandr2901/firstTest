const border = {
    right: [2,11,29,38,56,5,14,32,41,50,59,68,77,65,74],
    bottom: [18,19,21,22,24,25,26,45,46,48,49,51,52,53],
    rightbottom: [20,23,47,50],
}

class SudokuView {
    constructor(stringField) {
        this.stringField = stringField
        this.constValueColor = 'rgba(0,0,0)'
        this.userPlacedColor = 'rgba(0,0,0, 0.5)'
    }
    fieldInit (stringField) {
        let a = []
        for (let i = 0; i < stringField.length; i++) {
            a.push({
                id:i,
                // const: stringField[i] === '0' ? this.userPlacedColor : this.constValueColor,
                bgcolor: false
            })
        }

        border.right.forEach(element => {
            a.find(item => item.id === element).sides = 'r'
        });
        border.bottom.forEach(element => {
            a.find(item => item.id === element).sides = 'b'
        });
        border.rightbottom.forEach(element => {
            a.find(item => item.id === element).sides = 'l'
        });
        return a
    }
}
export default {
    SudokuView
}