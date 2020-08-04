<template>
  <div class="home">
    <!-- {{this.Fields}} -->
    <div class="cards">
      <div v-for="(item, index) in fieldsN(start,end)"
      :key="item">
        <!-- v-bind:easy="Checked(item)" -->
         <!-- v-if="checedCount >= index" -->
        <SudokuCard
        v-on:itemChecked="endUp()"
        v-bind:stringfield="item"
          v-bind:fieldid="index+start" />
      </div>
    </div>
    <button @click="maxEndUp()">+</button>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import SudokuCard from '../components/SudokuCard'
import methods from '../store/sudoku/sudoku'
export default {
  name: 'Home',
  data: function () {
    return {
      start: 0,
      end: 10,
      maxEnd:100,
      checedCount :0
    };
  },
  components: {
    SudokuCard
  },
  computed: {
    ...mapGetters({
      fieldsN: 'dataManage/fieldsN'
    }),
    
    // Checked (stringfield)  {
    //   let x = new methods.sudokuSolve
    //   let field = x.fieldInit(stringfield)
    //   field = x.allPossubly(field)
    //   return x.checkWinPossibly(field)
    // }
  },
  methods: {
    Checked (stringfield)  {
      let x = new methods.sudokuSolve
      let param = x.checkWinPossiblyString(stringfield)
      //this.checedCount++
      return param
    },
    startfunc () {
      // let x =new Set([1,2,3])
      // x.delete(1)
      // x.delete(3)
      // console.log([...x][0]);
      let x = new methods.sudokuSolve
      //console.log(this.fieldsN(0,10)[2]);
      //x.sudokuSolution(this.fieldsN(0,100)[0]).then(console.log(x.option))
      console.log(x.sudokuSolution(this.fieldsN(0,100)[2]))
      
      //return x.sudokuSolution(this.fieldsN(1,2))
    },
    endUp() {
      setTimeout(() => {
        if(this.maxEnd>this.end) {
        this.end++
      }
      }, 1)
    },
    maxEndUp () {
      this.maxEnd += 100
      this.endUp()
    }
  },
  mounted() {
    //this.startfunc()
  }
}
</script>
<style scoped>
.cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
button{
  border-color: rgb(0, 0, 0);
        border-width: 1px;
        border-style: solid;
        font-size: 5vmin;
        min-width: 9vmin;
        min-height: 9vmin;
}
</style>