<template>
  <div
      class="SudokuButton"
      ref="sudokuButton"
      v-bind:class="{rightbottom: dataView.sides === 'l',
    right: dataView.sides === 'r',
    bottom: dataView.sides === 'b' }"
      v-bind:style="{backgroundColor: dataView.bgcolor, width: sizeBtn, height: sizeBtn, fontSize: sizeBtn}"
      @mousedown="mouseDown"
  >
    <!--
        <div class="MainValue" v-if="param !== 0">
            {{this.param}}
        </div>-->
    <!-- <button @click="UpdateValue(3)"/>-->
    <!--{{this.localData.impossibly}}-->
    <!--{{testget}},-->
    <div v-bind:style="{color: dataView.const}"
         v-if="localData.value !== 0" class="MainValue">
      {{ localData.value }}
    </div>
    <div class="PossublyValue" v-else v-for="item in this.localData.possibly"
         :key="item">
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
    UpdateValue(value) {
      //console.log(this.ButtonId)
      this.UpdateFieldTargetValue({
        value: value,
        target: this.ButtonId
      })
      //console.log('succes')
    },
    sayhi() {
      console.log('hi')
    },
    mouseDown() {
      this.sayhi()
      this.$emit('select-button', {
        id: this.ButtonId,
        left: this.$refs.sudokuButton.getBoundingClientRect().left,
        top: this.$refs.sudokuButton.getBoundingClientRect().top
      })
      // this.selectButton(this.ButtonId)
      // setTimeout(()=> {
      //   this.$emit('select-button', {
      //     e: e,
      //     id: this.ButtonId,
      //     left: this.$refs.sudokuButton.getBoundingClientRect().left,
      //     top: this.$refs.sudokuButton.getBoundingClientRect().top
      //   })
      // },1)
    },
    SelectButton(e) {
      console.log('mouseDown')

      // console.log(e);
      // console.log('SelectButton')
      //console.log(this.ButtonId)

      // console.log(this.$refs.sudokuButton.getBoundingClientRect())
      this.$emit('select-button', {
        e: e,
        id: this.ButtonId,
        left: this.$refs.sudokuButton.getBoundingClientRect().left,
        top: this.$refs.sudokuButton.getBoundingClientRect().top
      })
      this.selectButton(this.ButtonId)
    }
  },
  updated() {
    /*console.log('this.localData.possibly')
    console.log(this.localData.possibly)*/
  },
  computed: {
    testget() {
      return Math.floor(Math.floor(this.ButtonId / 3) / 9) * 3 + Math.floor(this.ButtonId / 3) % 3
    }
  }
}
</script>
<style scoped lang="scss">
.SudokuButton {
  // width: 9vmin;
  // height: 9vmin;
  // font-size: 9vmin;
  /*flex-grow: 2;*/
  /*min-height: 50px;
  min-width: 50px;*/
  /*margin: 1px;*/
  /*padding: 1px;*/
  // rgba(255, 0, 0, 0.349)
  //color: rgba(255, 255, 0, 0.452);
  border-color: rgb(0, 0, 0);
  border-width: 1px 1px 0 0;
  border-style: solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}

.MainValue {
  font-size: 75%;
  user-select: none;
}

// .MainValue:fullscreen
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
