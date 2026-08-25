/**
 * 为组件补充独立安装能力，既支持 app.use(AuroraUI)，也支持 app.use(AuButton)。
 */
export function withInstall(component, name) {
  component.install = (app) => {
    app.component(name, component);
  };
  component.componentName = name;
  return component;
}
