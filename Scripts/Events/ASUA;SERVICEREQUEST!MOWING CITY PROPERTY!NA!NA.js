/**
 * The below code is related to the ServiceRequest/Mowing City Property/NA/NA record, with
 * an ApplicationStatusUpdateAfter event. 
 */

	
if(appStatus == "Assigned To Dept") {
		//Start Script PS09 Mowing City Property
		var myArray = [["What is the nature of the request?: ", workDescGet(capId)], 
		               ["Where is the overgrowth that needs mowing?: ", AInfo["Where is the overgrowth that needs mowing?"]], 
		               ["Is the overgrowth causing a sight distance problem?: ", AInfo["Is the overgrowth causing a sight distance problem?"]],
		               ["Is this an internal request?: ", AInfo["Is this an internal request?"]],
		               ["If Yes, which organization originated the request?: ", AInfo["If Yes, which Organization originated the request?"]]]; 
		var childId = createChild("AMS", "Work Order", "Public Service", "NA");
		var serviceInfo = "";
		var parentPriority = capDetail.getPriority();copyGisObjectsToChild(childId);

		copyAssets(cap, childId);

		editAppSpecific("Work Order Type", "PS09 Mowing City Property", childId);
                childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
                editAppSpecific("Service Area", childserviceArea, childId);
                childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
                editAppSpecific("Council District", childCouncilDistrict, childId);

                copyParcelGisObjectsChild();
                childIntersection = AInfo["Intersection"]; 
                editAppSpecific("Intersection", childIntersection, childId); 

		for(i=0; i<myArray.length; i++) {
		     serviceInfo = serviceInfo + myArray[i,i] + "\r";
		}

		editAppSpecific("Service Request Information", serviceInfo, childId);
		copyParcelGisObjects();
		copyOwner(capId, childId);
		editPriority(parentPriority, childId);
		//End Script 06


		//Start Script 30 - Update Source of Call
		var sourceOfCall = AInfo["If yes, which organization originated the request?"];

		if(isEmpty(sourceOfCall)) {
			editAppSpecific("Source of Call", "Call Center", childId);
		} else {
			editAppSpecific("Source of Call", sourceOfCall, childId);
		}
		//End Script 30


		//Start Script 03 - Update Department
		var workOrderType;
		var serviceArea;
		var assignedDepartment;
		var foreman;

		workOrderType = "PS09 Mowing City Property"
		copyParcelGisObjects();serviceArea = getGISInfo("KGIS","Public Service Zones","Zone_");
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

		if(foreman != "No Assignment") {
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
		editAppSpecific("Work Center", workCenter, childId);
		var setDescription = updateWorkDesc(workOrderType,childId);
		//End Script 29

}