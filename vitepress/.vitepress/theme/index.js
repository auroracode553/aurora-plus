import DefaultTheme from 'vitepress/theme';
import AuroraPlus from 'aurora-plus';
import 'aurora-plus/style.css';
import './custom.css';
import { initializeDocsMaterial } from './utils/material-preference.js';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AuroraPlus);
    initializeDocsMaterial();
  },
};
