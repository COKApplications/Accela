/**
 * The below code is related to the ServiceRequest/Street Light Request Complaint/NA/NA record, with
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
var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/ENG/STORM/STREETLIGHT/NA/NA");
var emailSubject = "A new Street Light Request Complaint Service Request has been added. " + alternateId;
var natureOfRequest = workDescGet(capId);
var locationDetail = AInfo["Describe location in detail."];
var lightingSituation = AInfo["What is the lighting situation?"];
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

if(isEmpty(locationDetail)) {
	locationDetail = "<< No information provided by caller. >>";
}

if(isEmpty(lightingSituation)) {
	lightingSituation = "<< No information provided by caller. >>";
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
"What is the lighting situation? - " + lightingSituation + "<br>" + "<br>" +
"Describe location in detail. - " + locationDetail + "<br>" + "<br>" +
"Location - " + locationInfo + "<br>" + "<br>" + 
"Citizen Contact Information:" + "<br>" + 
contactInfo  + "<br>" + "<br>" + 
"City of Knoxville Reference Number - " + alternateId + 
"</html>";

email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
//End Script 32


//Start Script 09 - Create Stormwater Investigation Record
var parentPriority = capDetail.getPriority();
var childId = createChild("Enforcement","Stormwater","Investigation","NA");
var serviceInfo = "What is the nature of your request? - " + natureOfRequest + "\r" +
"What is the lighting situation? - " + lightingSituation + "\r" +
"Describe location in detail. - " + locationDetail;
//copyGisObjectsToChild(childId);
updateAppStatus("Under Review", "Updated by Script.", childId);
editPriority(parentPriority, childId);
copyOwner(capId, childId);
copyAssets(cap, childId);

editAppSpecific("311 Service Request Type", "Street Light Request / Complaint", childId);
editAppSpecific("311 Service Request Info", serviceInfo, childId);
childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
var detailedDescription = "Street Light Request / Complaint" ;
var setDescription = updateWorkDesc(detailedDescription,childId);
editAppSpecific("Service Area", childserviceArea, childId);
childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", childCouncilDistrict, childId);
childIntersection = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", childIntersection, childId); 
editAppSpecific("Source of Call", "311", childId); 
assignCapToDept ("KNOXVILLE/KNOX/ENG/STORM/NA/NA/NA",childId);
//End Script 09
