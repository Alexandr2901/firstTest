<template>
  <div>
    <div class="s-page" v-bind:style="{flexDirection: flexW}" @click.self="pageClick()" v-if="Field">
      <div v-if="choiceshove" class="choice" v-bind:style="{flexDirection: flexD}">
        <button class="choice-button" @click="SetValue(0)">
          X
        </button>
        <button v-for="item in possiblyChoise" :key="item" class="choice-button" @click="SetValue(item)">
          {{ item }}
        </button>
      </div>
      <div class="Field">
        <div class="Field-line" v-for="line in 9" :key="line">
          <SudokuButton v-for="item in 9"
                        :key="item"
                        v-bind:button-id="(line-1)*9+item - 1"
                        v-bind:size-btn="sizeBtn+'vmin'"
                        v-bind:local-data="Field[(line-1)*9+item-1]"
                        v-bind:dataView="fieldview[(line-1)*9+item-1]"
                        v-on:select-button="buttonClick($event)"/>
        </div>
      </div>
      <div v-if="!menushow" class="menu">
        <div class="menuitem" @click="menushow = !menushow">
          show menu
        </div>
      </div>
      <div v-else v-bind:style="{flexDirection: flexD}" class="menu">
        <div class="menuitem" @click="menushow = !menushow">
          close menu
        </div>
        <div class="menuitem" @click="solutions()">
          solutions
        </div>
        <div class="menuitem" @click="sudokuDataClass.undoLastValue()">
          undo
        </div>
        <div  class="menuitem" @click="sudokuDataClass.setAdvancedPossibly(2)">
          one Possibly
        </div>
        <div  class=" menuitem" @click="sudokuDataClass.setAdvancedPossibly(1)">
          only Here
        </div>
        <div class="menuitem" @click="goBack()">
          back
        </div>
        <div class="menuitem" @click="help()">
          help
        </div>
      </div>

      <comfort-choice
          v-on:send-value="SetValue($event)"
          v-if="easyChoise"
          :size-btn="sizeBtn"
          :params="comfortChoiceData"
      />
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import SudokuButton from '../components/SudokuButton'
import FieldActions from '../store/sudoku/sudokuData'
import comfortChoice from "@/components/comfortChoice";

export default {
  name: 'Sudoku',
  components: {
    SudokuButton,
    comfortChoice
  },
  data() {
    return {
      easyChoise: false,
      easyChoiseShow: true,
      easyChoiseDbClick: true,
      sizeBtn: 11,
      rotate: false,
      flexD: 'column',
      flexW: 'wrap',
      menushow: true,
      choiceshove: true,
      menuStyles: null,
      selectedButton: -1,
      sudokuDataClass: null,
      Field:null,
      comfortChoiceData: {}
    }
  },
  computed: {
    ...mapGetters({
      stringField: 'dataManage/field'
    }),
    possiblyChoise() {
      return this.selectedButton !== -1 ? this.Field.find(item => item.id === this.selectedButton).possibly : 9
    },
     fieldview () {
      let view = []
      for (let i = 0; i < 81; i++) {
        view.push({
          id: i,
          bgcolor: ''
        })
      }
      if (this.selectedButton > -1) {
        view.forEach((item) => {
          if (item.id % 9 === this.selectedButton % 9 || Math.floor(item.id / 9) === Math.floor(this.selectedButton / 9) ||
              (Math.floor(Math.floor(item.id / 3) / 9) * 3 + Math.floor(item.id / 3) % 3) ===
              (Math.floor(Math.floor(this.selectedButton / 3) / 9) * 3 + Math.floor(this.selectedButton / 3) % 3)) {
            item.bgcolor = 'rgba(255, 255, 0, 0.25)'
          }
        })
        view.find(item => item.id === this.selectedButton).bgcolor = 'rgba(255, 0, 0, 0.25)'
      }
      return view
    }
  },
  methods: {
    ...mapActions({}),
    help() {
      let url = "https://www.sudokuwiki.org/sudoku.htm?bd="
      this.Field.forEach(element => {
        url += element.value
      });
      window.open(url)
    },
    SetValue(value) {
      this.sudokuDataClass.setFieldValue(this.selectedButton, value)
      this.selectedButton = -1
      this.easyChoise = false
      // console.log(this.sudokuDataClass.checkWin())
    },
    pageClick() {
      this.selectedButton = -1
      this.easyChoise = false
    },
    buttonClick(data) {
      this.easyChoise = false
      this.comfortChoiceData.left = data.left
      this.comfortChoiceData.top = data.top
      this.comfortChoiceData.possibly = this.Field[data.id].possibly
      this.comfortChoiceData.buttonId = data.id
      this.comfortChoiceData.value = this.Field[data.id].value
      if (!this.easyChoiseDbClick) {
        this.selectedButton = data.id
      }
      if (data.id === this.selectedButton && this.easyChoiseShow) {
        this.easyChoise = true
      } else {
        this.selectedButton = data.id
      }
    },
    keywordClick(e) {
      if (+e.key >= 0 && +e.key <= 9) {
        this.SetValue(+e.key)
      }
      if (e.key === 'Backspace') {
        this.SetValue(0)
      }
      if (e.key === 'ArrowLeft') {
        this.selectedButton -= 1
      }
      if (e.key === 'ArrowRight') {
        this.selectedButton += 1
      }
      if (e.key === 'ArrowDown') {
        this.selectedButton += 9
      }
      if (e.key === 'ArrowUp') {
        this.selectedButton -= 9
      }
    },
    goBack() {
      this.$router.push({name: 'SudokuHome'})
    },
    updateSize() {
      if (window.innerWidth < window.innerHeight*1.2) {
        this.rotate = true
        this.flexD = 'row'
        this.flexW = 'column'
      } else {
        this.sizeBtn = 9.5
        this.rotate = false
        this.flexD = 'column'
        this.flexW = 'row'
      }
    },
    setLocalField () {
      this.sudokuDataClass = new FieldActions.sudokuData()
      this.sudokuDataClass.setField(this.stringField(6))
      this.Field = this.sudokuDataClass.getField()
    },
    message(e) {
      console.log(e)
    }
  },
  created() {
    window.addEventListener('resize', this.updateSize);
  },
  mounted() {
    this.setLocalField()
    this.updateSize()
    document.addEventListener('keydown', this.keywordClick)

  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keywordClick);
    window.removeEventListener('resize', this.updateSize);
  }
}
</script>
<style>
.Field {
  display: flex;
  flex-direction: column;
}

.Field-line {
  display: flex;
  flex-direction: row;
}

.s-page {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

.choice {
  display: flex;
  flex-direction: row;
  margin-top: 2vmin;
}

.choice-button {
  width: 8vmin;
  height: 8vmin;
  user-select: none;
}

.menuitem {
  border-color: rgb(0, 0, 0);
  border-width: 1px;
  border-style: solid;
  width: 8vmin;
  height: 8vmin;
  overflow: hidden;
}

.menu {
  font-size: 3vmin;
  user-select: none;
  display: flex;
  flex-direction: column;
  margin-bottom: 2vmin;
  align-self: flex-start;
}

.green {
  background-color: green;
}
</style>