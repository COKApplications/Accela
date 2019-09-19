/**
 * The below code is related to the Enforcement/Codes Enforcement/ROW Obstruction/NA record, with
 * an InspectionResultSubmitAfter event. 
 */

copyParcelGisObjects();

//Start Script 21 - Create ROW Work Order Record
var childId = "0";
var parentId = getCapId;
var parentPriority = capDetail.getPriority();

if(inspType == "ROW Re-Inspection" && inspResult == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS41 Dirty Lot Cleanup", childId);
	closeTask("Re-Inspection", "Work Order", "Scheduled by Script", "Scheduled by Script.");
	activateTask("PS Work Order");
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


//Start Script 18 - Create and Schedule Re-Inspection
var serviceArea;
var autoInspector; 

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
serviceArea = "Public Service Zones-" + serviceArea;
autoInspector = lookup("USER_DISTRICTS", serviceArea);

if(autoInspector == "No Inspector") {
	autoInspector = "CHOLLIFIELD";
}

if(inspType == "ROW Initial Inspection" && inspResult == "In Violation") {
	scheduleInspectDate("ROW Re-Inspection", nextWorkDay(dateAdd(null, 13)), autoInspector, "", "Scheduled by Script.");
	closeTask("Initial Inspection", "In Violation", "Scheduled by Script", "Scheduled by Script.");
	activateTask("Re-Inspection");
	updateTask("Re-Inspection", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
} 

if (inspType == "ROW Re-Inspection" && inspResult == "In Violation Send Letter") {
	addAdHocTask("ADHOC_WORKFLOW", "ROW: Letter Notice", "");
}

if(inspType == "ROW Initial Inspection" && inspResult == "In Violation Send Letter") {
	updateAppStatus("In Violation Send Letter", "Updated by Script.");
	closeTask("Initial Inspection", "In Violation Send Letter", "Scheduled by Script", "Scheduled by Script.");
	activateTask("Letter Notice");
	updateTask("Letter Notice", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
} 
//End Script 18


//Start Script 03 - Update Department
var workOrderType;
var serviceArea;
var assignedDepartment;
var foreman;

if(inspType == "ROW Re-Inspection" && inspResult == "Work Order") {
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
        var vworkDesc = workOrderType;
        var vinspComment = inspResultComment;
        if(isEmpty(vinspComment)) {
	vinspComment = "No Comment";
	}
        if(vinspComment != "No Comment") {
	  vworkDesc = vworkDesc + " " + vinspComment;
         }
 
//	var setDescription = updateWorkDesc(workOrderType,childId);
        var setDescription = updateWorkDesc(vworkDesc,childId);
	editAppSpecific("Source of Call", "Neighborhood Codes", childId);
}
//End Script 29


//Start Script 16 - Update Service Request parent Status
if(inspType == "ROW Initial Inspection" && inspResult == "No Violation") {
	checkRelatedAndCloseSR();
	updateAppStatus("Completed", "Updated by Script.");
	closeTask("Initial Inspection", "No Violation", "Scheduled by Script", "Scheduled by Script.");
	activateTask("Case Closed");
	closeTask("Case Closed", "No Violation", "Scheduled by Script", "Scheduled by Script.");
}

if(inspType == "ROW Re-Inspection" && inspResult == "Violation Corrected") {
	checkRelatedAndCloseSR();
	updateAppStatus("Completed", "Updated by Script.");
	closeTask("Re-Inspection", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
	activateTask("Case Closed");
	closeTask("Case Closed", "Violation Corrected", "Scheduled by Script", "Scheduled by Script.");
	deactivateTask("PS Work Order");
}

if(inspType == "ROW Re-Inspection" && inspResult == "Work Order") {
	updateAppStatus("Work Order", "Updated by Script.");
	closeTask("Re-Inspection", "Work Order", "Scheduled by Script", "Scheduled by Script.");
	activateTask("PS Work Order");
}
//End Script 16