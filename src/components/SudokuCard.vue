<template>
  <div
  v-if="this.color"
  v-bind:style="{ backgroundColor: color, }"
   class="SudokuCard">
    <div @click="goSudoky()">
        №{{fieldid}}
    <br>
    {{difficult}}
  </div>
  </div>
</template>

<script>
import {
    mapActions
} from 'vuex'
import methods from '../store/sudoku/sudoku'
export default {
    name: 'SudokuCard',
    props: {
        stringfield: String,
        fieldid: Number
    },
    data: function () {
        return {
            color: false
        }
    },
    methods: {
        ...mapActions({
            initialization: 'sudoku/initialization',
        }),
        goSudoky() {
            //console.log(this.fieldid)
            this.initialization(this.fieldid)
            this.$router.push('/Sudoku')
        },
        init () {
            let x = new methods.sudokuSolve
            if (x.checkWinPossiblyString(this.stringfield)) {
                this.color = 'green'
            } else {
                this.color = 'white'
            }
            console.log(x.sudokuSolution(this.stringfield));
            //this.color = 'white'
        }
    },
    computed: {
        difficult() {
            let number = 0
            for (let i = 0; i < this.stringfield.length; i++) {
                if (this.stringfield[i] === '0') {
                    number++
                }
            }
            return ':' + (81 - number)
        },
        // color () {
        //     if (this.easy) {
        //         return 'green'
        //     } else {
        //         return 'white'
        //     }
        // }
    },
    mounted() {
        // this.initialization(1)
        //     this.$router.push('/Sudoku')
        this.init()
        this.$emit('itemChecked')
        //console.log('2');
    }
    // created() {
    //     console.log('1');
    // }
}
</script>
<style>
.SudokuCard{
    user-select: none;
    border-color: rgb(0, 0, 0);
        border-width: 1px;
        border-style: solid;
        font-size: 5vmin;
        min-width: 9vmin;
        min-height: 9vmin;
    /* opacity: 0; */
}
/* .fade-enter-active {
    transition: opacity .5s;
} */
</style>