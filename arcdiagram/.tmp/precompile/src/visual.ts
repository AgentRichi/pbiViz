module powerbi.extensibility.visual.arcDiagram3AE23BF6D2F64FC8B1ACABEBAD0FAE26  {
    "use strict";
    // below is a snippet of a definition for an object which will contain the property values
    // selected by the users
    /*interface VisualSettings {
        lineColor: string;
    }*/

    // to allow this scenario you should first the following JSON definition to the capabilities.json file
    // under the "objects" property:
    // "settings": {
    //     "displayName": "Visual Settings",
    //     "description": "Visual Settings Tooltip",
    //     "properties": {
    //         "lineColor": {
    //         "displayName": "Line Color",
    //         "type": { "fill": { "solid": { "color": true }}}
    //         }
    //     }
    // }

    // powerbi.extensibility.utils.dataview
    import DataViewObjectsModule = powerbi.extensibility.utils.dataview.DataViewObject;

    // in order to improve the performance, one can update the <head> only in the initial rendering.
    // set to 'true' if you are using different packages to create the widgets
    const updateHTMLHead: boolean = false;
    const renderVisualUpdateType: number[] = [
        VisualUpdateType.Resize,
        VisualUpdateType.ResizeEnd,
        VisualUpdateType.Resize + VisualUpdateType.ResizeEnd
    ];


    //RVIZ_IN_PBI_GUIDE:BEGIN:Added to create HTML-based 
    interface VisualSettingsCols {
        numCols: string;
        col1: string;
        col2: string;
        col3: string;
        col4: string;
        col5: string;
    }

    //RVIZ_IN_PBI_GUIDE:END:Added to create HTML-based 


    export class Visual implements IVisual {
        private rootElement: HTMLElement;
        private headNodes: Node[];
        private bodyNodes: Node[];
        private settings: VisualSettings;

        //RVIZ_IN_PBI_GUIDE:BEGIN:Added to create HTML-based 
        private settings_cols: VisualSettingsCols;
        //RVIZ_IN_PBI_GUIDE:END:Added to create HTML-based 

        public constructor(options: VisualConstructorOptions) {
            if (options && options.element) {
                this.rootElement = options.element;
            }
            this.headNodes = [];
            this.bodyNodes = [];

            //RVIZ_IN_PBI_GUIDE:BEGIN:Added to create HTML-based 
            this.settings_cols = <VisualSettingsCols>{
                numCols: "5",
                col1: "#c7e9b4",
                col2: "#7fcdbb",
                col3: "#41b6c4",
                col4: "#2c7fb8",
                col5: "#253494"
            };
            //RVIZ_IN_PBI_GUIDE:END:Added to create HTML-based 



        }

        public update(options: VisualUpdateOptions): void {

            if (!options ||
                !options.type ||
                !options.viewport ||
                !options.dataViews ||
                options.dataViews.length === 0 ||
                !options.dataViews[0]) {
                return;
            }
            const dataView: DataView = options.dataViews[0];
            this.settings = Visual.parseSettings(dataView);
            //RVIZ_IN_PBI_GUIDE:BEGIN:Added to create HTML-based 
            this.updateObjects(dataView.metadata.objects);
            //RVIZ_IN_PBI_GUIDE:END:Added to create HTML-based 
            let payloadBase64: string = null;
            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                payloadBase64 = dataView.scriptResult.payloadBase64;
            }

            if (renderVisualUpdateType.indexOf(options.type) === -1) {
                if (payloadBase64) {
                    this.injectCodeFromPayload(payloadBase64);
                }
            } else {
                this.onResizing(options.viewport);
            }
        }

        public onResizing(finalViewport: IViewport): void {
            /* add code to handle resizing of the view port */
        }

        private injectCodeFromPayload(payloadBase64: string): void {
            // inject HTML from payload, created in R
            // the code is injected to the 'head' and 'body' sections.
            // if the visual was already rendered, the previous DOM elements are cleared

            ResetInjector();

            if (!payloadBase64) {
                return;
            }

            // create 'virtual' HTML, so parsing is easier
            let el: HTMLHtmlElement = document.createElement("html");
            try {
                el.innerHTML = window.atob(payloadBase64);
            } catch (err) {
                return;
            }

            // if 'updateHTMLHead == false', then the code updates the header data only on the 1st rendering
            // this option allows loading and parsing of large and recurring scripts only once.
            if (updateHTMLHead || this.headNodes.length === 0) {
                while (this.headNodes.length > 0) {
                    let tempNode: Node = this.headNodes.pop();
                    document.head.removeChild(tempNode);
                }
                let headList: NodeListOf<HTMLHeadElement> = el.getElementsByTagName("head");
                if (headList && headList.length > 0) {
                    let head: HTMLHeadElement = headList[0];
                    this.headNodes = ParseElement(head, document.head);
                }
            }

            // update 'body' nodes, under the rootElement
            while (this.bodyNodes.length > 0) {
                let tempNode: Node = this.bodyNodes.pop();
                this.rootElement.removeChild(tempNode);
            }
            let bodyList: NodeListOf<HTMLBodyElement> = el.getElementsByTagName("body");
            if (bodyList && bodyList.length > 0) {
                let body: HTMLBodyElement = bodyList[0];
                this.bodyNodes = ParseElement(body, this.rootElement);
            }

            RunHTMLWidgetRenderer();
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }



        //RVIZ_IN_PBI_GUIDE:BEGIN:Added to create HTML-based 
        /**
         * This function gets called by the update function above. You should read the new values of the properties into 
         * your settings object so you can use the new value in the enumerateObjectInstances function below.
         * 
         * Below is a code snippet demonstrating how to expose a single property called "lineColor" from the object called "settings"
         * This object and property should be first defined in the capabilities.json file in the objects section.
         * In this code we get the property value from the objects (and have a default value in case the property is undefined)
         */
        public updateObjects(objects: DataViewObjects) {

            this.settings_cols = <VisualSettingsCols>{
                numCols: DataViewObjectsModule.getValue<string>(objects, 'numCols', this.settings_cols.numCols),
                col1: DataViewObjectsModule.getValue<string>(objects, 'col1', this.settings_cols.col1),
                col2: DataViewObjectsModule.getValue<string>(objects, 'col2', this.settings_cols.col2),
                col3: DataViewObjectsModule.getValue<string>(objects, 'col3', this.settings_cols.col3),
                col4: DataViewObjectsModule.getValue<string>(objects, 'col4', this.settings_cols.col4),
                col5: DataViewObjectsModule.getValue<string>(objects, 'col5', this.settings_cols.col5)
            };
        }
        //RVIZ_IN_PBI_GUIDE:END:Added to create HTML-based 



        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions):
            VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            //RVIZ_IN_PBI_GUIDE:BEGIN:Added to create HTML-based 
            let objectName = options.objectName;
            let objectEnumeration = [];

            switch (objectName) {


                case 'settings_cols':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            numCols: this.settings_cols.numCols,
                            col1: this.settings_cols.col1,
                            col2: this.settings_cols.col2,
                            col3: this.settings_cols.col3,
                            col4: this.settings_cols.col4,
                            col5: this.settings_cols.col5
                        },
                        selector: null
                    });
                    break;

            };


            //RVIZ_IN_PBI_GUIDE:END:Added to create HTML-based 

            return objectEnumeration;
        }
    }
}