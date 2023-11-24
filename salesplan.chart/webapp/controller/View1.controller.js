sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zcb.sd.salesplan.chart.controller.View1", {
            
            onInit: function () {
               
            },

            onBeforeRendering: function () {
                var oDate = new Date(); // 오늘 날짜 정보가 있는 객체를 생성
                var currentYear = oDate.getFullYear();  // 올해를 currentYear 에 저장
                this._charFiltering(currentYear);
                // _charFiltering('2023');
            },

            onChartTypeChanged: function( oEvent ) {

                var oView = this.getView();
                var oModel = oView.getModel();

                var key = oEvent.getParameter("selectedItem").getKey();
                this._charFiltering(key);



            },

            _charFiltering: function ( year ) {

                var oView = this.getView();
                
                var aFilter = [];
                if ( year ) {
                    var oFilter = new Filter('Sapyr', FilterOperator.EQ, year);
                    aFilter.push(oFilter); // ABAP의 Append와 같이 배열에 한줄 추가하는 기능
                }

                var oVizFrame = oView.byId("idVizFrame");
                var oVizDataset = oVizFrame.getDataset();
                var oVizBinding = oVizDataset.getBinding("data");
                oVizBinding.filter(aFilter);
            }
        });
    });
