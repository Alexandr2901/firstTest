export default {
    getField(context, [id, difficulty]) {

        let field
        try {
            field = context.state.fields[difficulty][id]
        } catch (e) {
            return ''
        }
        return field
    }
}
