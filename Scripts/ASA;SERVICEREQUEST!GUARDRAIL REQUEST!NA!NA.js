/**
 * The below code is related to the ServiceRequest/Guardrail Request/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

var other = AInfo["If Other, describe details"];
showMessage = true;
comment("Other=" + other);

copyParcelGisObjects();serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);
assignCapToDept ("KNOXVILLE/KNOX/ENG/TRAFFIC/OPERATNS/NA/NA",capId);

//Start Script 01
var addrsObj = aa.address.getAddressByCapId(capId);
if(addrsObj.getSuccess() ) {
	var addrs = addrsObj.getOutput();
	if(addrs[0] != null){
		var addrId = addrs[0].getUID();
		//get cap List
		var capList = getRecordsByAddressIdBuffer(addrId,"KGIS","Parcels","PARCELID","60");
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
	
}
//End Script 01
if(isEmpty(dupeList) == true) {
		//Start Script 09 - Create Traffic Engineering Investigation Record
		var myArray = [[workDescGet(capId)], 
		               [AInfo["Is there a specific maintenance issue with any of the following?"]],
		               [AInfo["If Other, describe details"]]];
		var childId = createChild("Enforcement","Traffic Engineering","Investigation","NA");
		var parentPriority = capDetail.getPriority();
		var serviceInfo = "";

		//copyGisObjectsToChild(childId);
		updateAppStatus("Under Review", "Updated by Script.", childId);
		editPriority(parentPriority, childId);
		copyOwner(capId, childId);

	        for(i=0; i<myArray.length; i++) {
		     serviceInfo = serviceInfo + myArray[i,i] + "\r";
		}
                editAppSpecific("311 Service Request Type", "Guard Rail Request", childId);
		editAppSpecific("311 Service Request Info", serviceInfo, childId);
                childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
                var detailedDescription = "Guard Rail Request" ;
               var setDescription = updateWorkDesc(detailedDescription,childId);
               childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
               editAppSpecific("Service Area", childserviceArea, childId);
                childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
                editAppSpecific("Council District", childCouncilDistrict, childId);
    		childIntersection = getGISIdForLayer("Intersection");
		editAppSpecific("Intersection", childIntersection, childId); 
		editAppSpecific("Source of Call", "311", childId); 
                assignCapToDept ("KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA",childId);

		//End Script 09

	}
