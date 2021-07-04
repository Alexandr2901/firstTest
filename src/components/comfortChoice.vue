<template>
  <div
      :style="componentStyle"
      class="comfortChoice">
    <div
        v-for="item in possibly"
        :key="item"
        :style="buttonSize"
        class=" mainColor mainItems"
        v-bind:class="{secondColor: redact, red: !params.possibly.has(item)}"
        @click="selectValue(item)"
    >
      {{ item }}
    </div>
    <div
        v-if="possibly.size<9 && params.value === 0 && possibly.size>1"
        :style="[blankItem, buttonSize]"
        class=" centerItem">
    </div>
    <div
        v-if="params.value !== 0"
        :style="[blankItem, buttonSize]"
        class="mainItems secondColor"
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
    redact: Boolean,
    params: {
      possibly: Set,
      buttonId: Number,
      top: Number,
      left: Number,
      value: Number,
      possiblyDeleted: Array
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
      this.params.possiblyDeleted.forEach(item => {
        ar.add(item)
      })
      return ar
    },
    componentStyle() {
      let gridTemplateColumns = 3
      let gridTemplateRows = 3
      let left = (this.params.left ) / Math.min(window.innerHeight, window.innerWidth) * 100 - this.sizeBtn -1
      let top = (this.params.top) / Math.min(window.innerHeight, window.innerWidth) * 100- this.sizeBtn -1
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
      if (this.possibly.size < 6) {
        if (this.params.buttonId >71) {
          top += this.sizeBtn
        }
        gridTemplateRows = 2
      }
      if (this.possibly.size < 4) {
        if (this.params.buttonId % 9 === 8) {
          left += this.sizeBtn
        }
        gridTemplateColumns = 2
      }
      if (this.possibly.size <=1) {
        left = (this.params.left ) / Math.min(window.innerHeight, window.innerWidth) * 100 -1
        top = (this.params.top) / Math.min(window.innerHeight, window.innerWidth) * 100 - 1
        gridTemplateColumns = 1
        gridTemplateRows = 1
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
  },
}
</script>

<style scoped>
.comfortChoice {
  opacity: 2;
  pointer-events: none;
  background-color:   #E2E3FB;
  padding: 0.5vmin;
  border-radius: 10px;
  user-select: none;
  position: absolute;
  display: grid;
  font-size: 8vmin;
  text-align: center;
  animation-name: Appearance;
  animation-duration: 0.2s;
  animation-timing-function: linear;
}
@keyframes Appearance {
  0% {opacity: 0;}
  100% {opacity: 1;}
}

.mainItems {
  padding: 1px;
  border: 1px solid #CFCDC5;
  border-radius: 0.6vmin;
  margin: 0.2vmin;
  background: #F5F5F5;
  color: #434691;
  pointer-events: auto;
  box-sizing: border-box;
}
.centerItem{
  opacity: 0;
}
.red{
  color: #43A7C7;
}

</style>