<template>
  <div>
    <div class="s-page" @click.self="pageClick()" v-if="Field">
      <header>
        <div>
          <div
              class="menuitem">
            <!--            тут будут настройки-->
            настройки
          </div>
        </div>
        <div class="menuBlock">
          <div class="menuitem"
               v-bind:class="{green: possiblyShow}"
               @click="possiblyShow = !possiblyShow">
            0
          </div>
          <div
              v-bind:class="{green: sudokuDataClass.getAdvancedPossibles()[1]}"
              class="menuitem" @click="sudokuDataClass.setAdvancedPossibly(1)">
            1
          </div>
          <div
              v-bind:class="{green: sudokuDataClass.getAdvancedPossibles()[2]}"
              class="menuitem" @click="sudokuDataClass.setAdvancedPossibly(2)">
            2
          </div>
          <div
              v-bind:class="{green: choiceshowe}"
              class="menuitem" @click="choiceshowe = !choiceshowe">
            choiceshowe
          </div>
          <div class="menuitem"
               v-bind:class="{green: easyChoiceShow}"
               @click="() => {easyChoiceShow = !easyChoiceShow;easyChoice=false}">
            easyChoice
          </div>
          <div class="menuitem" @click="help()">
            help
          </div>
          <div class="menuitem" @click="sudokuDataClass.undoLastValue()">
            undo
          </div>
        </div>
        <div>
          <div class="menuitem">
            <img
                @click="nextSudoku"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAjElEQVRIie3VPQ4BURiF4ScSetbANtiNtWitg42MXUw1vUYjrsYoZEhG7qk4ySm/++b7ybn8FdAmDbhhj1kKUB4+YZUEFJyxTQJ6H7FIAgparIcKug9FY33FDtMUoHeDZRLwPIDJmznXUMEl1UFsRINL/qb1UWdaA3DAvMbjr4BoVMTCLh7X8Q/nx3QHemGZLZvPo5wAAAAASUVORK5CYII="/>
          </div>
        </div>
      </header>
      <!--      <div v-if="!menushow" class="menu">-->
      <!--        <div class="menuitem" @click="menushow = !menushow">-->
      <!--          show menu-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div v-else v-bind:style="{flexDirection: flexD}" class="menu">-->
      <!--        <div class="menuitem" @click="menushow = !menushow">-->
      <!--          close menu-->
      <!--        </div>-->
      <!--        <div class="menuitem" @click="solutions()">-->
      <!--          solutions-->
      <!--        </div>-->
      <!--        <div class="menuitem" @click="goBack()">-->
      <!--          back-->
      <!--        </div>-->
      <!--        <div class="menuitem" @click="help()">-->
      <!--          help-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="Field-wrapper"
           v-bind:style="{flexDirection: flexW}"
      >

        <div class="Field">
          <div class="Field-line" v-for="line in 9" :key="line">
            <SudokuButton v-for="item in 9"
                          :key="item"
                          v-bind:button-id="(line-1)*9+item - 1"
                          v-bind:size-btn="sizeBtn+'vmin'"
                          v-bind:local-data="Field[(line-1)*9+item-1]"
                          v-bind:dataView="fieldview[(line-1)*9+item-1]"
                          v-bind:possibly-show="possiblyShow"
                          v-bind:wrong-ids="sudokuDataClass.getWrongIds()"
                          v-on:select-button="buttonClick($event)"/>
          </div>
        </div>
        <div v-if="choiceshowe" v-bind:style="{flexDirection: flexD}" class="choice">
          <button class="choice-button" @click="SetValue(0)">
            X
          </button>
          <button
              v-for="item in 9"
              :key="item"
              v-bind:style="{backgroundColor: possiblyChoiceButtonStyle}"
              class="choice-button"
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
      easyChoiceShow: true,
      easyChoiceDbClick: true,
      sizeBtn: 11,
      rotate: false,
      flexD: 'column',
      flexW: 'wrap',
      menushow: true,
      choiceshowe: true,
      selectedButton: -1,
      sudokuDataClass: null,
      Field: null,
      comfortChoiceData: {},
      possiblyShow:true,
      sudokuId: 1
    }
  },
  computed: {
    ...mapGetters({
      stringField: 'dataManage/field'
    }),
    advancedPossibly() {
      return this.sudokuDataClass.getAdvancedPossibles()
    },
    possiblyChoice() {
      return this.selectedButton !== -1 ? this.Field.find(item => item.id === this.selectedButton).possibly : 9
    },
    possiblyChoiceButtonStyle(number) {
      let style = {}
      if (this.selectedButton !== -1) {
        style = this.Field.find(item => item.id === this.selectedButton).possibly.has(number) ? 'green' : 'gray'
      }
      return style
    },
    fieldview() {
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
    nextSudoku() {
      this.sudokuId++
      this.setLocalField(this.sudokuId)
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
    },
    buttonClick(data) {
        this.easyChoice = false
        this.comfortChoiceData.left = data.left
        this.comfortChoiceData.top = data.top
        this.comfortChoiceData.possibly = this.Field[data.id].possibly
        this.comfortChoiceData.buttonId = data.id
        this.comfortChoiceData.value = this.Field[data.id].value
        if (!this.easyChoiceDbClick) {
          this.selectedButton = data.id
        }
        if (data.id === this.selectedButton && this.easyChoiceShow && !this.Field[data.id].const) {
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
    setLocalField(id = this.sudokuId) {
      this.sudokuDataClass = new FieldActions.sudokuData()
      this.sudokuDataClass.setField(this.stringField(id))
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
    // setTimeout(()=> {
    //   console.log(this.sudokuDataClass.getAdvancedPossibles())
    // },1000)

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

header {
  background-color: #9ae35a;
  width: 100%;
  height: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1vh;
  padding: 1px;
  box-sizing: border-box;
  overflow: hidden;
}

.Field-line {
  display: flex;
  flex-direction: row;
}

.Field-wrapper {
  display: flex;
  flex-direction: row;
}

.s-page {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
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

.menuitem {
  min-width: 5vh;
  border-color: rgb(0, 0, 0);
  /*border-width: 1px;*/
  /*border-right-width: 3px;*/
  border-style: solid;
  /*min-width: 8vmin;*/
  /*min-height: 8vmin;*/
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  background-color: white;
  padding: 5px;
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
  background-color: green;
}
</style>

//