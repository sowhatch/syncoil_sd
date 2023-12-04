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
			var amount = 0;

			var invnr = 1;

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
				
				oModel.create(
					"/OrderSet",
					{
						Invnr : invnr,
						Custid : '',
						Matnr : oSelectedData.OrderSet[i].Matnr,
						Pname : oSelectedData.OrderSet[i].Pname,
						Quan : oSelectedData.OrderSet[i].Quantity,
						Unit : 'L',
						Amount : amount,
						Currency : curr
					},
					{
						success: function(){
						},
						error: function(oError){
							MessageBox.error("생성실패");
	
						}
					}
				);

				invnr++;
			}

			oModel.create(
				"/OrderSet",
				{
					Invnr : '',
					Custid : oData.Custid,
					Matnr : '',
					Pname : '',
					Quan : '',
					Unit : '',
					Amount : '',
					Currency : curr

				},
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
			var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
			Utils.getSelectedItemContext(oSelectedProductsTable, function(oSelectedItemContext, iSelectedItemIndex) {
			
				// reset the rank property and update the model to refresh the bindings
				//var oProductsModel = oSelectedProductsTable.getModel();
				//oProductsModel.setProperty("Rank", Utils.ranking.Initial, oSelectedItemContext);

				// select the previously selected position
				var aItemsOfSelectedProductsTable = oSelectedProductsTable.getItems();
				var oPrevItem = aItemsOfSelectedProductsTable[Math.min(iSelectedItemIndex, aItemsOfSelectedProductsTable.length - 1)];
				if (oPrevItem) {
					oPrevItem.setSelected(true);
				}
			});
		},

		onDropSelectedProductsTable: function(oEvent) {
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext();
			if (!oDraggedItemContext) {
				return;
			}

			var oRanking = Utils.ranking;
			var iNewRank = oRanking.Default;
			var oDroppedItem = oEvent.getParameter("droppedControl");

			if (oDroppedItem instanceof sap.m.ColumnListItem) {
				// get the dropped row data
				var sDropPosition = oEvent.getParameter("dropPosition");
				var oDroppedItemContext = oDroppedItem.getBindingContext();
				var iDroppedItemRank = oDroppedItemContext.getProperty("Rank");
				var oDroppedTable = oDroppedItem.getParent();
				var iDroppedItemIndex = oDroppedTable.indexOfItem(oDroppedItem);

				// find the new index of the dragged row depending on the drop position
				var iNewItemIndex = iDroppedItemIndex + (sDropPosition === "After" ? 1 : -1);
				var oNewItem = oDroppedTable.getItems()[iNewItemIndex];
				if (!oNewItem) {
					// dropped before the first row or after the last row
					iNewRank = oRanking[sDropPosition](iDroppedItemRank);
				} else {
					// dropped between first and the last row
					var oNewItemContext = oNewItem.getBindingContext();
					iNewRank = oRanking.Between(iDroppedItemRank, oNewItemContext.getProperty("Rank"));
				}
			}

			// set the rank property and update the model to refresh the bindings
			var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
			var oProductsModel = oSelectedProductsTable.getModel();
			oProductsModel.setProperty("Rank", iNewRank, oDraggedItemContext);
		},

		moveSelectedItem: function(sDirection) {
			var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
			Utils.getSelectedItemContext(oSelectedProductsTable, function(oSelectedItemContext, iSelectedItemIndex) {
				var iSiblingItemIndex = iSelectedItemIndex + (sDirection === "Up" ? -1 : 1);
				var oSiblingItem = oSelectedProductsTable.getItems()[iSiblingItemIndex];
				var oSiblingItemContext = oSiblingItem.getBindingContext();
				if (!oSiblingItemContext) {
					return;
				}

				// swap the selected and the siblings rank
				var oProductsModel = oSelectedProductsTable.getModel();
				var iSiblingItemRank = oSiblingItemContext.getProperty("Rank");
				var iSelectedItemRank = oSelectedItemContext.getProperty("Rank");

				oProductsModel.setProperty("Rank", iSiblingItemRank, oSelectedItemContext);
				oProductsModel.setProperty("Rank", iSelectedItemRank, oSiblingItemContext);

				// after move select the sibling
				oSelectedProductsTable.getItems()[iSiblingItemIndex].setSelected(true);
			});
		},


		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameters().listItem.setSelected(true);
		}
	});

});
