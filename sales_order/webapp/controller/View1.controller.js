sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zcbsd.salesorder.controller.View1", {
            onInit: function () {

            },

            moveToAvailableProductsTable: function() {
                this.byId("selectedProducts").getController().moveToAvailableProductsTable();
            },
    
            moveToSelectedProductsTable: function() {
                this.byId("availableProducts").getController().moveToSelectedProductsTable();
            }
        });
    });
