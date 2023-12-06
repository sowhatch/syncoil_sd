sap.ui.define([
	"sap/m/MessageToast"
], function(MessageToast) {
	"use strict";

	var Utils = {

		getAvailableProductsTable: function(oController) {
			return oController.getOwnerComponent().byId("View1").byId("availableProducts").byId("idAvailableTable");
		},

		getSelectedProductsTable: function(oController) {
			return oController.getOwnerComponent().byId("View1").byId("selectedProducts").byId("idSelectedTable");
		},

		getSelectedItemContext: function(oTable, fnCallback) {
			var aSelectedItems = oTable.getSelectedItems();
			var oSelectedItem = aSelectedItems[0];

			if (!oSelectedItem) {
				MessageToast.show("한 행을 선택해주세요 !");
				return;
			}

			var oSelectedContext = oSelectedItem.getBindingContext();
			if (oSelectedContext && fnCallback) {
				var iSelectedIndex = oTable.indexOfItem(oSelectedItem);
				fnCallback(oSelectedContext, iSelectedIndex, oTable);
			}

			return oSelectedContext;
		}

	};

	return Utils;

}, /* bExport= */ true);
