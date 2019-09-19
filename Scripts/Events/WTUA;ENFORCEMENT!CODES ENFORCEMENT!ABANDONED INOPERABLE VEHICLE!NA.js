/**
 * The below code is related to the Enforcement/Codes Enforcement/Abandoned Inoperable Vehicle/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

copyParcelGisObjects();

//Start Script 23 - Add Ad-Hoc Tasks
//if(wfTask == "Initial Inspection" && wfStatus == "In Violation Send Letter") {
//	addUpdateAdhocTask ("AIV: Letter Notice");
//	deactivateTask("Initial Inspection");
//	//alternate for all deactivateTasks: closeTask("Initial Inspection", "", "Closed by Script.", "Closed by Script.");
//}
var serviceArea;
var autoInspector; 

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
serviceArea = "Public Service Zones-" + serviceArea;
autoInspector = lookup("USER_DISTRICTS", serviceArea);

if(autoInspector == "No Inspector") {
	autoInspector = "CHOLLIFIELD";
}

if(wfTask == "AIV: Letter Notice" && wfStatus == "In Violation") {
	activateEnforcementReinspection();
	deactivateTask("AIV: Letter Notice");
	scheduleInspectDate("AIV Re-Inspection", nextWorkDay(dateAdd(null, 13)), autoInspector, "", "Scheduled by Script.");
}

if(wfTask == "Letter Notice" && wfStatus == "In Violation") {
	scheduleInspectDate("AIV Re-Inspection", nextWorkDay(dateAdd(null, 13)), autoInspector, "", "Scheduled by Script.");
        editAppSpecific("Date Letter Mailed", dateAdd(null,0));
        editTaskSpecific("Letter Notice","Date Letter Mailed",dateAdd(null,0));
}

if(wfTask == "AIV: Cite to Court" && wfStatus == "Violation Corrected") {
	closeEnforcementCaseWorkflow("Violation Corrected");
	deactivateTask("AIV: Cite to Court");
	closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
}

if(wfTask == "AIV: BBB Appeal") {
	
	if(wfStatus == "In Violation") {
		activateEnforcementReinspection();
		deactivateTask("AIV: BBB Appeal");
	}
	
	if(wfStatus == "Violation Corrected") {
		closeEnforcementCaseWorkflow("Violation Corrected");
		deactivateTask("AIV: BBB Appeal");
		closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
	}
}
//End Script 23


//Start Script 16 - Update Service Request parent Status
if (wfTask == "Initial Inspection" && (wfStatus == "Canceled" || wfStatus == "No Violation")) {
	checkRelatedAndCloseSR();
	closeTask("Case Closed", "No Violation", "Scheduled by Script", "Scheduled by Script.");
}

if (wfTask == "Re-Inspection" && (wfStatus == "Violation Corrected")) {
	checkRelatedAndCloseSR();
	closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
}

if (wfTask == "Tow Vehicle" && (wfStatus == "Towed")) {
	checkRelatedAndCloseSR();
	closeTask("Case Closed", "Towed", "Scheduled by Script", "Scheduled by Script.");
}

if (wfTask == "AIV: Cite to Court" && (wfStatus == "Violation Corrected")) {
	checkRelatedAndCloseSR();
	closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
}

if (wfTask == "AIV: BBB Appeal" && (wfStatus == "Violation Corrected")) {
	checkRelatedAndCloseSR();
	closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
}
//End Script 16

//
//Help Desk Call #35333 Workflow closed but SR not closed
// 

if (wfTask == "Case Closed" && (wfStatus == "Canceled" || wfStatus == "No Violation" || wfStatus == "Violation Corrected")) {
     checkRelatedAndCloseSR();
     deactivateTask("Case Closed");
}