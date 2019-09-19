if(appStatus == "Assigned To Dept") {
		//Start Script 09 - Create Traffic Engineering Investigation Record
		var myArray = [[workDescGet(capId)], 
		               [AInfo["Is there a specific maintenance issue with any of the following?"]],
		               [AInfo["If 'Other', describe details."]]];
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
                editAppSpecific("311 Service Request Type:", "Guard Rail Request", childId);
		editAppSpecific("311 Service Request Info:", serviceInfo, childId);
                childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
                var detailedDescription = "Guard Rail Request" ;
               var setDescription = updateWorkDesc(detailedDescription,childId);
               childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
               editAppSpecific("Service Area", childserviceArea, childId);
                childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
                editAppSpecific("Council District", childCouncilDistrict, childId);
    		childIntersection = getGISIdForLayer("Intersection");
		editAppSpecific("Intersection", childIntersection, childId); 
		editAppSpecific("Source of Call:", "311", childId); 
                assignCapToDept ("KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA",childId);

		//End Script 09

	}