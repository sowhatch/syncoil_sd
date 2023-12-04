sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./Utils"
], function(Controller, Utils) {
	"use strict";

	return Controller.extend("zcbsd.salesorder.controller.AvailableProducts", {

		onDropAvailableProductsTable: function(oEvent) {
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext();
			if (!oDraggedItemContext) {
				return;
			}

			// reset the rank property and update the model to refresh the bindings
			var oAvailableProductsTable = Utils.getAvailableProductsTable(this);
			var oProductsModel = oAvailableProductsTable.getModel();
			oProductsModel.setProperty("Rank", Utils.ranking.Initial, oDraggedItemContext);
		},

		moveToSelectedProductsTable: function() {
			var oAvailableProductsTable = Utils.getAvailableProductsTable(this);
			Utils.getSelectedItemContext(oAvailableProductsTable, function(oAvailableItemContext, iAvailableItemIndex) {
				var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
				var aData = oSelectedProductsTable.getModel("selected").getData();

				var Matnr = oAvailableItemContext.getProperty("Matnr");
				var Maktx = oAvailableItemContext.getProperty("Maktx");
				var Pname = oAvailableItemContext.getProperty("Pname");
				var check = true;
				/*for( var i=0 ; aData.OrderSet.length ; i++ ){
					if ( aData.OrderSet[i].Matnr == Matnr && aData.OrderSet[i].Pname == Pname) {
						check = false;
						sap.m.MessageBox.show("같은 공장의 제품을 선택할 수 없습니다.");
						break;
					}
				}*/

				if ( check ){
					var data = {
						Maktx: Maktx,
						Matnr: Matnr,
						Pname: Pname,
						Quantity: 0
					}
	
					if ( aData ) {
						aData.OrderSet.push( data ) ;
					} else {
						aData = {
							OrderSet: [ data ] 
						};
					}
	
					oSelectedProductsTable.getModel("selected").setData( aData );
	
				}


				var oSelectedTableItems = oSelectedProductsTable.getItems();
				
				if ( oSelectedTableItems && oSelectedTableItems.length > 0 ){
					var oFirstItemOfSelectedProductsTable = oSelectedTableItems[0]; 
				}

				// var iNewRank = Utils.ranking.Default;

				if (oFirstItemOfSelectedProductsTable) {
					var oFirstContextOfSelectedProductsTable = oFirstItemOfSelectedProductsTable.getBindingContext();
					// iNewRank =  Utils.ranking.Before(oFirstContextOfSelectedProductsTable.getProperty("Rank"));
				}

				// var oProductsModel = oAvailableProductsTable.getModel();
				// oProductsModel.setProperty("Rank", iNewRank, oAvailableItemContext);

				// select the inserted and previously selected item
				// oSelectedProductsTable.getItems()[0].setSelected(true);
				// var oPrevSelectedItem = oAvailableProductsTable.getItems()[iAvailableItemIndex];
				// if (oPrevSelectedItem) {
				// 	oPrevSelectedItem.setSelected(true);
				// }
			}.bind(this));
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameter("listItem").setSelected(true);
		}
	});

});
