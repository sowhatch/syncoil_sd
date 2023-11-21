sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("zcb.sd.chart01.controller.View1", {
            onChartTypeChanged: function() {
                //just tell the detail to call
                var par = "";
                var matnr = "";
                var sapyr = "";
    
                //way 1: by route
                var oItem = this.byId('MatnrList').getSelectedItem();
                matnr = oItem.mProperties.title;
                sapyr = this.byId("selectSapyr").getSelectedKey();

                var oView = this.getView();
                var oModel = oView.getModel();

                console.log("/SalesPlanSet(Sapyr='" + sapyr + "',Matnr='" + matnr + "')");

                oModel.read(
                    "/SalesPlanSet(Sapyr='" + sapyr + "',Matnr='" + matnr + "')",
                    {
                        success : function(oData){
                            var oConnModel = new JSONModel(oData);
                            oView.setModel(oConnModel,"view");
                        },
                        error : function(){
                            alert("조회실패");
                        }
                    }
                );
                /*
                par = "chartType=" + this.byId("select").getSelectedKey() + "&" + 
                    "color=" + this.byId("selectColor").getSelectedKey() + "&" +
                    "tooltip=" + this.byId('selectPopover').getSelectedKey() + "&" +
                    "measureNames=" + measure;
                this.getRouter().navTo("idoVizFrame2", {
                    'chartIndex': par
                }, false);*/

            },

            onInit: function () {
               
            }
        });
    });
