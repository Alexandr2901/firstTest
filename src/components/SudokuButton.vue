<template>
  <div
      ref="sudokuButton"
      class="SudokuButton"
      v-bind:class="{rightbottom: dataView.sides === 'l',
      right: dataView.sides === 'r',
      bottom: dataView.sides === 'b' }"
      v-bind:style="{backgroundColor: dataView.bgcolor, width: sizeBtn, height: sizeBtn, fontSize: sizeBtn}"
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
  margin-right: 0px;
  border-right-width: 3px;
}

.bottom {
  margin-bottom: 0px;
  border-bottom-width: 3px;

}

.rightbottom {
  margin-bottom: 0px;
  border-bottom-width: 3px;
  margin-right: 0px;
  border-right-width: 3px;
}
</style>
