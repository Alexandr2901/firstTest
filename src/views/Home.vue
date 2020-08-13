<template>
  <div class="home">
    <!-- {{this.Fields}} -->
    <div class="cards">
      <div v-for="(item, index) in fieldsN(start,end)"
      :key="item">
        <!-- v-bind:easy="Checked(item)" -->
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
//import { nextTick } from 'vue/types/umd'
export default {
  name: 'Home',
  data: function () {
    return {
      start: 0,
      end: 1,
      maxEnd:100,
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
      // this.$nextTick(()=>{
      //   this.end++
      // })
        if (this.maxEnd >= this.end) {
          setTimeout(() => {
            this.end++
          }, 1)
          //this.end++
        }
    },
    maxEndUp () {
      this.start += 200
      this.maxEnd += 200
      this.endUp()
    }
  },
  mounted() {
    // window.addEventListener('scroll', () => {
    //   console.log('321');
    //   this.maxEnd+=10
    //   this.endUp()
    // });
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