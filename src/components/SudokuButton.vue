<template>
  <div
      ref="sudokuButton"
      class="SudokuButton"

      v-bind:style="[{backgroundColor: dataView.bgcolor, width: sizeBtn, height: sizeBtn, fontSize: sizeBtn} ,styles]"
      @click="mouseDown"
  >
    <div v-if="localData.value !== 0"
         class="MainValue" v-bind:style="{color: dataView.const}">
      {{ localData.value }}
    </div>
    <div v-else-if="possiblyShow" v-for="item in this.localData.possibly"  :key="item"
         class="PossublyValue">
    {{item}}
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
      isClicked: false
    }
  },
  methods: {
    ...mapActions({
      UpdateFieldTargetValue: 'sudoku/setFieldValue'
    }),
    mouseDown() {
      // if (!this.localData.const) {
        this.$emit('select-button', {
          id: this.ButtonId,
          left: this.$refs.sudokuButton.getBoundingClientRect().left,
          top: this.$refs.sudokuButton.getBoundingClientRect().top
        })
      // }
    },
    message(e) {
      console.log(e)
    }
  },
  computed: {
    testget() {
      return Math.floor(Math.floor(this.ButtonId / 3) / 9) * 3 + Math.floor(this.ButtonId / 3) % 3
    },

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
      if ((this.localData.possibly.size === 0 && !this.localData.const && this.localData.value ===0)) {
        styles.backgroundColor = '#720101'
      }
      return styles
    }
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
