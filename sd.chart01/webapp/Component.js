/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "zcb/sd/chart01/model/models",
	    "zcb/sd/chart01/model/LocalStorageModel"
    ],
    function (UIComponent, Device, models, LocalStorageModel) {
        "use strict";

        return UIComponent.extend("zcb.sd.chart01.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                
                ////////////////////////////////////////////////////////
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }

            
        });
    }
);