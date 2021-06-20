<template>
  <div
      :style="local"
      class="comfortChoice">
    <div
        v-for="item in possibly "
        :key="item"
        :style="sizes" class="mainItems"
        @mouseup="selectValue(item)">
      {{ item }}
    </div>
    <div
        v-if="possibly.size<9"
        :style="centerItem"
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
    return {
      local: {
        left: this.distance.left / Math.min(window.innerHeight, window.innerWidth) * 100 - 10,
        top: this.distance.top / Math.min(window.innerHeight, window.innerWidth) * 100 - 10
      },
      sizes: {
        width: this.sizeBtn + "vmin",
        height: this.sizeBtn + "vmin",
      },
      centerItem: {
        gridColumnStart: 2,
        gridRowStart: 2
      }
    }
  },
  methods: {
    selectValue(number) {
        this.$emit('send-value', number)

    },
    gridCenterItem() {
      if (this.buttonId < 9) {
        this.local.top +=10
        this.centerItem.gridRowStart -=1
      }
      if (this.buttonId > 71) {
        this.local.top -=10
        this.centerItem.gridRowStart +=1
      }
      if (this.buttonId%9 ===0) {
        this.local.left +=10
        this.centerItem.gridColumnStart -=1
      }
      if (this.buttonId%9 ===8) {
        this.local.left -=10
        this.centerItem.gridColumnStart +=1
      }
      this.local.left += "vmin"
      this.local.top += "vmin"
    }
  },
  mounted() {
    this.gridCenterItem()
  },
  beforeUpdate() {
    this.distance.left =0
    this.distance.top =0
    // this.gridCenterItem()
  }

}
</script>

<style scoped>
.comfortChoice {
  /*border: green solid 5px;*/
  user-select: none;
  position: absolute;
  display: grid;
  font-size: 8vmin;
  text-align: center;
  grid-template-columns: repeat(3, 1fr);
}

.mainItems {
  background-color: #9ae35a;
}
</style>