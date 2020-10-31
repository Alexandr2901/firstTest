export default {
    initialization(context, id) {
        //context.commit('SAVE_PERSONAL_DATA')
        context.commit('INITIALIZATION', context.rootGetters['dataManage/field'](id))
        context.dispatch('allPossubly')
        context.dispatch('front/initialization', context.state.selectedStringField)
    },
    initializationString(context, str) {
        context.commit('INITIALIZATION', str)
        context.dispatch('allPossubly')
        context.dispatch('front/initialization', context.state.selectedStringField)
    },
    newField (context) {
        context.commit('NEW_FIELD')
    },
    savePersonalData (context) {
        context.commit('SET_PERSONAL_DATA')
    },
    appInit () {
        //console.log('appInit');
        //context.commit('GET_PERSONAL_DATA')
    },
    autoResolution(context) {
        context.commit('AUTO_RESOLUTIONS')
        if (context.state.savedData.autoresolution) {
            context.dispatch('onePossubly')
        }
    },
    onlePossiblySwitch(context) {
        if (context.state.savedData.autoresolution) {
            context.commit('AUTO_RESOLUTIONS')
        }
        context.commit('ONE_POSSIBLY_SWITCH')
        context.dispatch('allPossubly')
    },
    onlyHereSwitch(context) {
        if (context.state.savedData.autoresolution) {
            context.commit('AUTO_RESOLUTIONS')
        }
        context.commit('ONLY_HERE_SWITCH')
        context.dispatch('allPossubly')
    },
    allPossubly(context) {
        context.commit('EXIST_VALUE',context.state.field)
        if (context.state.savedData.autoresolution) {
            setTimeout(() => {
                if (context.state.savedData.autoresolution) {
                    context.dispatch('onePossubly')
                }
            }, 1000)
        }
        context.commit('POSSIBLY_APDATE')
    },
    onePossubly(context) {
        let haspossibly = false
        let payload = {
            value: null,
            target: null
        }
        for (let i = 0; i < 81; i++) {
            if (context.state.field[i].possibly.size === 1 && context.state.field[i].value === 0) {
                haspossibly = true
                context.state.field[i].possibly.forEach(item => {
                    payload.value = item
                })
                payload.target = i
            }
        }
        if (haspossibly) {
            context.dispatch('setFieldValue', payload)
        }
    },
    fieldPossubly (context, stringField) {
        //stringField is string
        let field = []
        stringField.forEach((item, index) => {
            field.push({
                id: index,
                value: +item,
                possibly: new Set()
            })
        })
        context.dispatch('segmentsPossubly',field)
    },
    setFieldValue(context, payload) {
        if (context.state.selectedStringField[payload.target] === '0' &&
            (context.state.field[payload.target].possibly.has(payload.value) || payload.value === 0)) {
            context.commit('SET_FIELD_VALUE', payload)
            context.dispatch('allPossubly')
        }
    },
    undoLastValue(context) {
        if (context.state.savedData.autoresolution) {
            context.commit('AUTO_RESOLUTIONS')
        }
        if (context.state.moveHistory.length) {
            let local = context.state.moveHistory.pop()
            context.dispatch('setFieldValue', {
                value: local.exvalue,
                target: local.buttonid,
                unsave: true
            })
        }
    }
}