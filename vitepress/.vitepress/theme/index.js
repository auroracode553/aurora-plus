import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import { defineComponent, h, watch } from 'vue';
import AuroraPlus, { setAuroraTheme } from 'aurora-plus';
import 'aurora-plus/style.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: defineComponent({
    setup() {
      const { isDark } = useData();
      watch(isDark, (dark) => setAuroraTheme(dark ? 'dark' : 'light'), { immediate: true });
      return () => h(DefaultTheme.Layout);
    },
  }),
  enhanceApp({ app }) {
    app.use(AuroraPlus);
  },
};
