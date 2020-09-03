<script>
export default {
    name: 'TableExpand',
    functional: true,
    props: {
        row: Array,
        render: Function,
        index: Number,
        column: {
            type: Object,
            default: null,
        },
    },
    render: (h, ctx) => {
        //if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, ctx.props.row, ctx)
    },
}
</script>