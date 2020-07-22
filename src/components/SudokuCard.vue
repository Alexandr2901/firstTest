<template>
  <div
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
export default {
    name: 'SudokuCard',
    props: {
        stringfield: String,
        fieldid: Number,
        easy: Boolean
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
        color () {
            if (this.easy) {
                return 'green'
            } else {
                return 'white'
            }
        }
    }
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
}
</style>