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
                <div class="menuitem" @click="undoLastValue()">
                    undo
                </div>
                <div v-if="!resolutiontrue" class="menuitem" @click="resolution">
                    auto
                </div>
                <div v-else class="menuitem green" @click="resolution">
                    auto
                </div>
                <div v-if="possiblyesColor.onePossibly" class="green menuitem" @click="onePossiblythere()">
                    one Possibly
                </div>
                <div v-else class="menuitem" @click="onePossiblythere()">
                    one Possibly
                </div>
                <div v-if="possiblyesColor.onlyHere" class="green menuitem" @click="onlyHerethere()">
                    only Here
                </div>
                <div v-else class="menuitem" @click="onlyHerethere()">
                    only Here
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
                    <SudokuButton v-for="item in 9" :key="item" v-bind:button-id="(line-1)*9+item - 1"
                        v-bind:size-btn="sizeBtn+'vmin'" v-bind:local-data="Field[(line-1)*9+item-1]"
                        v-bind:dataView="fieldview[(line-1)*9+item-1]" v-on:select-button="buttonClick($event)" />
                </div>
            </div>
            <!-- v-bind:class="{rotatel: rotate}" -->
            <div class="choice" v-bind:style="{flexDirection: flexD}">
                <button class="choice-button" @click="SetValue(0)">
                    X
                </button>
                <!-- {{Field.find(item => item.id === selectedButton).possibly}} -->
                <button v-for="item in possiblyChoise" :key="item" class="choice-button" @click="SetValue(item)">
                    {{item}}
                </button>
            </div>
            <div
            @click.self="pageClick()"
            class="easyChoise" v-bind:style="easyChoiseClass" v-if="easyChoise && possiblyChoise.size">
                <div @click="SetValue(item)" class="easyChoiseitem" v-for="item in possiblyChoise" :key="item">
                    {{item}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import SudokuButton from '../components/SudokuButton'
    export default {
        name: 'Sudoku',
        components: {
            SudokuButton
        },
        data() {
            return {
                easyChoise: true,
                easyChoiseShow: true,
                sizeBtn: 10,
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
                }
            }
        },
        computed: {
            ...mapGetters({
                Field: 'sudoku/field',
                resolutiontrue: 'sudoku/autoresolution',
                //testa: 'sudoku/testa'
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
                getData: 'dataManage/getDataMain',
                //testmethod: 'testMod/test',
                testsudoku: 'sudoku/initialization',
                undoLastValue: 'sudoku/undoLastValue',
                autoResolution: 'sudoku/autoResolution',
                setTargetValue: 'sudoku/front/setTargetValue',
                onePossibly: 'sudoku/onlePossiblySwitch',
                onlyHere: 'sudoku/onlyHereSwitch',
                selectButton: 'sudoku/front/selectButton',
            }),
            help() {
                let url = "https://www.sudokuwiki.org/sudoku.htm?bd="
                this.Field.forEach(element => {
                    url += element.value
                });
                window.open(url)
                
            },
            onePossiblythere() {
                this.onePossibly()
                this.possiblyesColor.onePossibly = !this.possiblyesColor.onePossibly
            },
            onlyHerethere() {
                this.onlyHere()
                this.possiblyesColor.onlyHere = !this.possiblyesColor.onlyHere
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
                console.log('testAction')
                this.selectButton(-1)
                this.easyChoise = false
            },
            // vmin() {
            //     return Math.min(window.innerHeight,window.innerWidth) / 100
            // },
            buttonClick (data) {
                // console.log(data);
                // console.log(data.id);
                // console.log(this.selectedButton);
                //console.log(window);
                
                if (data.id === this.selectedButton && this.easyChoiseShow) {
                    //this.easyChoiseClass.transform = ''
                    // console.log(this.easyChoiseClass)
                    this.easyChoise = true
                    let x = Math.min(window.innerHeight,window.innerWidth) / 200 * (this.sizeBtn + 0.1)
                    let y = x
                    
                    if (data.id % 9 > 6 && this.possiblyChoise.size > 2) {
                
                        if (this.possiblyChoise.size > 6 && data.id % 9 === 7 || data.id % 9 === 8) {
                            x *= 3
                        }
                        if (this.possiblyChoise.size > 6 && data.id % 9 === 8) {
                            x = x/3*5
                        }
                        
                    }
                    if (data.id >62 && this.possiblyChoise.size > 2) {
                
                        if (this.possiblyChoise.size > 6 && data.id >62 || data.id >71) {
                            y *= 3
                        }
                        if (this.possiblyChoise.size > 6 && data.id>71) {
                            y = y/3*5
                        }
                        
                    }
                    this.easyChoiseClass.left = data.e.x - x + 'px'
                    this.easyChoiseClass.top = data.e.y - y +'px'
                    // this.easyChoiseClass = {
                    // this.easyChoiseClass.transform = 'translate(' + (data.e.x - Math.min(window.innerHeight, window.innerWidth) / 200 * this.sizeBtn)
                    //  + 'px, ' + (data.e.y - Math.min(window.innerHeight, window.innerWidth) / 200 * this.sizeBtn) + 'px)'
                    // // }
                    //window.innerHeight
                    //Math.min(window.innerHeight,window.innerWidth) / 200 * this.sizeBtn
                    //console.log(this.sizeBtn*3 - this.sizeBtn/2 + 1.2 + 'vmin')
                    //console.log(this.sizeBtn*3 + 1.2 + 'vmin')
                    //this.easyChoiseClass.left = data.e.x -Math.min(window.innerHeight,window.innerWidth) / 200 * this.sizeBtn + 'px'
                    //this.easyChoiseClass.top = data.e.y -Math.min(window.innerHeight,window.innerWidth) / 200 * this.sizeBtn +'px'
                    this.easyChoiseClass.maxWidth = this.sizeBtn * 3 + 1.2 + 'vmin'
                    this.easyChoiseClass.maxHeight = this.sizeBtn * 3 + 1.2 + 'vmin'
                    this.easyChoiseClass.fontSize = this.sizeBtn + 'vmin'
                    //console.log(this.possiblyChoise);
                    if (this.possiblyChoise.size <5) {
                        this.easyChoiseClass.maxWidth = this.sizeBtn*2 + 0.8 + 'vmin'
                    }
                    //  if (+data.id>53) {
                    //     console.log('this.easyChoiseClass')
                    //     this.easyChoiseClass.transform = 'translate(' + (data.e.x + Math.min(window.innerHeight, window.innerWidth) / 200 * this.sizeBtn)
                    //  + 'px, ' + (data.e.y + Math.min(window.innerHeight, window.innerWidth) / 200 * this.sizeBtn) + 'px)'
                    //     //this.easyChoiseClass.transform+='rotate(180deg)'
                    // }
                    console.log(y);
                    console.log(x);
                } else {
                    this.easyChoise = false
                }
                console.log(this.easyChoiseClass)
                console.log(data)
            },
            keywordClick(e) {
                //console.log('testAction')
                //console.log(this.selectedButton)
                if(+e.key >= 0 && +e.key<= 9) {
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
                //console.log(this.selectedButton)
                //ArrowDown
                //ArrowUp
                //alert(e)   this.selectedButton
                //console.log(this.possibleField)
                //this.testmethod()
            },
            goBack() {
                //alert('back')
                this.$router.push('/')
            },
            updateSize() {
                //this.easyChoise = false
                //alert('updateSize')
                if (window.innerWidth < window.innerHeight) {
                    this.rotate = true
                    this.flexD = 'row'
                    this.flexW = 'column'
                } else {
                    this.rotate = false
                    this.flexD = 'column'
                    this.flexW = 'row'
                }
            },
        },
        created() {
            //document.addEventListener('keydown', this.testAction)
            //console.log(this.testa)
            window.addEventListener('resize', this.updateSize);
            //window.addEventListener('resize', this.updateSize);
        },
        mounted() {
            this.updateSize()
            //document.addEventListener('keydown')
            document.addEventListener('keydown', this.keywordClick)
            //console.log(this.testsize)
            //console.log(window.screen.height)
            //this.testmethod()
            //this.testsudoku(2)
            //console.log(this.fieldview)
            //this.getData()
        },
        beforeDestroy () {
            //alert('beforeDestroy')
            document.removeEventListener('keydown', this.keywordClick);
            //window.removeEventListener('keydown', this.testAction);
            //window.removeEventListener('resize', this.updateSize);
        }
    }
</script>
<style>
    .Field {
        display: flex;
        flex-direction: column;
        margin: 1px;
        border-color: rgb(0, 0, 0);
        border-width: 3px;
        border-style: solid;
    }

    .Field-line {
        /*flex-wrap: nowrap;*/
        /*flex: auto;*/
        /*justify-content: space-between;
        align-content: stretch;*/
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
        /*flex-wrap: wrap;*/
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
        /* width: 9vmin; */
        user-select: none;
        display: flex;
        flex-direction: column;
        margin-bottom: 2vmin;
    }

    .green {
        background-color: green;
    }
    .easyChoise {
        position: absolute;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .easyChoiseitem {
        user-select: none;
        min-height: 9vmin;
        min-width: 9vmin;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 75%;
        border-color: black;
        border-width: 0.2vmin;
        border-style: solid;
    }
</style>