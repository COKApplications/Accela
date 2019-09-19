/**
 * The below code is related to the ServiceRequest/Trash Cart Issuest/NA/NA record, with
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
		var dupeList = getFilteredRecords(capList, appTypeString, new Array("Assigned To Dept"), 7);
		
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
		var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/PS/ADMIN/SOLIDWST/PKUPMISSED/NA");
		var emailSubject = "A new Trash Cart Issues Service Request has been added. " + alternateId;
		var natureOfRequest = workDescGet(capId);

		var concernType = AInfo["What type of concern are you reporting?"];
		var pickupTrashCart = AInfo["Pickup Trash Cart"];
		var updateName = AInfo["Update Name - Address Info"];
		var binSerialNumber = AInfo["Trash Cart Serial Number"];
		var policeReport = AInfo["Police Report Number"];
		var describeComplaint = AInfo["Describe Complaint in Detail"];

		var locationInfo = "";
		var contactInfo = "";
		var capAddResult = aa.address.getAddressByCapId(capId);
		var contactArray = getContactArray();
		var emailBody = "";
		var Intersection = AInfo["Intersection"];

		if(isEmpty(Intersection)) {
			Intersection = "No Intersection";
		}

		if(isEmpty(natureOfRequest)) {
			natureOfRequest = "<< No information provided by caller. >>";
		}

		if(isEmpty(concernType)) {concernType = "<< No information provided by caller. >>";}
		if(isEmpty(pickupTrashCart)) {pickupTrashCart = "<< No information provided by caller. >>";}
		if(isEmpty(updateName)) {updateName = "<< No information provided by caller. >>";}
		if(isEmpty(binSerialNumber)) {binSerialNumber = "<< No information provided by caller. >>";}
		if(isEmpty(policeReport)) {policeReport = "<< No information provided by caller. >>";}
		if(isEmpty(describeComplaint)) {describeComplaint = "<< No information provided by caller. >>";}

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
		"What is the nature of the request - " + natureOfRequest + "<br>" + "<br>" +
		"What type of concern are you reporting? - " + concernType + "<br>" + "<br>" +
		"Pickup Trash Cart - " + pickupTrashCart + "<br>" + "<br>" +
		"Update Name - Address Info - " + updateName + "<br>" + "<br>" +
		"Trash Cart Serial Number - " + binSerialNumber + "<br>" + "<br>" +
		"Police Report Number - " + policeReport + "<br>" + "<br>" +
		"Describe Complaint in Detail - " + describeComplaint + "<br>" + "<br>" +
		"Location - " + locationInfo + "<br>" + "<br>" + 
		"Citizen Contact Information:" + "<br>" + 
		contactInfo  + "<br>" + "<br>" + 
		"City of Knoxville Reference Number - " + alternateId + 
		"</html>";

		email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
		//End Script 32
	}
}
//End Script 01
