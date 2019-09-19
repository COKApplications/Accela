/**
 * The below code is related to the Enforcement/Codes Enforcement/Dirty Lot/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

copyParcelGisObjects();

//Start Script 20 - Create Dirty Lot Work Order Record
var childId = "0";
var parentId = getCapId;
var parentPriority = capDetail.getPriority();

if(wfTask == "LOT: Cite to Court" && wfStatus == "Work Order") {
	if(AInfo["Clean Lot"] == "CHECKED") {
		childId = createChild("AMS", "Work Order", "Public Service", "NA");
		editAppSpecific("Work Order Type", "PS41 Dirty Lot Cleanup", childId);
	} else if(AInfo["Mow Lot"] == "CHECKED") {
		childId = createChild("AMS", "Work Order", "Public Service", "NA");
		editAppSpecific("Work Order Type", "PS42 Mow Overgrown Lot", childId);
	} else if(AInfo["Clean and Mow Lot"] == "CHECKED") {
		childId = createChild("AMS", "Work Order", "Public Service", "NA");
		editAppSpecific("Work Order Type", "PS48 Clean and Mow", childId);
	}
}

if(childId != "0") {
	copyOwner(capId, childId);
	editPriority(parentPriority, childId);
	copyGisObjectsToChild(childId);
        childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
        editAppSpecific("Service Area", childserviceArea, childId);
        childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
        editAppSpecific("Council District", childCouncilDistrict, childId);
        editAppSpecific("Source of Call", "Neighborhood Codes", childId);      

}
//End Script 20


//Start Script 24 - Create Lien Fees
if(wfTask == "Bill" && wfStatus == "Lien In Process") {
	if(balanceDue == "0") {
		addFee("CE_LATE", "CE_CODE", "FINAL", feeAmountAll(capId,"NEW"), "N");
	} else {
		addFee("CE_LATE", "CE_CODE", "FINAL", balanceDue, "N");
	}
	
	addFee("CE_FILING", "CE_CODE", "FINAL", 1, "N");
}
//End Script 24


//Start Script 03 - Update Department
var workOrderType;
var serviceArea;
var assignedDepartment;
var foreman;

if(wfTask == "LOT: Cite to Court" && wfStatus == "Work Order") {
	if(AInfo["Clean Lot"] == "CHECKED") {
		workOrderType = "PS41 Dirty Lot Cleanup";
	} else if(AInfo["Mow Lot"] == "CHECKED") {
		workOrderType = "PS42 Mow Overgrown Lot";
	} else if(AInfo["Clean and Mow Lot"] == "CHECKED") {
		workOrderType = "PS48 Clean and Mow";
	}
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

var inspectionDays = getAppSpecific("Re-Inspection Days");

if(wfTask == "LOT: Letter Notice" && wfStatus == "In Violation") {
	activateEnforcementReinspection();
	deactivateTask("LOT: Letter Notice");
	
	if(isEmpty(inspectionDays) == true) {
		scheduleInspectDate("LOT Re-Inspection", nextWorkDay(dateAdd(null, 13)), autoInspector, "", "Scheduled by Script.");
	} else if(isEmpty(inspectionDays) == false) {
		scheduleInspectDate("LOT Re-Inspection", nextWorkDay(dateAdd(null, inspectionDays - 1)), autoInspector, "", "Scheduled by Script.");
	}
}

if(wfTask == "Letter Notice" && wfStatus == "In Violation") {
	activateEnforcementReinspection();
	deactivateTask("Letter Notice");
        editTaskSpecific("Letter Notice","Date Letter Mailed",dateAdd(null,0));	
       if(isEmpty(inspectionDays) == true) {
		scheduleInspectDate("LOT Re-Inspection", nextWorkDay(dateAdd(null, 13)), autoInspector, "", "Scheduled by Script.");
	} else if(isEmpty(inspectionDays) == false) {
		scheduleInspectDate("LOT Re-Inspection", nextWorkDay(dateAdd(null, inspectionDays - 1)), autoInspector, "", "Scheduled by Script.");
	}
}

if(wfTask == "LOT: Cite to Court") {
	
	if(wfStatus == "Violation Corrected") {
		closeEnforcementCaseWorkflow("Violation Corrected");
		deactivateTask("LOT: Cite to Court");	
	}
	
	if(wfStatus == "Work Order") {
		activatePSWorkOrderTask();
		deactivateTask("LOT: Cite to Court");
	}
}
//End Script 23


//Start Script 16 - Update Service Request Parent Status
if (wfTask == "Initial Inspection" && (wfStatus == "Canceled" || wfStatus == "No Violation")) checkRelatedAndCloseSR ();
if (wfTask == "Re-Inspection" && (wfStatus == "Violation Corrected")) checkRelatedAndCloseSR ();
if (wfTask == "LOT: Cite to Court" && (wfStatus == "Violation Corrected")) checkRelatedAndCloseSR ();
if (wfTask == "PS Work Order" && (wfStatus == "Canceled" || wfStatus == "Completed")) checkRelatedAndCloseSR ();
//End Script 16


//Start Script 26 - Create Bill
if (wfTask == "PS Work Order" && wfStatus == "Completed") {
	addToSet(capId, "Lot ROW Bill Batch", "Bill Letter");
	updateTask("Bill", "Bill Owed Add Fees", "Updated by Script.", "Updated by Script.")
	editTaskSpecific("Bill", "Date of Billing", dateAdd(null, 1));
	editTaskSpecific("Bill", "Due Date", dateAdd(null, 61));
}	
//End Script 26


if (wfTask == "Bill" && wfStatus == "Violation Corrected") {
	closeTask("Case Closed", "Violation Corrected", "Updated by Script.", "Updated by Script.");
}	

if (wfTask == "Lien" && wfStatus == "Violation Corrected") {
	closeTask("Case Closed", "Violation Corrected", "Updated by Script.", "Updated by Script.");
}	

//
//Help Desk Call #35333 Workflow closed but SR not closed
// 

if (wfTask == "Case Closed" && (wfStatus == "Canceled" || wfStatus == "No Violation" || wfStatus == "Violation Corrected")) {
     checkRelatedAndCloseSR();
     deactivateTask("Case Closed");
}
if (childId > "0") {
    capId = childId;
    deactivateTask("Setup Work Order");
    activateTask("Open");
}
