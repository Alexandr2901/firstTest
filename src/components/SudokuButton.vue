<template>
    <div
        ref="sudokuButton"
        class="SudokuButton"
        v-bind:style="[{backgroundColor: dataView.bgcolor, width: sizeBtn, height: sizeBtn, fontSize: sizeBtn} ,styles]"
        @click="mouseDown"
    >
<!--      {{value}}-->
      <div v-if="localData.value !== 0"
           class="MainValue" v-bind:style="{color: dataView.const}">
        <transition  mode="out-in" name="slide-fade">
        <div :key="value">
          {{ value }}
        </div>
        </transition>
      </div>
      <div v-else-if="possiblyShow" v-for="item in this.localData.possibly" :key="item"
           class="PossublyValue">
        {{ item }}
      </div>
    </div>


</template>
<script>
import {mapActions} from 'vuex'

export default {
  name: 'SudokuButton',
  props: {
    ButtonId: Number,
    localData: Object,
    dataView: Object,
    sizeBtn: String,
    possiblyShow: Boolean,
    wrongIds: Set
  },
  data: function () {
    return {
      isMouseUp: false,
      isClicked: false,
      value: this.localData.value === 0 ? '': this.localData.value
    }
  },
  methods: {
    ...mapActions({
      UpdateFieldTargetValue: 'sudoku/setFieldValue'
    }),
    mouseDown() {
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
    //   return this.localData.value
    // },
    styles() {
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
      if ((this.localData.possibly.size === 0 && !this.localData.const && this.localData.value === 0)) {
        styles.backgroundColor = '#720101'
      }
      return styles
    }
  },
  beforeUpdate() {
    // this.value=this.localData.value
  },
  updated() {
    this.value=this.localData.value === 0 ? '': this.localData.value

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

.SudokuButton-enter-active, .SudokuButton-leave-active {
  transition: opacity .5s;
  opacity: 1;
  //transition: transform .5s;
  //transform: translate(0)scale(1);
}

.SudokuButton-enter, .SudokuButton-leave-to {
  opacity: 0;
  //transform: translate(-66vw)scale(0);
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}

.MainValue {
  font-size: 100%;
  text-align: center;
  user-select: none;
  line-height: 0;
}

.PossublyValue {
  color: #0014ff;
  height: 26%;
  width: 26%;
  font-size: 30%;
  user-select: none;
}

.right {
  padding-right: 0px;
  border-right-width: 3px;
}

.bottom {
  padding-bottom: 0px;
  border-bottom-width: 3px;

}

.rightbottom {
  //color: #720101;
  padding-bottom: 0px;
  border-bottom-width: 3px;
  padding-right: 0px;
  border-right-width: 3px;
}
</style>
