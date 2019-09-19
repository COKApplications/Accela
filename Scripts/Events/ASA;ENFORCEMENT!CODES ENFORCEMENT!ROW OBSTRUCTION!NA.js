/**
 * The below code is related to the Enforcement/Codes Enforcement/ROW Obstruction/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);
setSingleAddressToPrimary(capId);

//Start Script 14 - Create ROW Parent Record
var detailedDescription = workDescGet(capId);
var myArray = [["Detailed Description: ", detailedDescription],
               ["Basketball Goal: ", AInfo["Basketball Goal"]],
               ["Fence: ", AInfo["Fence"]],
               ["Building: ", AInfo["Building"]],
               ["Other: ", AInfo["Other"]],
               ["Location: ", AInfo["Location"]]];
var parentId = createParent("ServiceRequest","ROW Obstruction Inspection","NA","NA");
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

//End Script 14


//Start Script 17 - Create and Schedule Initial Inspection
var serviceArea;
var autoInspector; 

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
serviceArea = "Public Service Zones-" + serviceArea;
autoInspector = lookup("USER_DISTRICTS", serviceArea);

if(autoInspector != "No Inspector") {
	scheduleInspectDate("ROW Initial Inspection", nextWorkDay(), autoInspector, "", "Scheduled by Script.");
}

if(autoInspector == "No Inspector") {
	autoInspector = "CHOLLIFIELD";
}

assignCap(autoInspector);
assignCap(autoInspector, parentId);
//End Script 17

// help desk #34836 Parcel needs to be in work desc so it can be seen on app
var seeDescription = workDescGet(capId);
seeParcel = getGISInfo2("KGIS", "Parcels", "PARCELID", -10, "feet");
seeDescription = "Parcel=" + seeParcel + " " + seeDescription;
var setDescription = updateWorkDesc(seeDescription);
