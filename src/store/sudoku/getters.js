export default {
    field: state =>  state.field,
    autoresolution: state =>  state.savedData.autoresolution,
    //advanchedPossibly: state => state.advanchedPossibly,
    savedData: state => state.savedData,
    // advanchedPossibly: state => (n) => {
    //     return state.savedData.advanchedPossibly[n]
    // },
    advanchedPossibly: state => state.savedData.advanchedPossibly
}
