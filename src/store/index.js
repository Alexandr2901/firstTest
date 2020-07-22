import Vue from 'vue'
import Vuex from 'vuex'
import dataManage from './dataManage'
import testMod from './testMod'
import sudoku from './sudoku'
// import example from './module-example'
// import SudokuMethods from './getData/SudokuMethods'

Vue.use(Vuex);

export default function() {
  return new Vuex.Store({
    modules: {
      dataManage,
      testMod,
      sudoku
      // example
      // SudokuMethods
    }
  })
}
