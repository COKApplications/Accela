//Start Script 18 - Create and Schedule Re-Inspection
var autoInspector = lookup("COK_ZONING_INSP", "ZONING_INSPECTOR");

var inspectionDays = getAppSpecific("Re-Inspection Days");

   //showMessage = true;
   //comment ("inspResult=" + inspResult);
if(inspType == "Zoning Initial Inspection") {
	if(inspResult == "In Violation") {
		//RFS#26406
		//if(isEmpty(inspectionDays) == true) {
			//scheduleInspectDate("Zoning Re-Inspection", nextWorkDay(dateAdd(null, 9)), autoInspector, "", "Scheduled by Script.");
		//} else if(isEmpty(inspectionDays) == false) {
		//	scheduleInspectDate("Zoning Re-Inspection", nextWorkDay(dateAdd(null, inspectionDays - 1)), autoInspector, "", "Scheduled by Script.");
		//}
		scheduleInspectDate("Zoning Re-Inspection", dateAdd(null, 14), autoInspector, "", "Scheduled by Script.");		
		closeTask("Initial Inspection", "In Violation", "Scheduled by Script", "Scheduled by Script.");
		activateTask("Re-Inspection");
		updateTask("Re-Inspection", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
	} else if(inspResult == "In Violation Send Letter") {
		updateAppStatus("In Violation Send Letter", "Updated by Script.");
		closeTask("Initial Inspection", "In Violation Send Letter", "Scheduled by Script", "Scheduled by Script.");
		activateTask("Letter Notice");
		updateTask("Letter Notice", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
	// RFS26406 - handle no violation and canceled.  KCR 05/07/2018
	//} else if(inspResult == "No Violation") {
	//	closeTask("Initial Inspection", "No Violation", "Scheduled by Script", "Scheduled by Script.");
	//	activateTask("Case Closed");
	//	updateTask("Case Closed", "No Violation", "Scheduled by Script.", "Scheduled by Script.");
	//	closeEnforcementCaseWorkflow("No Violation");
	} else if(inspResult == "No Violation" || inspResult == "Canceled") {
		closeTask("Initial Inspection", inspResult, "Scheduled by Script", "Scheduled by Script.");
		activateTask("Case Closed");
		updateTask("Case Closed", inspResult, "Scheduled by Script.", "Scheduled by Script.");
		closeEnforcementCaseWorkflow(inspResult);
		updateAppStatus("Completed", "Updated by Script.");
		updateAppStatus("Completed", "Updated by Script.", getParent());
	//RFS#26487 - Allow branch to Cite to Court task from Initial Inspection.  KCR 4/19/2018
	} else if(inspResult == "Cite to Court") {
	    //comment ("Cite to Court");
		closeTask("Initial Inspection", "No Violation", "Scheduled by Script", "Scheduled by Script.");
		activateTask("Cite to Court");
		updateTask("Cite to Court", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
		updateAppStatus("Cite to Court", "Updated by Script.");
		deactivateTask("Letter Notice");
	//RFS#26406 - Allow branch to Bill Task from Initial Inspection.  KCR 5/7/2018
	} else if(inspResult == "Inspector Corrected") {
	    //comment ("Inspector Corrected");
		closeTask("Initial Inspection", "Inspector Corrected", "Scheduled by Script", "Scheduled by Script.");
		activateTask("Bill");
		updateTask("Bill", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
		updateAppStatus("Abatement Review", "Updated by Script.");
		// ????deactivateTask("Letter Notice");
	//} else if(inspResult == "Pending Violation") {
	} else if(inspResult == "" || inspResult == "Pending Inspection") {
	//comment ("inspectorID=" + getInspector("Zoning Initial Inspection")};
		//var currInspector = getInspector("Zoning Initial Inspection");
		if (getInspector("Zoning Initial Inspection") != autoInspector) {
			assignCap(getInspector("Zoning Initial Inspection"));
			var databaseName = lookup("COK_Database_Name", "Database_Name");
			var alternateId = capId.getCustomID();
   //comment ("databaseName=" + databaseName + ' alternateId='+ alternateId);
 			if(databaseName != "AAPROD") {
				var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS2/NA/NA/NA/NA");
				var emailSubject = "**This is a test** Forwarding Zoning Violation: " + alternateId;
			} else 	{
				var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/INSPZONE/NA/NA/NA/NA");
				var emailSubject = "Forwarding Zoning Violation: " + alternateId ; 
			}
   //comment ("emailTo=" + emailTo + " emailSubject=" + emailSubject);
			var emailFrom = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/INSPZFRM/NA/NA/NA/NA");
			var emailBody = "A new Zoning Violation has been assigned to you: " + alternateId ;  
			email(emailTo, emailFrom, emailSubject, emailBody);
		}
	} 
}
if(inspType == "Zoning Re-Inspection") { 
	if(inspResult == "Cite To Court") {
		closeTask("Re-Inspection", "Cite to Court", "Scheduled by Script", "Scheduled by Script.");
		activateTask("Cite to Court");
		updateTask("Cite to Court", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
		updateAppStatus("Cite to Court", "Updated by Script.");
		//activateTask("Zoning Court Inspection");
		//updateTask("Zoning Court Inspection", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
		//updateAppStatus("Cite to Court", "Updated by Script.");
		//if(isEmpty(inspectionDays) == true) {
		//	scheduleInspectDate("Zoning Court Inspection", nextWorkDay(dateAdd(null, 9)), autoInspector, "", "Scheduled by Script.");
		//} else if(isEmpty(inspectionDays) == false) {
		//	scheduleInspectDate("Zoning Court Inspection", nextWorkDay(dateAdd(null, inspectionDays - 1)), autoInspector, "", "Scheduled by Script.");
		//}
	} else if(inspResult == "Violation Corrected") {
		closeTask("Re-Inspection", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
		activateTask("Case Closed");
		updateTask("Case Closed", "Violation Corrected", "Scheduled by Script.", "Scheduled by Script.");
		closeEnforcementCaseWorkflow("Violation Corrected");
		updateAppStatus("Completed", "Updated by Script.");
		updateAppStatus("Completed", "Updated by Script.", getParent());
	//RFS26406 - schedule next inspection 14 days and make the app status "In Violation", task status "Under Review"
	} else if(inspResult == "In Violation") {
		closeTask("Re-Inspection", "In Violation", "Scheduled by Script", "Scheduled by Script.");
		//if(isEmpty(inspectionDays) == true) {
		//	scheduleInspectDate("Zoning Re-Inspection", nextWorkDay(dateAdd(null, 9)), autoInspector, "", "Scheduled by Script.");
		//} else if(isEmpty(inspectionDays) == false) {
		//	scheduleInspectDate("Zoning Re-Inspection", nextWorkDay(dateAdd(null, inspectionDays - 1)), autoInspector, "", "Scheduled by Script.");
		//}
		scheduleInspectDate("Zoning Re-Inspection", dateAdd(null, 14), autoInspector, "", "Scheduled by Script.");
		activateTask("Re-Inspection");
		updateTask("Re-Inspection", "Under Review", "Scheduled by Script.", "Scheduled by Script.");		
		//updateTask("Re-Inspection", "In Violation", "Scheduled by Script.", "Scheduled by Script.");		
	//RFS#26406 - Allow branch to Bill Task from Initial Inspection.  KCR 5/7/2018
	} else if(inspResult == "Inspector Corrected") {
	    //comment ("Inspector Corrected");
		closeTask("Initial Inspection", "Inspector Corrected", "Scheduled by Script", "Scheduled by Script.");
		activateTask("Bill");
		updateTask("Bill", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
		updateAppStatus("Abatement Review", "Updated by Script.");
	}
}
		
if(inspType == "Zoning Court Inspection") {
	if(inspResult == "In Violation") {
		updateTask("Cite to Court", "In Court Process", "Scheduled by Script.", "Scheduled by Script.");
	} else if(inspResult == "Violation Corrected") {
		updateTask("Cite To Court", "Violation Corrected", "Scheduled by Script.", "Scheduled by Script.");
		activateTask("Case Closed");
		updateTask("Case Closed", "Violation Corrected", "Scheduled by Script.", "Scheduled by Script.");
		closeEnforcementCaseWorkflow("Violation Corrected");
		updateAppStatus("Completed", "Updated by Script.");
		updateAppStatus("Completed", "Updated by Script.", getParent());
	}
}

//if(inspType == "Court Inspection") {
//	if(inspResult == "In Violation") {
//		closeTask("Court Inspection", "In Violation", "Scheduled by Script", "Scheduled by Script.");
//		activateTask("Court Hearing");
//		updateTask("Court Hearing", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
//	}
//}

//End Script 18