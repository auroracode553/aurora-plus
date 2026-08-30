import DefaultTheme from 'vitepress/theme';
import AuroraUI from 'aurora-ui';
import 'aurora-ui/style.css';
import './custom.css';
import { initializeDocsMaterial } from './utils/material-preference.js';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AuroraUI);
    initializeDocsMaterial();
  },
};
