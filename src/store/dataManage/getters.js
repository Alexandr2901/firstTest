export default {
    field: state => id => state.fields[id],
    fields: state => state.fields.slice(0,100),
    fieldsN: state => (start,count) => {
        count = (count<state.fields.length) ? count : state.fields.length
        return state.fields.slice(start,count)
    }
}
