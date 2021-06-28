<template>
  <div v-if="Field">
    <header class="mainColor">
      <div>
        <img
            @click="viewSettings.menuPanelShow = !viewSettings.menuPanelShow"
            class="menuitem"
            src="https://img.icons8.com/material-outlined/24/000000/settings--v1.png"/>
      </div>
      <div class="menuBlock">
        <img class="menuitem" @click="help()" src="https://img.icons8.com/material-outlined/24/000000/help.png"/>
        <img
            @click="sudokuDataClass.undoLastValue()"
            class="menuitem"
            src="https://img.icons8.com/ios-glyphs/24/000000/undo.png"/>
      </div>
      <div>
        <img @click="nextSudoku" class="menuitem" src="https://img.icons8.com/ios/50/000000/arrow.png"/>
      </div>
    </header>
    <div class="s-page" @click.self="pageClick()">
      <div
          v-if="viewSettings.menuPanelShow"
          class="menuPanel mainColor">
        <div>
          <div
              @click="viewSettings.menuPanelShow = !viewSettings.menuPanelShow"
              class="menuPanelItem">
            settings
          </div>
          <div class="menuPanelItem"
               v-bind:class="{secondColor: viewSettings.prompt}"
               @click="() =>{this.easyChoice = 0
                 viewSettings.prompt = !viewSettings.prompt}">
            prompt
          </div>
          <div
              v-if="viewSettings.prompt"
              v-bind:class="{secondColor: sudokuDataClass.getAdvancedPossibles()[1]}"
              class="menuPanelItem" @click="sudokuDataClass.setAdvancedPossibly(1)">
            first algorithm
          </div>
          <div
              v-if="viewSettings.prompt && savedData.difficulty"
              v-bind:class="{secondColor: sudokuDataClass.getAdvancedPossibles()[2]}"
              class="menuPanelItem" @click="sudokuDataClass.setAdvancedPossibly(2)">
            second algorithm
          </div>
          <div
              v-bind:class="{secondColor: viewSettings.choiceShow}"
              class="menuPanelItem" @click="viewSettings.choiceShow = !viewSettings.choiceShow">
            choiceShow
          </div>
          <div class="menuPanelItem"
               v-bind:class="{secondColor: viewSettings.easyChoiceShow}"
               @click="() => {viewSettings.easyChoiceShow = !viewSettings.easyChoiceShow;easyChoice=false}">
            easyChoice
          </div>
          <div
              @click="deleteViewSettings"
              class="menuPanelItem">
            deleteViewSettings
          </div>
          <div
              @click="deleteDataSettings"
              class="menuPanelItem">
            deleteDataSettings
          </div>
          <input
              v-model.number="tempChoiceDifficulty"
              @change="setDifficulty"
              id="difficulty"
              min="0" max="10"
              type="range">
          <label for="difficulty">
            difficulty:
            {{ tempChoiceDifficulty }}
          </label>
          <div>
            <a style="padding: 10px" href="https://icons8.ru">икнонки взяты с сайта</a>
          </div>
        </div>
      </div>

      <div class="Field-wrapper"
           v-bind:style="{flexDirection: flexW}"
      >
        <div v-if="!rotate && viewSettings.choiceShow" v-bind:style="{flexDirection: flexD}" class="choice">
          <button class="choice-button mainColor" @click="SetValue(0)">
            X
          </button>
          <button
              v-for="item in 9"
              :key="item"
              v-bind:class="{secondColor: item>-1 ? possiblyChoice.has(item) : true}"
              class="choice-button mainColor"
              @click="SetValue(item)">
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
                          v-bind:dataView="fieldView[(line-1)*9+item-1]"
                          v-bind:possibly-show="viewSettings.prompt"
                          v-bind:wrong-ids="sudokuDataClass.getWrongIds()"
                          v-on:select-button="buttonClick($event)"/>
          </div>
        </div>
        <div v-if="viewSettings.choiceShow" v-bind:style="{flexDirection: flexD}" class="choice">
          <button class="choice-button mainColor" @click="SetValue(0)">
            X
          </button>
          <button
              v-for="item in 9"
              :key="item"
              v-bind:class="{secondColor: item>-1 ? possiblyChoice.has(item) : false}"
              class="choice-button mainColor"
              @click="SetValue(item)">
            {{ item }}
          </button>
        </div>
      </div>
      <comfort-choice
          v-on:send-value="SetValue($event)"
          v-if="easyChoice"
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
      easyChoice: false,
      sizeBtn: 11,
      rotate: false,
      flexD: 'column',
      flexW: 'wrap',
      selectedButton: -1,
      sudokuDataClass: null,
      Field: null,
      comfortChoiceData: {},
      tempChoiceDifficulty: 1,
      viewSettings: JSON.parse(localStorage.getItem('viewSettings')) || {
        easyChoiceShow: true,
        easyChoiceDbClick: true,
        choiceShow: true,
        menuPanelShow: false,
        prompt: true,
        advancedPossibly: [1, 0, 0]
      },
      savedData: JSON.parse(localStorage.getItem('savedData')) || {
        sudokuId: 1,
        difficulty: 1,
        difficultyId: null
      }
    }
  },
  computed: {
    ...mapGetters({
      stringField: 'dataManage/field',
      getDataOptions: 'dataManage/getDataOptions'
    }),
    advancedPossibly() {
      return this.sudokuDataClass.getAdvancedPossibles()
    },
    possiblyChoice() {
      return (this.selectedButton !== -1 && this.viewSettings.prompt) ? this.Field.find(item => item.id === this.selectedButton).possibly : new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
    },
    fieldView() {
      let view = []
      for (let i = 0; i < 81; i++) {
        view.push({
          id: i,
          bgcolor: ''
        })
      }
      if (this.selectedButton > -1 && this.selectedButton < 81) {
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
    ...mapActions({
      getField: 'dataManage/getField'
    }),
    help() {
      let url = "https://www.sudokuwiki.org/sudoku.htm?bd="
      this.Field.forEach(element => {
        url += element.value
      });
      window.open(url)
    },
    nextSudoku() {
      if (this.sudokuDataClass.checkWin()) {
        this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).solved
            .push(this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).id)
      }
      this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).id++
      // console.log(this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).id)
      // console.log(this.sudokuDataClass.checkWin())
      // this.savedData.sudokuId++
      // console.log(this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty))
      this.setLocalField(this.savedData.sudokuId)
    },
    SetValue(value) {
      // if(this.Field[this.selectedButton].possibly.has(value)) {
      this.sudokuDataClass.setFieldValue(this.selectedButton, value)
      this.selectedButton = -1
      this.easyChoice = false
      // }
      // console.log(this.sudokuDataClass.checkWin())
    },
    pageClick() {
      this.selectedButton = -1
      this.easyChoice = false
      this.viewSettings.menuPanelShow = false
    },
    buttonClick(data) {
      this.easyChoice = false
      this.comfortChoiceData.left = data.left
      this.comfortChoiceData.top = data.top
      this.comfortChoiceData.possibly = this.possiblyChoice
      this.comfortChoiceData.buttonId = data.id
      this.comfortChoiceData.value = this.Field[data.id].value
      if (!this.viewSettings.easyChoiceDbClick) {
        this.selectedButton = data.id
      }
      if (data.id === this.selectedButton && this.viewSettings.easyChoiceShow && !this.Field[data.id].const) {
        this.easyChoice = true
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
      if (window.innerWidth < window.innerHeight * 1.1) {
        this.sizeBtn = 11
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
    setLocalField() {
      // localStorage.clear()
      this.sudokuDataClass = new FieldActions.sudokuData()
      let ar = this.savedData.difficultyId.find(item => item.difficulty === this.savedData.difficulty)
      if (ar.maxId < ar.id){
        ar.id = 0
      }
      if (ar.solved.length === ar.maxId) {
        // alert('alarm')
        ar.finished = true
        // console.log(this.savedData.difficultyId.find(item => !item.finished))
        this.savedData.difficulty = this.savedData.difficultyId.find(item => !item.finished).difficulty
        this.tempChoiceDifficulty = this.savedData.difficulty
        // console.log(this.savedData.difficulty)
      } else {
        for (let i=0;i<=ar.maxId;i++) {
          if (ar.solved.some(item => item === ar.id)) {
            // console.log(ar.id)
            ar.id =(ar.id+1)%(ar.maxId+1)
          }
        }
      }
      // console.log(ar.maxId, ar.id, ar.solved.length)
      // console.log([...ar.solved])
      // console.log(ar.id)
      this.getField([this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).id,
        this.savedData.difficulty])
          .then((result) => {
            this.sudokuDataClass.setField(result)
            this.Field = this.sudokuDataClass.getField()
            this.sudokuDataClass.setAdvancedPossibles(this.viewSettings.advancedPossibly)
          }).catch(e => {
        console.log(e)
      })

    },
    setDifficulty(message) {
      if (!this.savedData.difficultyId.some(item => item.difficulty === +message.target.value)) {
        this.savedData.difficultyId.push({
          id: 0,
          difficulty: +message.target.value
        })
      }
      if (confirm('are you sure')) {
        if (this.sudokuDataClass.getAdvancedPossibles()[2]) {
          this.sudokuDataClass.setAdvancedPossibly(2)
        }
        this.savedData.difficulty = this.tempChoiceDifficulty
        this.setLocalField()
      } else {
        this.tempChoiceDifficulty = this.savedData.difficulty
      }
    },
    message(e) {
      console.log(e)
    },
    deleteViewSettings() {
      if (confirm('are you sure')) {
        localStorage.removeItem('viewSettings')
        window.location.reload()
      }

    },
    deleteDataSettings() {
      if (confirm('are you sure')) {
        localStorage.removeItem('savedData')
        window.location.reload()
      }
    },
    startSettings() {
      this.tempChoiceDifficulty = this.savedData.difficulty
      if (!this.savedData.difficultyId) {
        this.savedData.difficultyId = []
        this.getDataOptions.forEach((item, index) => {
          this.savedData.difficultyId.push({
            id: 0,
            difficulty: index,
            maxId: item,
            solved: [],
            finished:false
          })
        })
        // console.log(this.savedData.difficultyId)
      }
    }
  },
  created() {
    this.startSettings()
    window.addEventListener('resize', this.updateSize);
  },
  mounted() {
    // localStorage.clear()
    this.setLocalField()
    this.updateSize()
    document.addEventListener('keydown', this.keywordClick)

    // console.log(this.tempChoiceDifficulty )
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keywordClick);
    window.removeEventListener('resize', this.updateSize);
  },
  updated() {
    setTimeout(() => {
      localStorage.setItem('viewSettings', JSON.stringify(this.viewSettings))
      localStorage.setItem('savedData', JSON.stringify(this.savedData))
      // localStorage.setItem('field', JSON.stringify(this.Field))
      // .map(item=> item.value).toString()
      // console.log(localStorage.getItem('field'))

    }, 0)
  }
}
</script>
<style>
.Field {
  display: flex;
  flex-direction: column;
}

header {
  justify-self: flex-start;
  top: 0;
  /*background-color: #c1c1c1;*/
  max-width: 100vw;
  max-height: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1vh;
  /*border: black solid;*/
  /*border-width:  0 0 3px 0;*/
  /*padding: 1px;*/
  /*box-sizing: border-box;*/
  overflow: hidden;
}

.menuitem {
  height: 5vh;
  width: 5vh;
  /*border-color: rgb(0, 0, 0);*/
  /*border-width: 1px;*/
  /*border-right-width: 3px;*/
  /*border-style: solid;*/
  /*min-width: 8vmin;*/
  /*min-height: 8vmin;*/
  overflow: hidden;
  box-sizing: border-box;
  /*background-color: white;*/
  padding: 5px;
  user-select: none;
}

.menuitem:hover {
  transform: scale(1.3);
  background-color: green;
  border-radius: 500px;
}

.menuitem img {
  height: auto;
}

.menuPanel {
  word-wrap: normal;
  position: absolute;
  padding: 0 15px 15px 0;
  overflow: hidden;
  box-sizing: border-box;
  left: 0;
  top: 0;
  animation-name: Appearance;
  animation-duration: 0.3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  user-select: none;
  /*background-color: white;*/
}

.menuPanelItem {
  min-height: 3vh;
  border: black 2px solid;
  /*background-color: white;*/
  padding: 5px;
  margin: 3px;
}

@keyframes Appearance {
  0% {
    width: 0;
  }
  100% {
    width: 300px;
  }
  /*0% {width: 0;}*/
  /*100% {width: 250px;}*/
}

.Field-line {
  display: flex;
  flex-direction: row;
}

.Field-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.s-page {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  min-height: 93vh;

}

.choice {
  display: flex;
  flex-direction: row;
  margin-top: 2vmin;
  padding: 2vmin;
}

.choice-button {
  width: 8vmin;
  height: 8vmin;
  user-select: none;
}


.menuBlock {
  display: flex;
  flex-direction: row;
}

.menu {
  justify-self: flex-start;
  font-size: 3vmin;
  user-select: none;
  display: flex;
  flex-direction: column;
  margin-bottom: 2vmin;
  align-self: flex-start;
}

.green {
  background-color: #14e214;
}

</style>
