/**
 * The below code is related to the ServiceRequest/Lot Complaint/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

//Start Script 01
var addrsObj = aa.address.getAddressByCapId(capId);
if(addrsObj.getSuccess() ) {
	var addrs = addrsObj.getOutput();
	if(addrs[0] != null){
		var addrId = addrs[0].getUID();
		//get cap List
		var capList = getRecordsByAddressIdBuffer(addrId,"KGIS","Parcels","PARCELID","-10");
		//filter duplicates
		var dupeList = getFilteredRecords(capList, appTypeString, new Array("Assigned To Dept"), 30);
		
		//display possible duplicates
		for(var x in dupeList){
			showMessage=true;
			comment("Possible Duplicate: " + dupeList[x]);
		}
	}
	
	if(isEmpty(dupeList) == false) {
		updateAppStatus("Potential Duplicate", "Updated by Script.");
	}
	
	if(isEmpty(dupeList) == true) {
		//Start Script 09 - Create Lot Record
		var myArray = [["What is the nature of the request?: ", workDescGet(capId)], 
		               ["Dirty / Trash / Debris: ", AInfo["Dirty / Trash / Debris"]],
		               ["Overgrown: ", AInfo["Overgrown"]],
		               ["Brush / Leaves: ", AInfo["Brush / Leaves"]],
		               ["Bulky Waste: ", AInfo["Bulky Waste"]],
		               ["Garbage / Recycling Violations: ", AInfo["Garbage / Recycling Violations"]],
		               ["House Cleanout: ", AInfo["House Cleanout"]],
		               ["Illegal Dumping: ", AInfo["Illegal Dumping"]],
		               ["Outside Storage: ", AInfo["Outside Storage"]],
		               ["Other: ", AInfo["Other"]],
		               ["Could you please describe location of trash items in detail?: ", AInfo["Could you please describe location of trash items in detail?"]]];
		var childId = createChild("Enforcement","Codes Enforcement","Dirty Lot","NA");
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
                var setDescription = updateWorkDesc(serviceInfo,childId);

		childIntersection = getGISIdForLayer("Intersection");
		editAppSpecific("Intersection", childIntersection, childId); 

               // help desk #34836 Parcel needs to be in work desc so it can be seen on app
               var detailedDescription =  serviceInfo;
               seeParcel = getGISInfo2("KGIS", "Parcels", "PARCELID", -10, "feet");
               detailedDescription = "Parcel=" + seeParcel + " " + detailedDescription;
               var setDescription = updateWorkDesc(detailedDescription,childId);


		//End Script 09


		//Start Script 17 - Create and Schedule Initial Inspection
		var serviceArea;
		var autoInspector; 

		copyParcelGisObjects();serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
		serviceArea = "Public Service Zones-" + serviceArea;
		autoInspector = lookup("USER_DISTRICTS", serviceArea);

		if(autoInspector != "No Inspector") {
			scheduleInspectDateChild("LOT Initial Inspection", nextWorkDay(), autoInspector, "", "Scheduled by Script.");
		}

		if(autoInspector == "No Inspector") {
			autoInspector = lookup("COK_Default_Inspectors", "CODES ENFORCEMENT");		}

		assignCap(autoInspector, childId);
		//End Script 17
	}
}
//End Script 01