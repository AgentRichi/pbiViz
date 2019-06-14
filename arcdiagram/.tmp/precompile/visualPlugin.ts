declare var powerbi;
powerbi.visuals = powerbi.visuals || {};
powerbi.visuals.plugins = powerbi.visuals.plugins || {};
powerbi.visuals.plugins["arcDiagram3AE23BF6D2F64FC8B1ACABEBAD0FAE26_DEBUG"] = {
    name: 'arcDiagram3AE23BF6D2F64FC8B1ACABEBAD0FAE26_DEBUG',
    displayName: 'arcDiagram',
    class: 'Visual',
    version: '1.0.0',
    apiVersion: '1.13.0',
    create: (options: extensibility.visual.VisualConstructorOptions) => new powerbi.extensibility.visual.Visual(options),
    custom: true
}
