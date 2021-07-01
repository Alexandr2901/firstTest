<template>
  <div
      ref="sudokuButton"
      class="SudokuButton"
      v-bind:style="[{backgroundColor: dataView.bgcolor, width: sizeBtn, height: sizeBtn, fontSize: sizeBtn} ,styles]"
      @click="mouseDown"
  >
    <div  v-if="localData.value !== 0"
         class="MainValue" v-bind:style="{color: dataView.const}">
      <transition mode="out-in" name="slide-fade">
        <div :key="value">
          {{ value }}
        </div>
      </transition>
    </div>
    <div mode="in-out" class="PossiblyValues" v-else-if="possiblyShow">
      <transition-group name="slide-fade" class="PossiblyValues">
        <div class="PossiblyValue" v-for="item in localData.possibly" :key="item" >
          {{ item }}
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex'

export default {
  name: 'SudokuButton',
  props: {
    ButtonId: Number,
    localData: {
      possibly: Set,
      value: Number,
      const: Boolean
    },
    dataView: Object,
    sizeBtn: String,
    possiblyShow: Boolean,
    wrongIds: Set
  },
  data: function () {
    return {
      value: this.localData.value === 0 ? '' : this.localData.value,
      // possibly: [...this.localData.possibly]
    }
  },
  methods: {
    ...mapActions({
      UpdateFieldTargetValue: 'sudoku/setFieldValue'
    }),
    mouseDown() {
      // console.log(this.localData)
      // this.localData.value++
      // if (!this.localData.const) {
      this.$emit('select-button', {
        id: this.ButtonId,
        left: this.$refs.sudokuButton.getBoundingClientRect().left + window.scrollX,
        top: this.$refs.sudokuButton.getBoundingClientRect().top + window.scrollY
      })
      // }
    },
    message(e) {
      console.log(e)
    }
  },
  computed: {
    // value() {
    //   return this.localData.value === 0 ? '' : this.localData.value
    // },
    possibly() {
      return  [...this.localData.possibly]
    },
    styles() {
      // console.log('1')
      let styles = {}
      if (!this.localData.const) {
        styles.color = 'rgb(0, 0, 0, 0.5)'
      }
      if (this.ButtonId % 9 === 2 || this.ButtonId % 9 === 5) {
        styles.borderRightWidth = '2px'
        styles.paddingRight = 0
      }
      if (this.ButtonId > 17 && this.ButtonId < 27 || this.ButtonId > 44 && this.ButtonId < 54) {
        styles.borderBottomWidth = '2px'
        styles.paddingBottom = 0
      }
      if (this.wrongIds.has(this.ButtonId)) {
        // styles.color = 'red'
        styles.backgroundColor = 'red'
      }
      if (this.localData.possibly.size === 0 && !this.localData.const && (this.localData.value === 0)) {
        // console.log('qqq')
        styles.backgroundColor = '#720101'
      }
      return styles
    }
  },
  // watch: {
  //   localData: {
  //     value() {
  //       console.log('hi')
  //     },
  //     deep:true
  //   }
  // },
  beforeUpdate() {
    // this.value=this.localData.value
    // this.possibly = [...this.localData.possibly]
  },
  updated() {
    this.value = this.localData.value === 0 ? '' : this.localData.value
    // setTimeout(()=>{
    //   this.possibly = [...this.localData.possibly]
    // })
    // this.possibly = [...this.localData.possibly]
    // console.log(this.possibly)
    // console.log(this.localData.value)
  }
}
</script>
<style lang="scss" scoped>
.SudokuButton {
  border-color: black;
  border-width: 1px 1px 1px 1px;
  border-style: solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 2px;
  box-sizing: border-box;
}

.PossiblyValues {
  //margin: auto;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}
.slide-fade-enter-active {
  transition: all .2s ease;
}

.slide-fade-leave-active {
  transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter
{
  transform: translateY(100px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-100px);
  opacity: 0;
}

.MainValue {
  user-select: none;
  line-height: 0;
}

.PossiblyValue {
  color: #0014ff;
  height: 30%;
  width: 30%;
  font-size: 33%;
  user-select: none;
}
</style>
