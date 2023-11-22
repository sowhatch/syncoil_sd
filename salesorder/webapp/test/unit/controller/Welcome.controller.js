/*global QUnit*/

sap.ui.define([
	"zcbsd/salesorder/controller/Welcome.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Welcome Controller");

	QUnit.test("I should test the Welcome controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
