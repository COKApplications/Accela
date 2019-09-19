/**
 * The below code is related to the Inspections Complaint Inquiry/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

//RFS#23546 - Isolate Zoning and Signs IC to create Codes Enforcment ZONE record.  7/27/2017 KCR.
var NatureOfComplaint = AInfo["What is the nature of your complaint"];
if (NatureOfComplaint == "Zoning" || NatureOfComplaint == "Signs") {
		//Start Script 09 - Create Lot Record
		var myArray = [["What is the nature of the request?: ", workDescGet(capId)], 
		               ["Is this inspection residential or commercial?: ", AInfo["Is this inspection residential or commercial?"]],
		               ["What is the nature of your complaint: ", AInfo["What is the nature of your complaint"]],
		               ["Please describe additional details: ", AInfo["Please describe additional details"]]];
		var childId = createChild("Enforcement","Codes Enforcement","Zoning Complaint","NA");
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
		var autoInspector; 

		copyParcelGisObjects();serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
		//lookup the autoInspector in standard choice COK_ZONING_INSP
		autoInspector = lookup("COK_ZONING_INSP", "ZONING_INSPECTOR"); 
		//autoInspector = "RMOYERS";
		scheduleInspectDateChild("Zoning Initial Inspection", nextWorkDay(), autoInspector, "", "Scheduled by Script.");
		assignCap(autoInspector, childId);
		//End Script 17
		
		updateAppStatus("Assigned To Dept", "Updated by Script.");
}
else {
//Start Script 32
var databaseName = lookup("COK_Database_Name", "Database_Name");
var alternateId = capId.getCustomID();
var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/INSPECTIONS/NA/NA/NA/NA");
var emailSubject = "A new Inspections Complaint Service Request has been added. " + alternateId;
var natureOfRequest = workDescGet(capId);
var residentialorcommercial = AInfo["Is this inspection residential or commercial?"];
var natureOfComplaint = AInfo["What is the nature of your complaint"];
var additonalDetails = AInfo["Please describe additional details"];
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

if(isEmpty(residentialorcommercial)) {
	residentialorcommercial = "<< No information provided by caller. >>";
}

if(isEmpty(natureOfComplaint)) {
	natureOfComplaint = "<< No information provided by caller. >>";
}

if(isEmpty(additonalDetails)) {
	additonalDetails = "<< No information provided by caller. >>";
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
"What is the nature of your request? - " + natureOfRequest + "<br>" + "<br>" +
"Is this inspection residential or commercial? - " + residentialorcommercial + "<br>" + "<br>" +
"What is the nature of your complaint? - " + natureOfComplaint + "<br>" + "<br>" +
"Please describe additional details. - " + additonalDetails + "<br>" + "<br>" +
"Location - " + locationInfo + "<br>" + "<br>" + 
"Citizen Contact Information:" + "<br>" + 
contactInfo  + "<br>" + "<br>" + 
"City of Knoxville Reference Number - " + alternateId + 
"</html>";

email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
}
//End Script 32