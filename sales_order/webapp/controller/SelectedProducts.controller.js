sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./Utils",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller, Utils,Fragment, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("zcbsd.salesorder.controller.SelectedProducts", {

		onInit: function () {
			var oModel = new JSONModel({
				OrderSet:[]
				//원래 ProductSet이었음
			});
			this.byId("idSelectedTable").setModel(oModel, "selected");
			

			var oModel = new JSONModel({
				CustList : [
					{Custid : "CASE", text : "CASEY'S"},
					{Custid : "GSCA", text : "GS칼텍스"},
					{Custid : "HYUN", text : "현대오일뱅크"},
					{Custid : "HYVE", text : "HY-VEE"},
					{Custid : "KWIK", text : "KWIK TRIP"},
					{Custid : "RUTT", text : "RUTTER'S"},
					{Custid : "SAPK", text : "SAP KOREA"},
					{Custid : "SHTZ", text : "SHEETZ"},
					{Custid : "SKEN", text : "SK에너지"},
					{Custid : "SOIL", text : "S_OIL"}
				]
			});
            var oView = this.getView();
            oView.setModel(oModel,"new");
		},

		onBeforeRendering: function () {	
		},

		//주문하기 눌렀을때 
		onOpenCreateDialog: function (){
			var oView = this.getView();
            var oDialog = this.byId("idCreateDialog");
            if (oDialog) {
                oDialog.open();
            } else {
                Fragment.load({
                    id: oView.getId(),
                    name: "zcbsd.salesorder.view.New",
                    controller:this
                }).then(function(oDialog){
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            }
		},

		onCreateComplete: function(){
			var oView = this.getView();
			var oSelectedModel = this.byId("idSelectedTable").getModel("selected");
			var oSelectedData = oSelectedModel.getData();

			var oNewModel = oView.getModel("new");
			var oData = oNewModel.getData();

			var curr = 'KRW';
			var amount = 0.00;

			var invnr = 1;

			var aItem = [];

		    var oModel = oView.getModel();

			for(var i=0; i<oSelectedData.OrderSet.length;i++){

				if ( oData.Custid == 'GSCA' || oData.Custid == 'HYUN' || oData.Custid == 'SAPK' || oData.Custid == 'SKEN' || oData.Custid == 'SOIL' ){
					curr = 'KRW';
					amount = oSelectedData.OrderSet[i].Amount;
				}
				else {
					curr = 'USD';
					amount = oSelectedData.OrderSet[i].Samntu;
				}

				var item = {
					Invnr : invnr.toString(),
					Custid : '',
					Matnr : oSelectedData.OrderSet[i].Matnr,
					Pname : oSelectedData.OrderSet[i].Pname,
					Quan : oSelectedData.OrderSet[i].Quantity,
					Unit : 'L',
					Amount : amount,
					Currency : curr
				};
				
				//aItem.push(item);

				invnr++;
				
				 oModel.create(
				 	"/OrderSet",
				 	item,
				 	{
				 		success: function(){
				 		},
				 		error: function(oError){
				 			MessageBox.error("생성실패");
	
				 		}
				 	}
				 );

			}

			var header =  {
				Invnr : '',
				Custid : oData.Custid,
				Matnr : '',
				Pname : '',
				Quan : '0',
				Unit : 'L',
				Amount : '0',
				Currency : curr
				//toItem: aItem
			};

			oModel.create(
				"/OrderSet",
				header,
				{
					success: function(){
						MessageBox.success("생성성공");
						oView.byId("idCreateDialog").close();
					},
					error: function(oError){
						MessageBox.error("생성실패");

					}
				}
			);
		},

		onCreateCancel: function (){
            this.byId("idCreateDialog").close();
		},

		moveToAvailableProductsTable: function() {
			var oView = this.getView();
			var oTable = oView.byId("idSelectedTable");
            var oIndex = oTable.getSelectedItem();
			//var oContext = oTable.getContextByIndex(oIndex);

			var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
			var aData = oSelectedProductsTable.getModel("selected").getData();
			aData.OrderSet.splice(oIndex,1) ;

			oSelectedProductsTable.getModel("selected").setData( aData );
			
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameters().listItem.setSelected(true);
		}
	});

});
