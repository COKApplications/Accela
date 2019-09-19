showMessage = true;

if((wfTask == "Application Submittal") && (wfStatus == "Approved")){


	var OKToProceed = "Yes";

	//check if all documents have been received
	
	//var checkValidationOfProperty = AInfo["Validation of Property Interest"];
	var checkConstructionDrawings = AInfo["Construction Drawings Received"];
	var checkCoordinatesProvided = AInfo["Coordinates Provided"];
	var checkStructuralAnalysis = AInfo["Structural Analysis Completed"];
        var checkFeesPaid = AInfo["Fees Paid"];
	//var checkSuretyBond = AInfo["Certification of Surety Bond"];
	
	if((checkConstructionDrawings == "Yes") && (checkCoordinatesProvided == "Yes")
        && (checkFeesPaid == "Yes")
	&& (checkStructuralAnalysis == "Yes")) {
		OKToProceed = "Yes";
	} else {
		showMessage = true;
		comment("<p style=color:red;font-size:20px;font-weight:bold>Please review and all required documents are marked as received</p>");
		OKToProceed = "No";
		updateTask("Application Submittal", "Applied","Validation failed.  Updated by Script.","");
        	deactivateTask("Active");
        	activateTask("Application Submittal");
	}

	//if issued date is null - fill in issued date
	var checkIssuedDate = AInfo["Issued Date"];
	//comment("Issued Date: " + checkIssuedDate);
	if (checkIssuedDate == null) {
		var q = new Date();
		var m = q.getMonth();
		var d = q.getDate();
		var y = q.getFullYear();
		//month is 0 to 11 so add 1
		m = m + 1;
		var currentDate = m + "/" + d + "/" + y;
		//comment(currentDate);
		editAppSpecific("Issued Date", currentDate, capId);
	}
	
}