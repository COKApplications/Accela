/**
 * The below code is related to the ServiceRequest/ROW Obstruction Inspection/NA/NA record, with
 * an ApplicationStatusUpdateAfter event. 
 */

if(appStatus == "Assigned To Dept") {
	//Start Script 10 - Create ROW Record
	var myArray = [["What is the nature of the request?: ", workDescGet(capId)], 
	               ["Which type of obstruction are you reporting?: ", AInfo["Which type of obstruction are you reporting?"]]];
	var childId = createChild("Enforcement","Codes Enforcement","ROW Obstruction","NA");
	var parentPriority = capDetail.getPriority();
	var serviceInfo = "";

	copyGisObjectsToChild(childId);
	updateAppStatus("Under Review", "Updated by Script.", childId);
	editPriority(parentPriority, childId);
	copyOwner(capId, childId);

	for(i=0; i<myArray.length; i++) {
	     serviceInfo = serviceInfo + myArray[i,i] + "\r";
	}

	editAppSpecific("Service Request Information", serviceInfo, childId);
        childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
        editAppSpecific("Service Area", childserviceArea, childId);
        childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
        editAppSpecific("Council District", childCouncilDistrict, childId);
	childIntersection = getGISIdForLayer("Intersection");
	editAppSpecific("Intersection", childIntersection, childId); 

        // help desk #34836 Parcel needs to be in work desc so it can be seen on app
        var detailedDescription =  serviceInfo;
        seeParcel = getGISInfo2("KGIS", "Parcels", "PARCELID", -10, "feet");
        detailedDescription = "Parcel=" + seeParcel + " " + detailedDescription;
        var setDescription = updateWorkDesc(detailedDescription,childId);

	//End Script 10


	//Start Script 17 - Create and Schedule Initial Inspection
	var serviceArea;
	var autoInspector; 

	serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
	serviceArea = "Public Service Zones-" + serviceArea;
	autoInspector = lookup("USER_DISTRICTS", serviceArea);

	if(autoInspector != "No Inspector") {
		scheduleInspectDateChild("ROW Initial Inspection", nextWorkDay(), autoInspector, "", "Scheduled by Script.");
	}

	if(autoInspector == "No Inspector") {
		autoInspector = "CHOLLIFIELD";
	}

	assignCap(autoInspector, childId);
	//End Script 17
}