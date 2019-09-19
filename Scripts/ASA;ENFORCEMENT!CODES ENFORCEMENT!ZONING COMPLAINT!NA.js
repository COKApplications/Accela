/**
 * The below code is related to the Enforcement/Codes Enforcement/Zoning Complaint/NA record, with
 * an ApplicationSubmitAfter event. 
 */
//Start Script 17 - Create and Schedule Initial Inspection
var autoInspector; 

autoInspector = "RMOYERS";
scheduleInspectDate("Zoning Initial Inspection", nextWorkDay(), autoInspector, "", "Scheduled by Script.");
assignCap(autoInspector);
//assignCap(autoInspector, parentId);
activateTask("Initial Inspection");
updateTask("Initial Inspection", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
//End Script 17

// help desk #34836 Parcel needs to be in work desc so it can be seen on app
var seeDescription = workDescGet(capId);
seeParcel = getGISInfo2("KGIS", "Parcels", "PARCELID", -10, "feet");
seeDescription = "Parcel=" + seeParcel + " " + seeDescription;
var setDescription = updateWorkDesc(seeDescription);
//End HD#34836

//copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);
setSingleAddressToPrimary(capId);

//Start Script 14 - Create Inspections Complaint Inquiry Parent Record
var detailedDescription = workDescGet(capId);
var myArray = [["Detailed Description: ", detailedDescription],
               ["Front Yard Parking: ", AInfo["Front Yard Parking"]],
               ["Signs: ", AInfo["Signs"]],
               ["Illegal Occupancy/Improper Zoning: ", AInfo["Illegal Occupancy/Improper Zoning"]],
               ["Storage and parking of trailers, recreational vehicles, commercial vehicles, and school buses: ", AInfo["Storage and parking of trailers, recreational vehicles, commercial vehicles, and school buses"]],
               ["Occupancy of a recreational vehicle: ", AInfo["Occupancy of a recreational vehicle"]]];
var parentId = createParent("ServiceRequest","Inspections Complaint Inquiry","NA","NA");
var childPriority = capDetail.getPriority();
var codeInfo = "";

copyParcelGisObjectsParent();
editPriority(childPriority, parentId);
copyOwner(capId, parentId);

for(i=0; i<myArray.length; i++) {
	codeInfo = codeInfo + myArray[i,i] + "\r";
}

//editAppSpecific("What is the nature of the request?", codeInfo, parentId);
//var setDescription = updateWorkDesc(codeInfo,parentId); changed nlt 1/18/16
var setDescription = updateWorkDesc(detailedDescription,parentId);

parentserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", parentserviceArea, parentId);
parentCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", parentCouncilDistrict, parentId);

updateAppStatus("Assigned To Dept", "Updated by Script.", parentId);

//End Script 14

////REMOVE FROM HERE DOWN????
////Start Script 13 - Create Inspection Complaint Parent Record
//var detailedDescription = workDescGet(capId);
//var myArray = [["Detailed Description: ", detailedDescription]];
////var parentId = createParent("ServiceRequest","Inspections Complaint","NA","NA");
////var childPriority = capDetail.getPriority();
//var codeInfo = "";

//copyParcelGisObjectsParent();
//editPriority(childPriority, parentId);
//copyOwner(capId, parentId);

//for(i=0; i<myArray.length; i++) {
//	codeInfo = codeInfo + myArray[i,i] + "\r";
//}

////var setDescription = updateWorkDesc(detailedDescription,parentId);
////parentserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
////editAppSpecific("Service Area", parentserviceArea, parentId);
////parentCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
////editAppSpecific("Council District", parentCouncilDistrict, parentId);

//End Script 13