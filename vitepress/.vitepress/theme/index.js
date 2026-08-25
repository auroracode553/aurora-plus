import DefaultTheme from 'vitepress/theme';
import AuroraUI, { registerIcons } from 'aurora-ui';
import { docIcons } from './doc-icons.js';
import './custom.css';

registerIcons(docIcons);

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AuroraUI);
  },
};
