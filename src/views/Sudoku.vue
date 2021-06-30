<template>
  <div @click.self="pageClick()" class="Sudoku" v-if="Field">
    <transition name="translation">
      <div
          v-if="viewSettings.menuPanelShow"
          class="menuPanel mainColor">
        <div
            @click="menuPanelShow"
            class="menuPanelItem">
          close
        </div>
        <div class="menuPanelItem "
             v-bind:class="{secondColor: viewSettings.prompt}"
             @click="() =>{this.easyChoice = 0
                 viewSettings.prompt = !viewSettings.prompt}">
          prompt
        </div>
        <transition name="translation">
        <div
            v-if="viewSettings.prompt"
            v-bind:class="{secondColor: sudokuDataClass.getAdvancedPossibles()[1]}"
            class="menuPanelItem" @click="sudokuDataClass.setAdvancedPossibly(1)">
          first algorithm
        </div>
        </transition>
        <transition name="translation">
        <div
            v-if="viewSettings.prompt"
            v-bind:class="{secondColor: sudokuDataClass.getAdvancedPossibles()[2]}"
            class="menuPanelItem" @click="sudokuDataClass.setAdvancedPossibly(2)">
          second algorithm
        </div>
        </transition>
          <transition name="translation">
        <div
            v-if="viewSettings.prompt"
            class="menuPanelItem"
            @click="startAutoSolve"
        >
          startAutoSolve
        </div>
          </transition>
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
        <transition name="translation">
        <div class="menuPanelItem"
             v-if="viewSettings.easyChoiceShow"
             v-bind:class="{secondColor: viewSettings.easyChoiceDbClick}"
             @click="viewSettings.easyChoiceDbClick = !viewSettings.easyChoiceDbClick">
          easyChoiceDbClick
        </div>
        </transition>
        <!--        <div-->
        <!--            @click="deleteViewSettings"-->
        <!--            class="menuPanelItem">-->
        <!--          deleteViewSettings-->
        <!--        </div>-->
        <div
            @click="deleteDataSettings"
            class="menuPanelItem">
          deleteDataSettings
        </div>
        <div class="menuPanelItem">
          <div>
            difficulty
          </div>
          <div class="difficultyChoice">
            <div @click="setDifficulty(item)"
                 v-for="item in savedData.difficultyId.filter(item => !item.finished).map(item => {return item.difficulty})"
                 v-bind:class="{secondColor: item === savedData.difficulty}"
                 :key="item">
              {{ item }}
            </div>
          </div>
        </div>

        <!--        <div>-->
        <!--          <a style="padding: 10px" href="https://icons8.ru">икнонки взяты с сайта</a>-->
        <!--        </div>-->
      </div>
    </transition>
    <!--    v-bind:class="{translation: viewSettings.menuPanelShow && rotate}"-->
    <div class="s-page">
      <header>
        <div>
          <img
              @click="menuPanelShow"
              class="menuitem"
              src="https://img.icons8.com/material-outlined/24/000000/settings--v1.png"/>
        </div>
        <div class="menuBlock">
          <!--        <img class="menuitem" @click="help()" src="https://img.icons8.com/material-outlined/24/000000/help.png"/>-->
          <img
              @click="sudokuDataClass.undoLastValue()"
              class="menuitem"
              src="https://img.icons8.com/ios-glyphs/24/000000/undo.png"/>
        </div>
        <div>
          <img @click="nextSudoku" class="menuitem" src="https://img.icons8.com/ios/50/000000/arrow.png"/>
        </div>
      </header>
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
        <div
            v-bind:class="{opacity:easyChoice}"
            class="Field">
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
      phrasesEn: {
        settings: 'settings',
        prompt: 'prompt'
      },
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
            item.bgcolor = '#FDE0B0'
          }
        })
        view.find(item => item.id === this.selectedButton).bgcolor = '#E2E3FB'
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
    menuPanelShow() {
      this.viewSettings.menuPanelShow = !this.viewSettings.menuPanelShow
      this.easyChoice = false
    },
    startAutoSolve() {
      setTimeout(()=>{
        this.sudokuDataClass.autoSolveOne()
      },501)
      this.menuPanelShow()
        // if (this.sudokuDataClass.getAdvancedPossibles()[2]) {
        //   this.sudokuDataClass.setAdvancedPossibly(2)
        // }
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
      setTimeout(() => {
        if (!this.viewSettings.easyChoiceDbClick) {
          this.selectedButton = data.id
        }
        this.comfortChoiceData.left = data.left
        this.comfortChoiceData.top = data.top
        this.comfortChoiceData.possibly = this.possiblyChoice
        this.comfortChoiceData.buttonId = data.id
        this.comfortChoiceData.value = this.Field[data.id].value
        if (data.id === this.selectedButton && this.viewSettings.easyChoiceShow && !this.Field[data.id].const) {
          this.easyChoice = true
        } else {
          this.selectedButton = data.id
        }
      }, 0)
    },
    keywordClick(e) {
      if (+e.key >= 0 && +e.key <= 9) {
        this.SetValue(+e.key)
      }
      if (e.key === 'Backspace') {
        this.SetValue(0)
      }
      if (e.key === "Escape") {
        this.pageClick()
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
      // console.log(this.savedData.difficulty)
      let ar = this.savedData.difficultyId.find(item => item.difficulty === this.savedData.difficulty)

      // console.log(ar)
      if (ar.maxId < ar.id) {
        ar.id = 0
      }

      if (ar.solved.length === ar.maxId) {
        // alert('alarm')
        ar.finished = true
        // console.log(this.savedData.difficultyId.find(item => !item.finished))
        this.savedData.difficulty = this.savedData.difficultyId.find(item => !item.finished).difficulty
        // console.log(this.savedData.difficulty)
      } else {
        for (let i = 0; i <= ar.maxId; i++) {
          if (ar.solved.some(item => item === ar.id)) {
            // console.log(ar.id)
            ar.id = (ar.id + 1) % (ar.maxId + 1)
          }
        }
      }
      // console.log(ar.maxId, ar.id, ar.solved.length)
      // console.log([...ar.solved])
      // console.log(ar.id)
      this.getField([this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).id,
        this.savedData.difficulty])
          .then((result) => {
            // console.log(result)
            this.sudokuDataClass.setField(result)
            this.Field = this.sudokuDataClass.getField()
            this.sudokuDataClass.setAdvancedPossibles(this.viewSettings.advancedPossibly)
              if (this.sudokuDataClass.getAdvancedPossibles()[2]) {
                this.sudokuDataClass.setAdvancedPossibly(2)
              }
          }).catch(e => {
        console.log(e)
      })

    },
    setDifficulty(value) {

      if (this.savedData.difficulty !== value) {
        // if (confirm('are you sure')) {
          if (this.sudokuDataClass.getAdvancedPossibles()[2] && value === 0) {
            this.sudokuDataClass.setAdvancedPossibly(2)
          }
        this.savedData.difficulty = value
        this.setLocalField()
        // }
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
      if (!this.savedData.difficultyId) {
        this.savedData.difficultyId = []
        this.getDataOptions.forEach((item, index) => {
          this.savedData.difficultyId.push({
            id: 0,
            difficulty: index,
            maxId: item,
            solved: [],
            finished: false
          })
        })
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
.Sudoku {
  display: flex;
  flex-direction: row;
  margin: 0;
  height: 100vh;
  overflow: hidden;
  background-color: #F3F1E9;
  /*background-color: white;*/
}

.Field {
  display: flex;
  flex-direction: column;
}

header {
  justify-self: flex-start;
  align-self: flex-start;
  top: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: 100vw;
  width: 105vmin;
  height: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1vh;
  overflow: hidden;
}

.menuitem {
  border-radius: 500px;
  height: 5vh;
  width: 5vh;
  overflow: hidden;
  box-sizing: border-box;
  padding: 5px;
  user-select: none;
}

.menuPanel {
  word-wrap: normal;
  position: absolute;
  padding: 10px 15px 10px 5px;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 0 50px 50px 0;
  margin-top: 6vh;
  user-select: none;
  /*background-color: rgb(43, 156, 184);*/
}

.translation-enter-active, .translation-leave-active {
  transition: transform .5s;
  transform: translate(0)scale(1);
}

.translation-enter, .translation-leave-to {
  transform: translate(-66vw)scale(0);
}


.menuPanelItem {
  box-sizing: border-box;
  font-size: 3vmin;
  min-height: 3vh;
  border-radius: 10px;
  border-color: black;
  border-style: solid;
  border-width: 1px 1px 1px 5px;
  text-align: left;
  padding: 5px;
  margin: 3px;
  /*left: 0;*/
}

.difficultyChoice {
  display: flex;
  flex-direction: row;
}

.difficultyChoice div {
  text-align: center;
  margin-left: 5px;
  min-width: 3vh;
  border-radius: 3px;
  /*background-color: #39f55e;*/
  border: black 1px solid;
  /*border-color: white;*/
  /*border-style: solid;*/
}

.Field-line {
  display: flex;
  flex-direction: row;
}

.Field-wrapper {
  margin: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.s-page {
  margin: auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;

  /*min-height: 93vh;*/
  background-color: #F3F1E9;

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

.opacity {
  opacity: 0.5;
}

</style>
