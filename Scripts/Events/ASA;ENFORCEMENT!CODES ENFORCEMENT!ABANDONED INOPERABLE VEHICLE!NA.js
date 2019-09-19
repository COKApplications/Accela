/**
 * The below code is related to the Enforcement/Codes Enforcement/Abandoned Inoperable Vehicle/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);
setSingleAddressToPrimary(capId);

//Start Script 12 - Create Car Parent Record
var detailedDescription = workDescGet(capId);
var myArray = [["Detailed Description: ", detailedDescription],
               ["Vehicle Tagged: ", AInfo["Vehicle Tagged"]],
               ["Notice Posted: ", AInfo["Notice Posted"]],
               ["Mail Notice: ", AInfo["Mail Notice"]], 
               ["Notes: ", AInfo["Notes"]]];
var parentId = createParent("ServiceRequest","Abandoned Car Junk","NA","NA");
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
//End Script 12


//Start Script 17 - Create and Schedule Initial Inspection
var serviceArea;
var autoInspector; 

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
serviceArea = "Public Service Zones-" + serviceArea;
autoInspector = lookup("USER_DISTRICTS", serviceArea);

if(autoInspector != "No Inspector") {
	scheduleInspectDate("AIV Initial Inspection", nextWorkDay(), autoInspector, "", "Scheduled by Script.");
	//scheduleInspectDate("AIV Initial Inspection", nextWorkDay("11/20/2015"), autoInspector, "", "Scheduled by Script.");
}

if(autoInspector == "No Inspector") {
	autoInspector = lookup("COK_Default_Inspectors", "CODES ENFORCEMENT");
}

assignCap(autoInspector);
assignCap(autoInspector, parentId);
//End Script 17

// help desk #34836 Parcel needs to be in work desc so it can be seen on app
var seeDescription = workDescGet(capId);
seeParcel = getGISInfo2("KGIS", "Parcels", "PARCELID", -10, "feet");
seeDescription = "Parcel=" + seeParcel + " " + seeDescription;
var setDescription = updateWorkDesc(seeDescription);