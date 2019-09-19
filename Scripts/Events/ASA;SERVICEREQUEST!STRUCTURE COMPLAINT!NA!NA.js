/**
 * The below code is related to the ServiceRequest/Structure Complaint/NA/NA record, with
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
		var dupeList = getFilteredRecords(capList, appTypeString, new Array("Assigned To Dept", "Canceled", "Completed"), 1);
		
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
		//Start Script 11 - Create Structure Record
		var myArray = [["What is the nature of the request?: ", workDescGet(capId)], 
		               ["Is this property residential or commercial?: ", AInfo["Is this property residential or commercial?"]],
		               ["What type of structure?: ", AInfo["What type of structure?"]],
		               ["Electrical: ", AInfo["Electrical"]],
		               ["Gas: ", AInfo["Gas"]],
		               ["Graffiti: ", AInfo["Graffiti"]],
		               ["HVAC (Heating / Air): ", AInfo["HVAC (Heating / Air)"]],
		               ["Plumbing: ", AInfo["Plumbing"]],
		               ["Structural (Roof, Floor, Porch, Walls or Ceiling): ", AInfo["Structural (Roof, Floor, Porch, Walls or Ceiling)"]],
		               ["Other: ", AInfo["Other"]],
		               ["Describe additional violation and location details.: ", AInfo["Describe additional violation and location details."]],
		               ["Is the property owner-occupied, renter-occupied, vacant, or unknown?: ", AInfo["Is the property owner-occupied, renter-occupied, vacant, or unknown?"]],
		               ["If needed, can you provide access to property / violations?: ", AInfo["If needed, can you provide access to property / violations?"]]];
		var childId = createChild("Enforcement","Codes Enforcement","Structure","NA");
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

		//End Script 11


		//Start Script 17 - Create and Schedule Initial Inspection
		var serviceArea;
		var autoInspector; 

		copyParcelGisObjects();serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
		serviceArea = "Public Service Zones-" + serviceArea;
		autoInspector = lookup("USER_DISTRICTS", serviceArea);

		if(autoInspector != "No Inspector") {
			scheduleInspectDateChild("STR Initial Inspection", nextWorkDay(), autoInspector, "", "Scheduled by Script.");
		}

		if(autoInspector == "No Inspector") {
			autoInspector = "CHOLLIFIELD";
		}

		assignCap(autoInspector, childId);
		//End Script 17
	}
}
//End Script 01