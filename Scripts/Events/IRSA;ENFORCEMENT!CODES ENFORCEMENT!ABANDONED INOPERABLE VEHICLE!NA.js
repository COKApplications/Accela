/**
 * The below code is related to the Enforcement/Codes Enforcement/Abandoned Inoperable Vehicle/NA record, with
 * an InspectionResultSubmitAfter event. 
 */

copyParcelGisObjects();

//Start Script 18 - Create and Schedule Re-Inspection
var serviceArea;
var autoInspector; 

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
serviceArea = "Public Service Zones-" + serviceArea;
autoInspector = lookup("USER_DISTRICTS", serviceArea);

if(autoInspector == "No Inspector") {
	autoInspector = "CHOLLIFIELD";
}

if(inspType == "AIV Re-Inspection" && inspResult == "In Violation Send Letter") {
	addAdHocTask("ADHOC_WORKFLOW", "AIV: Letter Notice", "");
}
	
if(inspType == "AIV Initial Inspection" && inspResult == "In Violation") {
	scheduleInspectDate("AIV Re-Inspection", nextWorkDay(dateAdd(null, 6)), autoInspector, "", "Scheduled by Script.");
	closeTask("Initial Inspection", "In Violation", "Scheduled by Script", "Scheduled by Script.");
	activateTask("Re-Inspection");
	updateTask("Re-Inspection", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
}

if(inspType == "AIV Initial Inspection" && inspResult == "In Violation Send Letter") {
	updateAppStatus("In Violation Send Letter", "Updated by Script.");
	closeTask("Initial Inspection", "In Violation Send Letter", "Scheduled by Script.", "Scheduled by Script.");
	activateTask("Letter Notice");
	//addAdHocTask("ADHOC_WORKFLOW", "AIV: Letter Notice", "");
	updateTask("Letter Notice", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
	//updateTask("AIV: Letter Notice", "Under Review", "", "");
} 
//End Script 18


//Start Script 16 - Update Service Request parent Status
if(inspType == "AIV Initial Inspection" && inspResult == "No Violation") {
	checkRelatedAndCloseSR();
	updateAppStatus("Completed", "Updated by Script.");
	closeTask("Initial Inspection", "No Violation", "Scheduled by Script", "Scheduled by Script.");
	activateTask("Case Closed");
	closeTask("Case Closed", "No Violation", "Scheduled by Script", "Scheduled by Script.");
}

if(inspType == "AIV Re-Inspection" && inspResult == "Violation Corrected") {
	checkRelatedAndCloseSR();
	updateAppStatus("Completed", "Updated by Script.");
	closeTask("Re-Inspection", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
	activateTask("Case Closed");
	closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
}

if(inspType == "AIV Re-Inspection" && inspResult == "Vehicle Towed") {
	checkRelatedAndCloseSR();	
	updateAppStatus("Closed - Towed", "Updated by Script.");
	closeTask("Re-Inspection", "Towed", "Scheduled by Script", "Scheduled by Script.");
	activateTask("Case Closed");
	closeTask("Case Closed", "Towed", "Scheduled by Script", "Scheduled by Script.");
}

if(inspType == "AIV Initial Inspection" && inspResult == "Vehicle Towed") {
	checkRelatedAndCloseSR();
	updateAppStatus("Closed - Towed", "Updated by Script.");
	closeTask("Initial Inspection", "Towed", "Scheduled by Script", "Scheduled by Script.");
	activateTask("Case Closed");
	closeTask("Case Closed", "Towed", "Scheduled by Script", "Scheduled by Script.");
}
//End Script 16