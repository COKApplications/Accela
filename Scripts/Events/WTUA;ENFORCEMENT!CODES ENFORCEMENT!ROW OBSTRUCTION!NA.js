/**
 * The below code is related to the Enforcement/Codes Enforcement/ROW Obstruction/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

copyParcelGisObjects();

//Start Script 21 - Create ROW Work Order Record
var childId = "0";
var parentId = getCapId;
var parentPriority = capDetail.getPriority();

if((wfTask == "ROW: Re-Inspection" || wfTask == "ROW: Cite to Court") && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS41 Dirty Lot Cleanup", childId);
}

if(childId != "0") {
	copyOwner(capId, childId);
	editPriority(parentPriority, childId);
	copyGisObjectsToChild(childId);
        childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
        editAppSpecific("Service Area", childserviceArea, childId);
        childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
        editAppSpecific("Council District", childCouncilDistrict, childId);

}
//End Script 21


//Start Script 03 - Update Department
var workOrderType;
var serviceArea;
var assignedDepartment;
var foreman;

if((wfTask == "ROW: Re-Inspection" || wfTask == "ROW: Cite to Court") && wfStatus == "Work Order") {
	workOrderType = "PS41 Dirty Lot Cleanup";
}

serviceArea = getGISInfo("KGIS","Public Service Zones","Zone_");
assignedDepartment = lookup("WO_TYPES", workOrderType);

if(assignedDepartment == "Service Area") {
	if (serviceArea >= "100" && serviceArea <= "199") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC1/NA/NA/NA";
	} else if(serviceArea >= "200" && serviceArea <= "299") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC2/NA/NA/NA";
	} else if(serviceArea >= "300" && serviceArea <= "399") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC3/NA/NA/NA";
	} else if(serviceArea >= "400" && serviceArea <= "499") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC4/NA/NA/NA";
	} else if(serviceArea >= "500" && serviceArea <= "599") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC5/NA/NA/NA";
	} else if(serviceArea >= "600" && serviceArea <= "699") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC6/NA/NA/NA";
	}
}

foreman = lookup("COK_Public_Service_Foremen", assignedDepartment);

if(foreman != "No Assignment" && childId != "0") {
	assignCap(foreman, childId);
}

logDebug("The Work Order Type is " + workOrderType + ".");
logDebug("The Service Area is " + serviceArea + ".");
logDebug("The Department is " + assignedDepartment + ".");
logDebug("The Foreman is " + foreman + ".");
//End Script 03


//Start Script 29 - Update Work Center
var serviceArea29;
var workCenter; 

serviceArea29 = getGISInfo("KGIS", "Public Service Zones", "ZONE_");

switch(serviceArea29) {
	case "100":
		serviceArea29 = serviceArea29 + " AREA 1 (MISC)";
		break;
	case "200":
		serviceArea29 = serviceArea29 + " AREA 2 (MISC)";
		break;
	case "300":
		serviceArea29 = serviceArea29 + " AREA 3 (MISC)";
		break;
	case "400":
		serviceArea29 = serviceArea29 + " AREA 4 (MISC)";
		break;
	case "500":
		serviceArea29 = serviceArea29 + " AREA 5 (MISC)";
		break;
	case "600":
		serviceArea29 = serviceArea29 + " AREA 6 (MISC)";
		break;
	case "921":
		serviceArea29 = serviceArea29 + " SERV AREA OFFI";
		break;
	default:
		serviceArea29 = serviceArea29 + " SVC AREA " + serviceArea29;		
}

workCenter = lookup("WO_WORK_CENTERS", serviceArea29);
if(childId != "0") {
	editAppSpecific("Work Center", workCenter, childId);
	var setDescription = updateWorkDesc(workOrderType,childId);
}
//End Script 29


//Start Script 23 - Add Ad-Hoc Tasks
var serviceArea;
var autoInspector; 

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
serviceArea = "Public Service Zones-" + serviceArea;
autoInspector = lookup("USER_DISTRICTS", serviceArea);

if(autoInspector == "No Inspector") {
	autoInspector = "CHOLLIFIELD";
}

//if(wfTask == "ROW: Letter Notice" && wfStatus == "In Violation") {
//	activateEnforcementReinspection();
//	deactivateTask("ROW: Letter Notice");
//	scheduleInspectDate("ROW Re-Inspection", nextWorkDay(dateAdd(null, 13)), getInspector("ROW Initial Inspection"), "", "Scheduled by Script.");
//}

if(wfTask == "Letter Notice" && wfStatus == "In Violation") {
	activateEnforcementReinspection();
	deactivateTask("Letter Notice");
        editTaskSpecific("Letter Notice","Date Letter Mailed",dateAdd(null,0));
	scheduleInspectDate("ROW Re-Inspection", nextWorkDay(dateAdd(null, 13)), autoInspector, "", "Scheduled by Script.");
}

//if(wfTask == "Letter Notice" && wfStatus == "In Violation") {
//	activateEnforcementReinspection();
//	deactivateTask("Letter Notice");
//}

if(wfTask == "ROW: Cite to Court") {
	
	if(wfStatus == "Violation Corrected") {
		closeEnforcementCaseWorkflow("Violation Corrected");
		deactivateTask("ROW: Cite to Court");
		closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
	}
	
	if(wfStatus == "Work Order") {
		activatePSWorkOrderTask ();
		deactivateTask("ROW: Cite to Court");
	}
}
//End Script 23


//Start Script 16 - Update Service Request Parent Status
if (wfTask == "Initial Inspection" && (wfStatus == "Canceled" || wfStatus == "No Violation")) {
	checkRelatedAndCloseSR ();
	closeTask("Case Closed", "No Violation", "Scheduled by Script", "Scheduled by Script.");
}

if (wfTask == "Re-Inspection" && (wfStatus == "Violation Corrected")) {
	checkRelatedAndCloseSR ();
	closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
}

if (wfTask == "ROW: Cite to Court" && (wfStatus == "Violation Corrected")) {
	checkRelatedAndCloseSR ();
	closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
}

if (wfTask == "PS Work Order" && (wfStatus == "Canceled" || wfStatus == "Completed")) {
	checkRelatedAndCloseSR ();
	closeTask("Case Closed", "No Violation", "Scheduled by Script", "Scheduled by Script.");
}
//End Script 16


//Start Script 26 - Create Bill
if (wfTask == "PS Work Order" && wfStatus == "Completed") {
        addToSet(capId, "Lot ROW Bill Batch", "Bill Letter");
	updateTask("Bill", "Bill Owed Add Fees", "Updated by Script.", "Updated by Script.")
	editTaskSpecific("Bill", "Date of Billing", dateAdd(null, 1));
	editTaskSpecific("Bill", "Due Date", dateAdd(null, 61));
}	
//End Script 26

//
//Help Desk Call #35333 Workflow closed but SR not closed
// 

if (wfTask == "Case Closed" && (wfStatus == "Canceled" || wfStatus == "No Violation" || wfStatus == "Violation Corrected")) {
     checkRelatedAndCloseSR();
     deactivateTask("Case Closed");
}