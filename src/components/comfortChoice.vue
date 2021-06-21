<template>
  <div
      :style="componentStyle"
      class="comfortChoice">
    <div
        v-for="item in possibly "
        :key="item"
        :style="buttonSize" class="mainItems"
        @click="selectValue(item)"
    >
      {{ item }}
    </div>
    <div
        v-if="possibly.size<9"
        :style="[blankItem, buttonSize]"
        class="centerItem">
    </div>
  </div>
</template>

<script>
export default {
  name: "comfortChoice",
  props: {
    sizeBtn: Number,
    distance: {
      top: Number,
      left: Number,
    },
    possibly: Set,
    buttonId: Number
  },
  data: function () {
    return {}
  },
  methods: {
    hi() {
      console.log('hi')
    },
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
    componentStyle() {
      let gridTemplateColumns = 3
      let gridTemplateRows = 3
      let left = this.distance.left / Math.min(window.innerHeight, window.innerWidth) * 100 -1 - this.sizeBtn
      let top = this.distance.top / Math.min(window.innerHeight, window.innerWidth) * 100 -1 - this.sizeBtn
      if (this.buttonId < 9) {
        top += 10
      }
      if (this.buttonId > 71) {
        top -= 10
      }
      if (this.buttonId % 9 === 0) {
        left += 10
      }
      if (this.buttonId % 9 === 8) {
        left -= 10
      }
      if (this.possibly.size < 6) {
        if (this.buttonId >71) {
          top += 10
        }
        gridTemplateRows = 2
      }
      if (this.possibly.size < 4) {
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
      if (this.buttonId < 9) {
        row = 1
      }
      if (this.buttonId > 71) {
        row = -2
      }
      if (this.buttonId % 9 === 0) {
        column = 1
      }
      if (this.buttonId % 9 === 8) {
        column = -2
      }
      return {
        gridColumnStart: column,
        gridRowStart: row
      }
    }
  }
}
</script>

<style scoped>
.comfortChoice {
  pointer-events: none;
  border-radius: 10px;
  user-select: none;
  position: absolute;
  display: grid;
  font-size: 8vmin;
  text-align: center;
}

.mainItems {
  border: black solid 2px;
  padding: 1px;
  background-color: #c32525;
  border-radius: 10px;
  pointer-events: auto;
}

.mainItems:hover {
  background-color: #9ae35a;
}

</style>