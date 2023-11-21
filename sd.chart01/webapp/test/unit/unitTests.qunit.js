/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zcb/sd.chart01/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
