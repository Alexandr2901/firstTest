<template>
  <div class="Sudoku" v-if="Field">
    <transition name="translation">
      <div
          v-if="viewSettings.menuPanelShow"
          class="menuPanel mainColor">
        <div
            @click="menuPanelShow"
            class="menuPanelItem">
          {{ phrases.close }}
        </div>
        <div class="menuPanelItem "
             v-bind:class="{secondColor: viewSettings.prompt}"
             @click="promptClick">
          {{ phrases.prompt }}
        </div>
        <transition name="translation">
          <div
              v-if="viewSettings.prompt"
              v-bind:class="{secondColor: viewSettings.advancedPossibly[2]}"
              class="menuPanelItem" @click="sudokuDataClass.setAdvancedPossibly(2)">
            {{ phrases.onlyHere }}
          </div>
        </transition>
        <transition name="translation">
          <div
              v-if="viewSettings.prompt"
              v-bind:class="{secondColor: viewSettings.advancedPossibly[1]}"
              class="menuPanelItem" @click="sudokuDataClass.setAdvancedPossibly(1)">
            {{ phrases.onePossiblyDelete }}
          </div>
        </transition>
        <div
            v-bind:class="{secondColor: viewSettings.choiceShow}"
            class="menuPanelItem" @click="viewSettings.choiceShow = !viewSettings.choiceShow">
          {{ phrases.sidePanel }}
        </div>
        <div class="menuPanelItem"
             v-bind:class="{secondColor: viewSettings.easyChoiceShow}"
             @click="() => {viewSettings.easyChoiceShow = !viewSettings.easyChoiceShow;easyChoice=false}">
          {{ phrases.comfortChoice }}
        </div>
        <transition name="translation">
          <div class="menuPanelItem"
               v-if="viewSettings.easyChoiceShow"
               v-bind:class="{secondColor: viewSettings.easyChoiceDbClick}"
               @click="viewSettings.easyChoiceDbClick = !viewSettings.easyChoiceDbClick">

            {{ phrases.easyChoiceDbClick }}
          </div>
        </transition>
        <div
            @click="deleteDataSettings"
            class="menuPanelItem">
          {{ phrases.deleteDataSettings }}
        </div>
        <div class="menuPanelItem">
          <div>
            {{ phrases.difficulty }}:
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
    <div @click.self="pageClick()" class="s-page">
      <header>
        <div>
          <img
              @click="menuPanelShow"
              class="menuitem"
              src="https://img.icons8.com/material-outlined/24/000000/settings--v1.png"/>
        </div>
        <div class="menuBlock">
          <img
              @click="sudokuDataClass.undoLastValue()"
              class="menuitem"
              src="https://img.icons8.com/ios-glyphs/24/000000/undo.png"/>
          <transition name="translation">
            <img
                v-if="viewSettings.prompt"
                v-bind:class="{secondColor: viewSettings.removePossibly}"
                @click="viewSettings.removePossibly = !viewSettings.removePossibly"
                class="menuitem"
                src="https://img.icons8.com/material-outlined/24/000000/pencil--v1.png"/>
          </transition>
          <transition name="translation">
            <img
                v-if="viewSettings.prompt"
                v-bind:class="{secondColor: sudokuDataClass.getAutoSolve()}"
                class="menuitem"
                @click="sudokuDataClass.setAutoSolve()"
                src="https://img.icons8.com/ios/50/000000/circled-a.png"/>
          </transition>
        </div>
        <div>
          <img @click="nextSudoku" class="menuitem" src="https://img.icons8.com/ios/50/000000/arrow.png"/>
        </div>
      </header>
      <div class="Field-wrapper"
           @click.self="pageClick()"
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
          :redact="viewSettings.removePossibly"
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
      lang: 'ru',
      phrasesEn: {
        settings: 'settings',
        prompt: 'prompt',
        close: 'close',
        difficulty: 'difficulty',
        deleteDataSettings: 'reset progress',
        onlyHere: 'only here algorithm',
        onePossiblyDelete: 'one possibly delete algorithm',
        comfortChoice: 'comfort choice',
        easyChoiceDbClick: 'double click',
        sidePanel: 'side panel',
        sureConfirm: 'are you sure?'
      },
      phrasesRu: {
        settings: 'настройки',
        prompt: 'подсказки',
        close: 'закрыть',
        difficulty: 'сложность',
        deleteDataSettings: 'сбросить прогресс',
        onlyHere: 'первый алгоритм',
        onePossiblyDelete: 'второй алгоритм',
        comfortChoice: 'удобный выбор',
        easyChoiceDbClick: 'двойной клик',
        sidePanel: 'боковая панель',
        sureConfirm: 'вы уверены?'
      },
      viewSettings: {
        easyChoiceShow: true,
        easyChoiceDbClick: true,
        choiceShow: true,
        menuPanelShow: false,
        prompt: true,
        advancedPossibly: [1, 1, 0],
        removePossibly: false,
        autoSolve: false
      },
      savedData: {
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
    phrases() {
      if (this.lang === 'ru-RU') {
        return this.phrasesRu
      } else {
        return this.phrasesEn
      }
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
    promptClick() {
      this.easyChoice = 0
      this.viewSettings.prompt = !this.viewSettings.prompt
      this.sudokuDataClass.setAdvancedPossibles([1, 0, 0])
      if (this.viewSettings.autoSolve) {
        this.sudokuDataClass.setAutoSolve()
      }
    },
    menuPanelShow() {
      this.viewSettings.menuPanelShow = !this.viewSettings.menuPanelShow
      this.easyChoice = false
    },
    nextSudoku() {
      if (this.sudokuDataClass.checkWin()) {
        this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).solved
            .push(this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).id)
      }
      this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).id++
      this.setLocalField()
    },
    SetValue(value) {
      if (this.viewSettings.removePossibly) {
        this.sudokuDataClass.removeFieldPossibly(this.selectedButton, value)
      } else {
        this.sudokuDataClass.setFieldValue(this.selectedButton, value)
      }
      this.selectedButton = -1
      this.easyChoice = false
    },
    pageClick() {
      this.selectedButton = -1
      this.easyChoice = false
      this.viewSettings.menuPanelShow = false
    },
    buttonClick(data) {
      this.viewSettings.menuPanelShow = false
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
        if (data.id === this.selectedButton
            && this.viewSettings.easyChoiceShow
            && !this.Field[data.id].const
            && !(this.Field[data.id].possibly.size === 0 && this.Field[data.id].value === 0)) {
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
      this.sudokuDataClass = new FieldActions.sudokuData([...this.viewSettings.advancedPossibly],
          this.viewSettings.autoSolve)
      let ar = this.savedData.difficultyId.find(item => item.difficulty === this.savedData.difficulty)
      if (ar.maxId < ar.id) {
        ar.id = 0
      }

      if (ar.solved.length === ar.maxId) {
        ar.finished = true
        this.savedData.difficulty = this.savedData.difficultyId.find(item => !item.finished).difficulty
      } else {
        for (let i = 0; i <= ar.maxId; i++) {
          if (ar.solved.some(item => item === ar.id)) {
            ar.id = (ar.id + 1) % (ar.maxId + 1)
          }
        }
      }
      this.getField([this.savedData.difficultyId.find(item => item.difficulty === +this.savedData.difficulty).id,
        this.savedData.difficulty])
          .then((result) => {
            this.Field = this.sudokuDataClass.setField(result)
          }).catch(e => {
        console.log(e)
      })
    },
    setDifficulty(value) {

      if (this.savedData.difficulty !== value) {
        if (this.sudokuDataClass.getAdvancedPossibles()[2] && value === 0) {
          this.sudokuDataClass.setAdvancedPossibly(2)
        }
        this.savedData.difficulty = value
        this.setLocalField()
      }
    },
    message(e) {
      console.log(e)
    },
    deleteDataSettings() {
      if (confirm(this.phrases.sureConfirm)) {
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
    this.setLocalField()
    this.updateSize()
    document.addEventListener('keydown', this.keywordClick)
    this.lang = navigator.language || navigator.userLanguage
    this.viewSettings = {...JSON.parse(localStorage.getItem('viewSettings'))}
    this.savedData = {...JSON.parse(localStorage.getItem('savedData'))}
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keywordClick);
    window.removeEventListener('resize', this.updateSize);
  },
  updated() {
    setTimeout(() => {
      this.viewSettings.advancedPossibly = this.sudokuDataClass.getAdvancedPossibles()
      this.viewSettings.autoSolve = this.sudokuDataClass.getAutoSolve()
      localStorage.setItem('viewSettings', JSON.stringify(this.viewSettings))
      localStorage.setItem('savedData', JSON.stringify(this.savedData))
      if (this.viewSettings.autoSolve && this.sudokuDataClass.checkWin()) {
        setTimeout(() => {
          if (this.viewSettings.autoSolve && this.sudokuDataClass.checkWin()) {
            this.nextSudoku()
          }
        }, 2000)
      }
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
}

.Field {
  display: flex;
  flex-direction: column;
}

header {
  justify-self: flex-start;
  align-self: flex-start;
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
  z-index: 1;
}

.translation-enter-active, .translation-leave-active {
  transition: transform .5s;
  transform: translate(0) scale(1);
}

.translation-enter, .translation-leave-to {
  transform: translate(-66vw) scale(0);
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
  border: black 1px solid;
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
</style>
