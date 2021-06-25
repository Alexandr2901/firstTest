<template>
  <div
      :style="componentStyle"
      class="comfortChoice">
    <div
        v-for="item in possibly"
        :key="item"
        :style="buttonSize"
        class=" mainColor mainItems"
        @click="selectValue(item)"
    >
      {{ item }}
    </div>
    <div
        v-if="params.possibly.size<9 && params.value === 0"
        :style="[blankItem, buttonSize]"
        class=" centerItem">
    </div>
    <div
        v-if="params.value !== 0"
        :style="[blankItem, buttonSize]"
        class="mainItems"
        @click="selectValue(0)"
    >
      x
    </div>
  </div>
</template>

<script>
export default {
  name: "comfortChoice",
  props: {
    sizeBtn: Number,
    params: {
      possibly: Set,
      buttonId: Number,
      top: Number,
      left: Number,
      value: Number
    }
  },
  data: function () {
    return {
    }
  },
  methods: {
    selectValue(number) {
      this.$emit('send-value', number)
    }
  },
  computed: {
    buttonSize() {
      return {
        width: this.sizeBtn + "vmin",
        height: this.sizeBtn + "vmin",
      }
    },
    possibly () {
      let ar = new Set( [...this.params.possibly])
      ar.delete(this.params.value)
      return ar
    },
    componentStyle() {
      let gridTemplateColumns = 3
      let gridTemplateRows = 3
      let left = (this.params.left ) / Math.min(window.innerHeight, window.innerWidth) * 100 - this.sizeBtn
      let top = (this.params.top) / Math.min(window.innerHeight, window.innerWidth) * 100- this.sizeBtn
      if (this.params.buttonId < 9) {
        top += this.sizeBtn
      }
      if (this.params.buttonId > 71) {
        top -= this.sizeBtn
      }
      if (this.params.buttonId % 9 === 0) {
        left += this.sizeBtn
      }
      if (this.params.buttonId % 9 === 8) {
        left -= this.sizeBtn
      }
      if (this.params.possibly.size < 6) {
        if (this.params.buttonId >71) {
          top += this.sizeBtn
        }
        gridTemplateRows = 2
      }
      if (this.params.possibly.size < 4) {
        if (this.params.buttonId % 9 === 8) {
          left += this.sizeBtn
        }
        gridTemplateColumns = 2
      }
      return {
        left: left += "vmin",
        top: top += "vmin",
        gridTemplateColumns: 'repeat(' + gridTemplateColumns + ', 1fr)',
        gridTemplateRows: 'repeat(' + gridTemplateRows + ', 1fr)'

      }
    },
    blankItem() {
      let column = 2
      let row = 2
      if (this.params.buttonId < 9) {
        row = 1
      }
      if (this.params.buttonId > 71) {
        row = -2
      }
      if (this.params.buttonId % 9 === 0) {
        column = 1
      }
      if (this.params.buttonId % 9 === 8) {
        column = -2
      }
      return {
        gridColumnStart: column,
        gridRowStart: row
      }
    }
  }
  // mounted() {
  //   console.log(this.params.top)
  // }
}
</script>

<style scoped>
.comfortChoice {
  pointer-events: none;
  /*border-radius: 10px;*/
  user-select: none;
  position: absolute;
  display: grid;
  font-size: 8vmin;
  text-align: center;

}

.mainItems {
  border: black solid 2px;
  padding: 1px;
  /*background-color: #c32525;*/
  /*border-radius: 10px;*/
  pointer-events: auto;
  box-sizing: border-box;
}
.centerItem{
  opacity: 1;
}
/*.mainItems:hover {*/
/*  background-color: #9ae35a;*/
/*}*/

</style>