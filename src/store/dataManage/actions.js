export default {
    getField(context, [id, difficulty]) {
        let field
        try {
            field = context.state.fields[difficulty][id]
        } catch (e) {
            return ''
        }
        // console.log(id,field)
        return  field
        // return '812375946597461382634829157328914765149756238756238419963547821475182693281693574'
    },
}
