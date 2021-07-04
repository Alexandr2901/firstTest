<template>
  <div
      ref="sudokuButton"
      class="SudokuButton"
      v-bind:class="{solved: solved}"
      v-bind:style="[{backgroundColor: dataView.bgcolor, width: sizeBtn, height: sizeBtn, fontSize: sizeBtn} ,styles]"
      @click="mouseDown"
  >
<!--    {{Math.max( Math.abs(this.ButtonId%9 - 4) , Math.abs(Math.floor(this.ButtonId/9) - 4))}}-->
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
      <transition-group appear name="slide-fade" class="PossiblyValues" :css="animations">
        <div class="PossiblyValue" v-for="item in possibly" :key="item">
          {{ item }}
        </div>
        <div class="red PossiblyValue " v-for="item in posD" :key="item">
          {{ item }}
        </div>
      </transition-group>
    </div>
<!--    {{posD}}-->
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
    stack: Array,
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
    },
    mouseDown() {
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
    posD() {
      let x =[]
      if (this.stack.some(item=> item.id === this.ButtonId && item.possibly)) {
        this.stack.filter(item => item.id === this.ButtonId && item.possibly).forEach(item=>{
          x.push(item.possibly)
        })
      }
      return x
    },
    possibly() {
      return [...this.localData.possibly]
    },
    styles() {
      let styles = {}
      // left: this.$refs.sudokuButton.getBoundingClientRect().left + window.scrollX,
      //     top: this.$refs.sudokuButton.getBoundingClientRect().top + window.scrollY
      if (!this.localData.const) {
        styles.color = '#43A7C7'
      }
      if (this.ButtonId % 9 === 2 || this.ButtonId % 9 === 5) {
        // styles.borderRightWidth = '4px'
        styles.marginRight = '0.6vmin'
        styles.paddingRight = 0
      }
      if (this.ButtonId > 17 && this.ButtonId < 27 || this.ButtonId > 44 && this.ButtonId < 54) {
        // styles.borderBottomWidth = '4px'
        styles.marginBottom = '0.6vmin'
        styles.paddingBottom = 0
      }
      // if (this.wrongIds.has(this.ButtonId)) {
      //   // styles.color = 'red'
      //   styles.backgroundColor = 'red'
      // }
      if (this.wrongIds.has(this.ButtonId)||this.localData.possibly.size === 0 && !this.localData.const && (this.localData.value === 0)) {
        styles.backgroundColor = '#FDD2C9'
        styles.color = '#EE5B3C'
      }
      if (this.solved) {
        styles.backgroundColor = '#DCF7FF'
        let x = Math.max( Math.abs(this.ButtonId%9 - 4) , Math.abs(Math.floor(this.ButtonId/9) - 4))
        let y = 1401-x*(x*50) -(this.ButtonId%9 +Math.floor(this.ButtonId/9) - 4)*25
        styles.transitionDelay = y + 'ms'
        // styles.transform = 'scale(1.2)'
      }
      // if () {

      // }

      return styles
    }
  },
  updated() {
    // if (this.posD.some(element=> element.possibly === 2)) {
    //   // console.log(this.ButtonId)
    // }
    this.value = this.localData.value === 0 ? '' : this.localData.value
    // setTimeout(()=>{
    //   this.possibly = [...this.localData.possibly]
    // })
    // this.possibly = [...this.localData.possibly]
    // console.log(this.possibly)
    // console.log(this.localData.value)
  },
  mounted() {


    if (this.animations) {
      this.MainValueStyle.transition = 'transform: translate(-' +
          (this.$refs.sudokuButton.getBoundingClientRect().left+ window.scrollX ) + 'px, -'
          + (this.$refs.sudokuButton.getBoundingClientRect().top + window.scrollY) + 'px) scale(0.1)'
    }

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
  border: 1px solid #CFCDC5;
  border-radius: 6px;
  //border-color: black;
  //border-width: 1px 1px 1px 1px;
  //border-style: solid;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F5F5;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.4vmin;
  margin: 0.2vmin;
  box-sizing: border-box;
  color: #434691;
  //animation: eye 3s ease-in-out;
  transition: background-color .3s linear;
}

//@keyframes eye {
//  75% { transform: scale(1.2); }
//  100% { transform: none; }
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
  transition: all .4s ease;

}

.slide-fade-leave-active {
  transition: all .4s ease;
}

.slide-fade-enter {
  transform: scale(0.5) translateY(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: scale(2) translateY(-10px);
  opacity: 0;
}

.MainValue {
  user-select: none;
  line-height: 0;
  animation: myAnim .5s ease;
  animation-fill-mode: forwards;
  //transform: scale(0.1);
  //transition: all .4s linear;
  //transform: translate(0, 0);
  //animation-direction: reverse;
}

@keyframes myAnim {
  //from {
  //  transform: inherit;
  //0%{
  //  transform: scale(0.1);
  //}
  //25%{
  //  transform: scale(0.05);
  //}
  75% {
    transform: scale(1.2);
  }
  //}
  100%{
    transform: none;
  }
}
.red{
  color: #43A7C7 !important;
}
.PossiblyValue {
  color: #EE5B3C;
  //color: #0014ff;
  height: 30%;
  width: 30%;
  font-size: 33%;
  user-select: none;
}
</style>
