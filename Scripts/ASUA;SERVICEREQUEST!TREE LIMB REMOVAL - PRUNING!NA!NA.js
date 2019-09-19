/**
 * The below code is related to the ServiceRequest/Tree Limb Removal - Pruning/NA/NA record, with
 * an ApplicationStatusUpdateAfter event. 
 */

if(appStatus == "Assigned To Dept") {
	//Start Script 07 - Create Pruning Work Order
	var myArray = [["What is the nature of the request?: ", workDescGet(capId)], 
	               ["Where is the location of overgrowth of tree limbs?: ", AInfo["Where is the location of overgrowth of tree limbs?"]], 
	               ["Is tree or limb causing a traffic problem?: ", AInfo["Is tree or limb causing a traffic problem?"]],
	               ["Does a tree on city property need maintenance?: ", AInfo["Does a tree on city property need maintenance?"]],
	               ["Does the tree need to be inspected for safety concerns?: ", AInfo["Does the tree need to be inspected for safety concerns?"]],
	               ["Where is the TRUNK of the tree located?: ", AInfo["Where is the TRUNK of the tree located?"]],
	               ["Are you the owner of the property of where the tree is located?: ", AInfo["Are you the owner of the property of where the tree is located?"]],
	               ["Is this an internal request?: ", AInfo["Is this an internal request?"]],
	               ["If yes, which organization originated the request?: ", AInfo["If yes, which organization originated the request?"]]]; 
	var childId = createChild("AMS", "Work Order", "Public Service", "NA");
	var serviceInfo = "";
	var parentPriority = capDetail.getPriority();
	
	copyAssets(cap, childId);

	if((AInfo["Is tree or limb causing a traffic problem?"] == "Fallen - Blocking Traffic") || (AInfo["Is tree or limb causing a traffic problem?"] == "Blocking Traffic Control Device / Sign")) {
		editAppSpecific("Work Order Type", "PS36 Tree Emergency", childId);
		editPriority("Emergency", childId);
	} else if((AInfo["Is tree or limb causing a traffic problem?"] == "Striking Passing Vehicles") || (AInfo["Is tree or limb causing a traffic problem?"] == "Interfering with Vehicle Sight Distance")) {
		editAppSpecific("Work Order Type", "PS21 Tree Pruning", childId);
		editPriority("Urgent", childId);
	} else {
		editAppSpecific("Work Order Type", "PS21 Tree Pruning", childId);
		editPriority(parentPriority, childId);
	}
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
	copyGisObjectsToChild(childId);
	copyOwner(capId, childId);
	//End Script 07


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

	if((AInfo["Is tree or limb causing a traffic problem?"] == "Fallen - Blocking Traffic") || (AInfo["Is tree or limb causing a traffic problem?"] == "Blocking Traffic Control Device / Sign")) {
		workOrderType = "PS36 Tree Emergency"
	} else {
		workOrderType = "PS21 Tree Pruning"
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
        childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
        editAppSpecific("Service Area", childserviceArea, childId);
        childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
        editAppSpecific("Council District", childCouncilDistrict, childId);


	//End Script 29


	//Start Script 32
	var databaseName = lookup("COK_Database_Name", "Database_Name");
	var alternateId = capId.getCustomID();
	var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/PS/HORTICUL/NA/NA/NA");
	var emailSubject = "A new Tree Limb Removal - Pruning Service Request has been added. " + alternateId;
	var natureOfRequest = workDescGet(capId);
	var locationOvergrowth = AInfo["Where is the location of overgrowth of tree limbs?"];
	var trafficProblem = AInfo["Is tree or limb causing a traffic problem?"];
	var needMaintenance = AInfo["Does a tree on city property need maintenance?"];
	var safetyConcerns = AInfo["Does the tree need to be inspected for safety concerns?"];
	var trunkLocation = AInfo["Where is the TRUNK of the tree located?"];
	var isOwner = AInfo["Are you the owner of the property of where the tree is located?"];
	var internalRequest = AInfo["Is this an internal request?"];
	var organizationOrigination = AInfo["If yes, which organization originated the request?"];
	var locationInfo = "";
	var contactInfo = "";
        var Intersection = AInfo["Intersection"];
	var capAddResult = aa.address.getAddressByCapId(capId);
	var contactArray = getContactArray();
	var emailBody = "";

	if(isEmpty(natureOfRequest)) {
		natureOfRequest = "<< No information provided by caller. >>";
	}

	if(isEmpty(locationOvergrowth)) {
		locationOvergrowth = "<< No information provided by caller. >>";
	}

	if(isEmpty(trafficProblem)) {
		trafficProblem = "<< No information provided by caller. >>";
	}

	if(isEmpty(needMaintenance)) {
		needMaintenance = "<< No information provided by caller. >>";
	}

	if(isEmpty(safetyConcerns)) {
		safetyConcerns = "<< No information provided by caller. >>";
	}

	if(isEmpty(trunkLocation)) {
		trunkLocation = "<< No information provided by caller. >>";
	}

	if(isEmpty(isOwner)) {
		isOwner = "<< No information provided by caller. >>";
	}

	if(isEmpty(internalRequest)) {
		internalRequest = "<< No information provided by caller. >>";
	}

	if(isEmpty(organizationOrigination)) {
		organizationOrigination = "<< No information provided by caller. >>";
	}

	if(isEmpty(Intersection)) {
		Intersection = "No Intersection";
	}

	if(capAddResult.getSuccess()) {
		var addrArray = new Array();
		var addrArray = capAddResult.getOutput();
		
		if(addrArray.length==0 || addrArray==undefined) {
			logDebug("The current CAP has no address.")
		}
	 
		var hseNum = addrArray[0].getHouseNumberStart();
		var streetDir = addrArray[0].getStreetDirection();  
		var streetName = addrArray[0].getStreetName();
		var streetSuffix = addrArray[0].getStreetSuffix();
		var streetCity = addrArray[0].getCity();
		var streetState = addrArray[0].getState();
		var streetZip = addrArray[0].getZip();

		if(isEmpty(streetDir)) {
			streetDir = "";
		}

		locationInfo = hseNum + " " + streetDir + " " + streetName + " " + streetSuffix + " " + streetCity + " " + streetState + " " + streetZip;
	}

	if(Intersection != "No Intersection") {
	    locationInfo = locationInfo + "<br>" + "Intersection - " + Intersection
        }

	for(ca in contactArray) {
		var thisContact = contactArray[ca];
	    
		if(thisContact["contactType"] == "Citizen") {
			var contactBusinessPhone = thisContact["phone1"];
			var contactMobilePhone = thisContact["phone2"];
			var contactHomePhone = thisContact["phone3"];
			var contactFName = thisContact["firstName"];
			var contactMName = thisContact["middleName"];
			var contactLName = thisContact["lastName"];
			var contactFullName = thisContact["fullName"];
			var contactFullAddress = thisContact["fullAddress"];
			var contactEmailAddress = thisContact["email"];
			var contactAddressLine1 = thisContact["addressLine1"];
			var contactAddressLine2 = thisContact["addressLine2"];
			var contactCity = thisContact["city"];
			var contactState = thisContact["state"];
			var contactZip = thisContact["zip"];

			if(isEmpty(contactFName)) {
				contactFName = "<< Nothing on record. >>";
			}
			
			if(isEmpty(contactMName)) {
				contactMName = "<< Nothing on record. >>";
			}
			
			if(isEmpty(contactLName)) {
				contactLName = "<< Nothing on record. >>";
			} 
			
			if(isEmpty(contactFullName)) {
				contactFullName = contactFName + " " + contactLName;
			}
			
			if(isEmpty(contactBusinessPhone)) {
				contactBusinessPhone = "<< Nothing on record. >>";
			}
			
			if(isEmpty(contactMobilePhone)) {
				contactMobilePhone = "<< Nothing on record. >>";
			}
			
			if(isEmpty(contactHomePhone)) {
				contactHomePhone = "<< Nothing on record. >>";
			}
			
			if(isEmpty(contactFullAddress)) {
				contactFullAddress = "<< Nothing on record. >>";
			}

			if(isEmpty(contactEmailAddress)) {
				contactEmailAddress = "<< Nothing on record. >>";
			}
			
			if(isEmpty(contactAddressLine1)) {
				contactAddressLine1 = "<< Nothing on record. >>";
			}
			
			if(isEmpty(contactAddressLine2)) {
				contactAddressLine2 = "<< Nothing on record. >>";
			}
			
			if(isEmpty(contactCity)) {
				contactCity = "<< Nothing on record. >>";
			}
			
			if(isEmpty(contactState)) {
				contactState = " ";
			}
			
			if(isEmpty(contactZip)) {
				contactZip = " ";
			}
			
			contactInfo = "Contact Name = " + contactFullName +  "<br>" + 
						"Contact Business Phone = " + contactBusinessPhone + "<br>" + 
						"Contact Home Phone = " + contactHomePhone + "<br>" + 
						"Contact Mobile Phone = " + contactMobilePhone + "<br>" +
						"Contact Email = " + contactEmailAddress + "<br>" +
						"Contact Address 1 = " + contactAddressLine1 + "<br>" +
						"Contact Address 2 = " + contactAddressLine2 + "<br>" +
						"Contact City, State, Zip = " + contactCity + ", " + contactState + " " + contactZip + "<br>";
		}
	}

	if(databaseName != "AAPROD") {
		emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
		emailSubject = "**This is a test** " + emailSubject;
	}

	emailBody = "<html>" + 
	"The City Of Knoxville 311 Call Center has received a call regarding the following:" + "<br>" + "<br>" +
	"What is the nature of the request? - " + natureOfRequest + "<br>" + "<br>" +
	"Where is the location of overgrowth of tree limbs? - " + locationOvergrowth + "<br>" + "<br>" +
	"Is tree or limb causing a traffic problem? - " + trafficProblem + "<br>" + "<br>" +
	"Does a tree on city property need maintenance? - " + needMaintenance + "<br>" + "<br>" +
	"Does the tree need to be inspected for safety concerns? - " + safetyConcerns + "<br>" + "<br>" +
	"Where is the TRUNK of the tree located? - " + trunkLocation + "<br>" + "<br>" +
	"Are you the owner of the property of where the tree is located? - " + isOwner + "<br>" + "<br>" +
	"Is this an internal request? - " + internalRequest + "<br>" + "<br>" +
	"If yes, which organization originated the request? - " + organizationOrigination + "<br>" + "<br>" +
	"Location - " + locationInfo + "<br>" + "<br>" + 
	"Citizen Contact Information:" + "<br>" + 
	contactInfo  + "<br>" + "<br>" + 
	"City of Knoxville Reference Number - " + alternateId + 
	"</html>";

	email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
	//End Script 32
}