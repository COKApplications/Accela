/**
 * The below code is related to the ServiceRequest/Water - Quality Inspection/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
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
		var dupeList = getFilteredRecords(capList, appTypeString, new Array("Assigned To Dept"), 2);
		
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
		//Start Script 32
		var databaseName = lookup("COK_Database_Name", "Database_Name");
		var alternateId = capId.getCustomID();
		var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/ENG/STORM/NA/NA/NA");
		var emailSubject = "A new Water - Quality Inspection Service Request has been added. " + alternateId;
		var natureofrequest = workDescGet(capId);
		var qualityIssue = AInfo["What is the water quality issue?"];
		var exactLocation = AInfo["Describe Exact Location:"];
		var timeObserved = AInfo["Describe Time Observed:"];
		var materialSpill = AInfo["Is this a hazardous material spill?"];
		var exactIssue = AInfo["If other issue, describe exact issue in detail."];
		var firstTime = AInfo["Is this the first time or have you called before with this problem?"];
		var reoccuringSpillDischarge = AInfo["If reoccurring; when, how often and estimate the amount of spill or discharge."];
		var utilityAgency = AInfo["If sewage, which utility agency provides your service?"];
		var contactedAgency = AInfo["If sewage and utility agency is known, have you contacted them?"];
		var locationInfo = "";
		var contactInfo = "";
		var capAddResult = aa.address.getAddressByCapId(capId);
		var contactArray = getContactArray();
		var emailBody = "";
		var Intersection = AInfo["Intersection"];

		if(isEmpty(Intersection)) {
			Intersection = "No Intersection";
		}

		if(isEmpty(natureofrequest)) {
			natureofrequest = "<< No information provided by caller. >>";
		}

		if(isEmpty(qualityIssue)) {
			qualityIssue = "<< No information provided by caller. >>";
		}

		if(isEmpty(exactLocation)) {
			exactLocation = "<< No information provided by caller. >>";
		}

		if(isEmpty(timeObserved)) {
			timeObserved = "<< No information provided by caller. >>";
		}

		if(isEmpty(materialSpill)) {
			materialSpill = "<< No information provided by caller. >>";
		}

		if(isEmpty(exactIssue)) {
			exactIssue = "<< No information provided by caller. >>";
		}

		if(isEmpty(firstTime)) {
			firstTime = "<< No information provided by caller. >>";
		}

		if(isEmpty(reoccuringSpillDischarge)) {
			reoccuringSpillDischarge = "<< No information provided by caller. >>";
		}

		if(isEmpty(utilityAgency)) {
			utilityAgency = "<< No information provided by caller. >>";
		}

		if(isEmpty(contactedAgency)) {
			contactedAgency = "<< No information provided by caller. >>";
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

			//2018-01 - added unit information to email

			var unitType = addrArray[0].getUnitType();
			var unitStart = addrArray[0].getUnitStart();

			var unitInfo;

			if(isEmpty(unitType)) {
				unitInfo = "";
			}else{
				unitInfo = unitType + " " + unitStart + " - ";
			}

			locationInfo = hseNum + " " + streetDir + " " + streetName + " " + streetSuffix + " " + unitInfo + " " + streetCity + " " + streetState + " " + streetZip;
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
		"What is the nature of the request - " + natureofrequest + "<br>" + "<br>" +
		"What is the water quality issue? - " + qualityIssue + "<br>" + "<br>" +
		"Describe Exact Location: - " + exactLocation + "<br>" + "<br>" +
		"Describe Time Observed: - " + timeObserved + "<br>" + "<br>" +
		"Is this a hazardous material spill? - " + materialSpill + "<br>" + "<br>" +
		"If other issue, describe exact issue in detail. - " + exactIssue + "<br>" + "<br>" +
		"Is this the first time or have you called before with this problem? - " + firstTime + "<br>" + "<br>" +
		"If reoccurring; when, how often and estimate the amount of spill or discharge. - " + reoccuringSpillDischarge + "<br>" + "<br>" +
		"If sewage, which utility agency provides your service? - " + utilityAgency + "<br>" + "<br>" +
		"If sewage and utility agency is known, have you contacted them? - " + contactedAgency + "<br>" + "<br>" +
		"Location - " + locationInfo + "<br>" + "<br>" + 
		"Citizen Contact Information:" + "<br>" + 
		contactInfo  + "<br>" + "<br>" + 
		"City of Knoxville Reference Number - " + alternateId + 
		"</html>";

		//SR email send moved down in code to pick up SW INV record ID and inspector
		//send SR email to group
		//email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);

		//showMessage = true;
		//comment("Email sent after SR created");
		//End Script 32

		//Start Script 09 - Create Stormwater Investigation Record
		var parentPriority = capDetail.getPriority();
		var childId = createChild("Enforcement","Stormwater","Investigation","NA");
		var serviceInfo = "311 Service Request Type - " + "Water - Quality Inspection" + "\r" +
		"What is the nature of the request? - " + natureofrequest + "\r" +
		"What is the water quality issue? - " + qualityIssue + "\r" +
		"Describe Exact Location: - " + exactLocation + "\r" +
		"Describe Time Observed: - " + timeObserved + "\r" +
		"Is this a hazardous material spill? - " + materialSpill + "\r" +
		"If other issue, describe exact issue in detail. - " + exactIssue + "\r" +
		"Is this the first time or have you called before with this problem? - " + firstTime + "\r" +
		"If reoccurring; when, how often and estimate the amount of spill or discharge. - " + reoccuringSpillDischarge + "\r" +
		"If sewage, which utility agency provides your service? - " + utilityAgency + "\r" +
		"If sewage and utility agency is known, have you contacted them? - " + contactedAgency;

		//copyGisObjectsToChild(childId);
		updateAppStatus("Under Review", "Updated by Script.", childId);
		editPriority(parentPriority, childId);
		copyOwner(capId, childId);
		copyAssets(cap, childId);

		editAppSpecific("IncidentType", "Water - Quality Inspection", childId);
		editAppSpecific("311 Service Request Info", serviceInfo, childId);
		childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
		var detailedDescription = "Water - Quality Inspection" ;
		var setDescription = updateWorkDesc(detailedDescription,childId);
		editAppSpecific("Service Area", childserviceArea, childId);
		childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
		editAppSpecific("Council District", childCouncilDistrict, childId);
		childIntersection = getGISIdForLayer("Intersection");
		editAppSpecific("Intersection", childIntersection, childId); 
		editAppSpecific("Source", "311", childId); 
		assignCapToDept ("KNOXVILLE/KNOX/ENG/STORM/NA/NA/NA",childId);

		// Service Request Assign Watershed based on address
		watershed = getGISInfo("KGIS", "Watershed Boundary", "BASIN_NAME");
		editAppSpecific("Watershed", watershed,childId);
		//

		//Update Incident Type as Sinkhole Cave-In Inspection
		editAppSpecific("Incident Type", "Water - Quality Inspection",childId);
		//
		//End Script 09

		//Start Script 17 - Create and Schedule Initial Inspection
		var autoInspector; 
		swdistrict = getGISInfo("KGIS", "SWM Zones", "DISTRICT_ID");
		swdistrict = "SW Districts-" + swdistrict;
		autoInspector = lookup("USER_DISTRICTS", swdistrict);
		if(autoInspector == "No Inspector") {
			autoInspector = "GLOWE";
		}

		assignCap(autoInspector, childId);
		assignCap(autoInspector);
		var parentId = capId;
		capId = childId;
		var CHILD_ALT_ID = childId.getCustomID();
		scheduleInspectDate("SW Inspection", nextWorkDay(dateAdd(null, -1)), autoInspector, "", "Scheduled by Script.");
		updateTask("Assign Inspection", "Completed","Updated by Script.", "")
		deactivateTask("Assign Inspection");
		activateTask("Inspection");;
		updateAppStatus("In Queue", "Updated by Script.", childId); 
		capId = parentId;
		//End Script 17

		var v_system = "avprod";
		if(databaseName != "AAPROD") {
			v_system = "avdev";
		}

		//from Script 32 - send SR email to group - moved here to pick up SW INV number and inspector
		//emailTo and emailSubject were determined up above - add SW INV info to end of emailBody

		emailBody = emailBody + "<html>Stormwater Investigation Number: " + CHILD_ALT_ID +
		"<br>" + 
		"Assigned to: " + autoInspector + "<br>" + 
		"<a href=https://" + v_system + ".city.knoxvilletn.gov/portlets/reports/adHocReport.do?mode=deepLink&reportCommand=recordDetail&altID=" + CHILD_ALT_ID + " target=_blank>Record Detail for: " + CHILD_ALT_ID + "</a>"  + "<br>" +
		"(Only available for logged in user)<br><br></html>";

		email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
		
		//email inspector assigned to SW Investigation
		//reset emailTo and emailSubject
		
		var emailTo = autoInspector + "@knoxvilletn.gov";
		//comment("emailTo: " + emailTo);
		var emailSubject = "You have been assigned a Stormwater Investigation for a Water - Quality Inspection Service Request. " + CHILD_ALT_ID;

		if(databaseName != "AAPROD") {
			emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
			emailSubject = "**This is a test** " + emailSubject;
		}

		email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
		//comment("Email sent after SW INV created");
		
	//end of check for empty dupeList
	}
}
//End Script 01
