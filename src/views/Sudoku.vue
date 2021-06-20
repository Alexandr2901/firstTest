<template>
  <div>
    <div class="s-page" v-bind:style="{flexDirection: flexW}" @click.self="pageClick()" v-if="Field">
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
        <div class="menuitem" @click="undoLastValue()">
          undo
        </div>
        <div v-if="!resolutiontrue" class="menuitem" @click="resolution">
          auto
        </div>
        <div v-else class="menuitem green" @click="resolution">
          auto
        </div>
        <div v-bind:class="{ green: savedData.advanchedPossibly[1] }" class="menuitem" @click="onePossiblythere()">
          only Here
        </div>
        <div v-bind:class="{ green: savedData.advanchedPossibly[2] }" class=" menuitem" @click="onlyHerethere()">
          one Possibly
        </div>

        <div class="menuitem" @click="goBack()">
          back
        </div>
        <div class="menuitem" @click="help()">
          help
        </div>
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
      <div class="choice" v-bind:style="{flexDirection: flexD}">
        <button class="choice-button" @click="SetValue(0)">
          X
        </button>
        <button v-for="item in possiblyChoise" :key="item" class="choice-button" @click="SetValue(item)">
          {{ item }}
        </button>
      </div>
      <comfort-choice
          v-on:send-value="SetValue($event)"
          v-if="easyChoise"
          :size-btn="sizeBtn"
          :distance="comfortChoiceData"
          :possibly="this.comfortChoiceData.possibly"
          :button-id="comfortChoiceData.buttonId"
      />
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import SudokuButton from '../components/SudokuButton'
import methods from '../store/sudoku/sudoku'
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
      possiblyesColor: {
        onePossibly: false,
        onlyHere: false
      },
      easyChoiseClass: {
        left: '0',
        top: '0',
        maxWidth: '0',
        maxHeight: '0',
        fontSize: '0',
      },
      comfortChoiceData: {
        left: 0,
        top: 0,
        buttonId: -1,
        possibly: []
      }
    }
  },
  computed: {
    ...mapGetters({
      savedData: 'sudoku/savedData',
      Field: 'sudoku/field',
      resolutiontrue: 'sudoku/autoresolution',
      fieldview: 'sudoku/front/fieldview',
      selectedButton: 'sudoku/front/selectedbutton'
    }),
    possiblyChoise() {
      return this.selectedButton !== -1 ? this.Field.find(item => item.id === this.selectedButton).possibly :
          9
    },
  },
  methods: {
    ...mapActions({
      newField: 'sudoku/newField',
      initializationString: 'sudoku/initializationString',
      initialization: 'sudoku/initialization',
      undoLastValue: 'sudoku/undoLastValue',
      autoResolution: 'sudoku/autoResolution',
      setTargetValue: 'sudoku/front/setTargetValue',
      onePossibly: 'sudoku/onlePossiblySwitch',
      onlyHere: 'sudoku/onlyHereSwitch',
      selectButton: 'sudoku/front/selectButton',
      appInit: 'sudoku/appInit',
      savePersonalData: 'sudoku/savePersonalData',
    }),
    newField() {
      let x = new methods.sudokuSolve
      let stringField
      while (!stringField) {
        stringField = x.newField()
      }
      this.initializationString(stringField)
    },
    help() {
      let url = "https://www.sudokuwiki.org/sudoku.htm?bd="
      this.Field.forEach(element => {
        url += element.value
      });
      window.open(url)
    },
    onePossiblythere() {
      this.onePossibly()
      this.savePersonalData()
    },
    onlyHerethere() {
      this.onlyHere()
      this.savePersonalData()
    },
    resolution() {
      this.autoResolution()
    },
    SetValue(value) {
      this.setTargetValue(value)
      this.selectButton(-1)
      this.easyChoise = false
    },
    pageClick() {
      this.selectButton(-1)
      this.easyChoise = false
    },
    buttonClick(data) {
      this.easyChoise = false
        this.comfortChoiceData.left = data.left
        this.comfortChoiceData.top = data.top
        this.comfortChoiceData.possibly = this.Field[data.id].possibly
        this.comfortChoiceData.buttonId = data.id
        if (!this.easyChoiseDbClick) {
          this.selectButton(data.id)
        }
        if (data.id === this.selectedButton && this.easyChoiseShow) {
          this.easyChoise = true
        } else {
          this.selectButton(data.id)
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
        this.selectButton(this.selectedButton - 1)
      }
      if (e.key === 'ArrowRight') {
        this.selectButton(this.selectedButton + 1)
      }
      if (e.key === 'ArrowDown') {
        this.selectButton(this.selectedButton + 9)
      }
      if (e.key === 'ArrowUp') {
        this.selectButton(this.selectedButton - 9)
      }
    },
    goBack() {
      this.$router.push({name: 'SudokuHome'})
    },
    updateSize() {
      if (window.innerWidth < window.innerHeight) {
        this.rotate = true
        this.flexD = 'row'
        this.flexW = 'column'
      } else {
        this.sizeBtn = 10
        this.rotate = false
        this.flexD = 'column'
        this.flexW = 'row'
      }
    },
    solutions() {
      let x = new methods.sudokuSolve
      let str = ''
      this.Field.forEach(element => {
        str += element.value
      });
      console.log(x.sudokuSolution(str))
      this.message('solutions=' + x.sudokuSolution(str).size)

    },
    message(e) {
      console.log(e)
    }
  },
  created() {
    window.addEventListener('resize', this.updateSize);
  },
  mounted() {

    this.appInit()
    this.updateSize()
    document.addEventListener('keydown', this.keywordClick)
    if (!this.Field) {
      this.initialization(5)
    }
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
  justify-content: space-around;
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
}

.menu {
  font-size: 3vmin;
  user-select: none;
  display: flex;
  flex-direction: column;
  margin-bottom: 2vmin;
}

.green {
  background-color: green;
}
</style>