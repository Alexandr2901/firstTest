<template>
  <div
      ref="sudokuButton"
      class="SudokuButton"
      v-bind:class="{solved: solved}"
      v-bind:style="[{backgroundColor: dataView.bgcolor, width: sizeBtn, height: sizeBtn, fontSize: sizeBtn} ,styles]"
      @click="mouseDown"
  >
    <div v-if="localData.value !== 0"
         v-bind:style="MainValueStyle.transition"
         class="MainValue">
<!--      <transition v-bind:style="{transform:MainValueStyle.transition}" mode="out-in" name="slide-fade" :css="animations">-->
        <div :key="value">
          {{ value }}
        </div>
<!--      </transition>-->
    </div>
    <div mode="in-out" class="PossiblyValues" v-else-if="possiblyShow">
      <transition-group name="slide-fade" class="PossiblyValues" :css="animations">
        <div class="PossiblyValue" v-for="item in localData.possibly" :key="item">
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
    wrongIds: Set,
    animations: Boolean,
    solved: Boolean
  },
  data: function () {
    return {
      value: this.localData.value === 0 ? '' : this.localData.value,
      MainValueStyle: {
        transition: null
      }
      // possibly: [...this.localData.possibly]
    }
  },
  methods: {
    ...mapActions({
      UpdateFieldTargetValue: 'sudoku/setFieldValue'
    }),
    enter(el, done) {
      el.style.transform = this.MainValueStyle.transition
      done()
      // console.log(this.MainValueStyle.transition)
      // console.log(el.style.transform)
    },
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
    possibly() {
      return [...this.localData.possibly]
    },
    styles() {
      let styles = {}
      // left: this.$refs.sudokuButton.getBoundingClientRect().left + window.scrollX,
      //     top: this.$refs.sudokuButton.getBoundingClientRect().top + window.scrollY
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
      // console.log(this.style)
      // if () {

      // }

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
  },
  mounted() {
    this.MainValueStyle.transition = 'transform: translate(-' +
        (this.$refs.sudokuButton.getBoundingClientRect().left + window.scrollX) + 'px, -'
        + (this.$refs.sudokuButton.getBoundingClientRect().top + window.scrollY) + 'px) scale(0.1)'
    // this.MainValueStyle.animation = 'eye 3s ease-in-out'
    // this.MainValueStyle.keyframes = `
    // animation: eye 3s ease-in-out infinite;
    // @keyframes eye {
    // from { transform:` (this.$refs.sudokuButton.getBoundingClientRect().left + window.scrollX) +'px, -'
    //        +(this.$refs.sudokuButton.getBoundingClientRect().top + window.scrollY)+'px)'`; } }
    // to { transform: translate(0,0); }}`

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
  animation: eye 3s ease-in-out infinite;
  //transition: background-color 5s cubic-bezier(.5, -1, .5, 2);
}

//@keyframes eye {
//  90% { transform: none; }
//  95% { transform: scaleY(0.1); }
//}

//.solved{
//  transition: background-color .2s ease;
//}

.PossiblyValues {
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}

//.SudokuButton>div{
//  //background-color: #0014ff;
//  //position: absolute;
//  //top: 0;
//  //left: 0;
//}

.slide-fade-enter-active {
  transition: all .4s linear;

}

.slide-fade-leave-active {
  transition: all .4s linear;
}

.slide-fade-enter {
  transform: translate(-100px, -100px);
  //opacity: 0;
}

.slide-fade-leave-to {
  transform: scale(2) translateY(-100px);
  opacity: 0;
}

.MainValue {
  user-select: none;
  line-height: 0;
  animation: myAnim .4s linear;
  animation-fill-mode: forwards;
  //transform: scale(0.1);
  //transition: all .4s linear;
  //transform: translate(0, 0);
  //animation-direction: reverse;
}

@keyframes myAnim {
  //from {
  //  transform: inherit;
  80% {
    transform: scale(1.5);
  }
  //}
  100%{
    transform: none;
  }
}

.PossiblyValue {
  color: #0014ff;
  height: 30%;
  width: 30%;
  font-size: 33%;
  user-select: none;
}
</style>
