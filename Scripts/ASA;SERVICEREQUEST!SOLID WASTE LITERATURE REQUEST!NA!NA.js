/**
 * The below code is related to the ServiceRequest/Solid Waste Literature Request/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

		//Start Script 32
		var databaseName = lookup("COK_Database_Name", "Database_Name");
		var alternateId = capId.getCustomID();
		var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/PS/ADMIN/SOLIDWST/LITERATURE/NA");
		var emailSubject = "A new Solid Waste Literature Request Service Request has been added. " + alternateId;

		var natureOfRequest = workDescGet(capId);

		var forSchool = AInfo["DO NOT ASK, but has the caller indicated that this request is for a Knox County School?"];
		var downtownRecycling = AInfo["Downtown Recycling for Business"];
		var householdHazCollect = AInfo["Household Hazardous Waste Collection Center"];
		var householdHazDisp = AInfo["Household Hazardous Wastes - Disposal and Safe Substitutes"];
		var manageFacility = AInfo["Solid Waste Management Facility"];
		var cokPSDiv = AInfo["The City of Knoxville Public Service Division"];
		var wasteWatch = AInfo["WasteWatch Newsletter"];
		var whereToTake = AInfo["Where do I take it?"];
		var howMany = AInfo["How many copies of each"];
		var specialEvent = AInfo["If special event, please describe."];
		var pickupMail = AInfo["Is the literature to be picked up or mailed?"];

		var locationInfo = "";
		var contactInfo = "";
		var contactArray = getContactArray();
		var emailBody = "";

		if(isEmpty(natureOfRequest)) {
			natureOfRequest = "<< No information provided by caller. >>";
		}

		if(isEmpty(forSchool)) {forSchool = "<< No information provided by caller. >>";}
		if(isEmpty(downtownRecycling)) {downtownRecycling = "<< No information provided by caller. >>";}
		if(isEmpty(householdHazCollect)) {householdHazCollect = "<< No information provided by caller. >>";}
		if(isEmpty(householdHazDisp)) {householdHazDisp = "<< No information provided by caller. >>";}
		if(isEmpty(manageFacility)) {manageFacility = "<< No information provided by caller. >>";}
		if(isEmpty(cokPSDiv)) {cokPSDiv = "<< No information provided by caller. >>";}
		if(isEmpty(wasteWatch)) {wasteWatch = "<< No information provided by caller. >>";}
		if(isEmpty(whereToTake)) {whereToTake = "<< No information provided by caller. >>";}
		if(isEmpty(howMany)) {howMany = "<< No information provided by caller. >>";}
		if(isEmpty(specialEvent)) {specialEvent = "<< No information provided by caller. >>";}
		if(isEmpty(pickupMail)) {pickupMail= "<< No information provided by caller. >>";}

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
		"What is the nature of the request - " + natureOfRequest + "<br>" + "<br>" +
		"DO NOT ASK, but has the caller indicated that this request is for a Knox County School? - " + forSchool + "<br>" + "<br>" +
		"Downtown Recycling for Business - " + downtownRecycling + "<br>" + "<br>" +
		"Household Hazardous Waste Collection Center - " + householdHazCollect + "<br>" + "<br>" +
		"Household Hazardous Wastes - Disposal and Safe Substitutes - " + householdHazDisp + "<br>" + "<br>" +
		"Solid Waste Management Facility - " + manageFacility + "<br>" + "<br>" +
		"The City of Knoxville Public Service Division - " + cokPSDiv + "<br>" + "<br>" +
		"WasteWatch Newsletter - " + wasteWatch + "<br>" + "<br>" +
		"Where do I take it? - " + whereToTake + "<br>" + "<br>" +
		"How many copies of each - " + howMany + "<br>" + "<br>" +
		"If special event, please describe. - " + specialEvent + "<br>" + "<br>" +
		"Is the literature to be picked up or mailed? - " + pickupMail + "<br>" + "<br>" +
		"Citizen Contact Information:" + "<br>" + 
		contactInfo  + "<br>" + "<br>" + 
		"City of Knoxville Reference Number - " + alternateId + 
		"</html>";

		email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
		//End Script 32
