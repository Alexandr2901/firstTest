<template>
  <div
      ref="sudokuButton"
      class="SudokuButton"

      v-bind:style="[{backgroundColor: dataView.bgcolor, width: sizeBtn, height: sizeBtn, fontSize: sizeBtn} ,borderStyle]"
      @click="mouseDown"
  >
    <div v-if="localData.value !== 0"
         class="MainValue" v-bind:style="{color: dataView.const}">
      {{ localData.value }}
    </div>
    <div v-for="item in this.localData.possibly" v-else :key="item"
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
    sizeBtn: String
  },
  data: function () {
    return {
      isMouseUp: false,
      isClicked: false
    }
  },
  methods: {
    ...mapActions({
      UpdateFieldTargetValue: 'sudoku/setFieldValue',
      selectButton: 'sudoku/front/selectButton'
    }),
    mouseDown() {
      this.$emit('select-button', {
        id: this.ButtonId,
        left: this.$refs.sudokuButton.getBoundingClientRect().left,
        top: this.$refs.sudokuButton.getBoundingClientRect().top
      })
    },
    message(e) {
      console.log(e)
    }
  },
  computed: {
    testget() {
      return Math.floor(Math.floor(this.ButtonId / 3) / 9) * 3 + Math.floor(this.ButtonId / 3) % 3
    },
    borderStyle () {
      let styles = {}
      if (this.ButtonId %9 === 2 || this.ButtonId %9 === 5) {
        styles.borderRightWidth = '2px'
        styles.paddingRight = 0
      }
      if (this.ButtonId >17 && this.ButtonId<27 || this.ButtonId >44 && this.ButtonId<54) {
        styles.borderBottomWidth = '2px'
        styles.paddingBottom = 0
      }
      return styles
    }
  }
}
</script>
<style lang="scss" scoped>
.SudokuButton {
  border-color: rgb(0, 0, 0);
  border-width: 1px 1px 1px 1px;
  border-style: solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 2px;
  //margin: 2px;
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
  padding-bottom: 0px;
  border-bottom-width: 3px;
  padding-right: 0px;
  border-right-width: 3px;
}
</style>
