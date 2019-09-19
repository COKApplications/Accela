/**
 * The below code is related to the SERVICEREQUEST/Parks Maintenance Request/NA/NA record, with
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
		var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/PARK/MTC/NA/NA/NA");
		var emailSubject = "A new Parks Maintenance Service Request has been added. " + alternateId;
		var natureOfRequest = workDescGet(capId);

		var isEmergency = AInfo["Is this an emergency condition that requires immediate attention?"];
		var facType = AInfo["What kind of facility?"];
		var whichBallfield = AInfo["If ball field, which ball field is it?"];
		var complaintType = AInfo["What type of complaint are you reporting?"];
		var locationDesc = AInfo["Describe Location in detail?"];
		var problemDesc = AInfo["Describe Problem in detail?"];
		var reportByKPD = AInfo["Concern reported by KPD Bike Patrol?"];
		var officerBadge = AInfo["Officer Badge No."];

		var locationInfo = "";
		var contactInfo = "";

		//comment("CAP ID: " + capId);

		var capAddResult = aa.address.getAddressByCapId(capId);

		//comment("capAddResult: " + capAddResult);

		var contactArray = getContactArray();
		var emailBody = "";
		var Intersection = AInfo["Intersection"];

		if(isEmpty(Intersection)) {
			Intersection = "No Intersection";
		}

		if(isEmpty(natureOfRequest)) {
			natureOfRequest = "<< No information provided by caller. >>";
		}
		if(isEmpty(isEmergency)) {
			isEmergency = "<< No information provided by caller. >>";
		}
		if(isEmpty(facType)) {
			facType = "<< No information provided by caller. >>";
		}
		if(isEmpty(whichBallfield)) {
			whichBallfield = "<< No information provided by caller. >>";
		}
		if(isEmpty(complaintType)) {
			complaintType = "<< No information provided by caller. >>";
		}
		if(isEmpty(locationDesc)) {
			locationDesc = "<< No information provided by caller. >>";
		}
		if(isEmpty(problemDesc)) {
			problemDesc = "<< No information provided by caller. >>";
		}
		if(isEmpty(reportByKPD)) {
			reportByKPD = "<< No information provided by caller. >>";
		}
		if(isEmpty(officerBadge)) {
			officerBadge = "<< No information provided by caller. >>";
		}

		if(capAddResult.getSuccess()) {
			var addrArray = new Array();
			var addrArray = capAddResult.getOutput();
			
			if(addrArray.length==0 || addrArray==undefined) {
				logDebug("The current CAP has no address.")
				locationInfo = "<< No address was input. >>";
			} else {
		 
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
		"What is the nature of the request - " + natureOfRequest + "<br>" + "<br>" +
		"Is this an emergency condition that requires immediate attention? - " + isEmergency + "<br>" + "<br>" +
		"What kind of facility? - " + facType + "<br>" + "<br>" +
		"If ball field, which ball field is it? - " + whichBallfield + "<br>" + "<br>" +
		"What type of complaint are you reporting? - " + complaintType + "<br>" + "<br>" +
		"Describe Location in detail? - " + locationDesc + "<br>" + "<br>" +
		"Describe Problem in detail? - " + problemDesc + "<br>" + "<br>" +
		"Concern reported by KPD Bike Patrol? - " + reportByKPD + "<br>" + "<br>" +
		"Officer Badge No. - " + officerBadge + "<br>" + "<br>" +
		"Location - " + locationInfo + "<br>" + "<br>" + 
		"Citizen Contact Information:" + "<br>" + 
		contactInfo  + "<br>" + "<br>" + 
		"City of Knoxville Reference Number - " + alternateId + 
		"</html>";

		email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
		//End Script 32