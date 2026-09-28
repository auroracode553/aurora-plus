import { defineComponent } from 'vue';
import { withInstall } from '../../utils/install.js';

const TableColumn = defineComponent({
  name: 'AuTableColumn',
  props: {
    type: { type: String, default: 'default' },
    prop: { type: String, default: '' },
    label: { type: String, default: '' },
    width: { type: [Number, String], default: undefined },
    minWidth: { type: [Number, String], default: undefined },
    maxWidth: { type: [Number, String], default: undefined },
    flexGrow: { type: Number, default: 0 },
    align: { type: String, default: 'left' },
    fixed: { type: [Boolean, String], default: false },
    sortable: { type: Boolean, default: false },
    selectable: { type: Function, default: undefined },
    sortMethod: { type: Function, default: undefined },
    formatter: { type: Function, default: undefined },
    columnClass: { type: String, default: '' },
  },
  setup: () => () => null,
});

export const AuTableColumn = withInstall(TableColumn, 'AuTableColumn');
