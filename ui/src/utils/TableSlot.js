import { defineComponent } from 'vue';

export const TableSlot = defineComponent({
  name: 'AuTableSlot',
  props: {
    render: { type: Function, required: true },
    context: { type: Object, required: true },
  },
  setup(props) {
    return () => props.render(props.context);
  },
});
