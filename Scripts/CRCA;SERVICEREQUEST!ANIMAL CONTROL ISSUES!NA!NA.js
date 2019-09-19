/**
 * The below code is related to the ServiceRequest/Animal Control Issues/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

//Start Script 04 - Auto Close Record
closeTask("Service Request Intake", "Completed", "The record has been closed by a script.", "The record has been closed by a script.");
closeCap(currentUserID);
//End Script 04


//Start Script 32
var databaseName = lookup("COK_Database_Name", "Database_Name");
var alternateId = capId.getCustomID();
var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/ANIMCONT/NA/NA/NA");
var emailSubject = "A new Animal Control Complaint Service Request has been added. " + alternateId;
var natureOfRequest = workDescGet(capId);

var IsthisanEmergency = AInfo["Is this an Emergency?"];
var Whattypeofanimal = AInfo["What type of animal?"];
var natureoftheconcern = AInfo["What is the nature of the concern?"];

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

if(isEmpty(IsthisanEmergency)) {
	IsthisanEmergency = "<< No information provided by caller. >>";
}

if(isEmpty(Whattypeofanimal)) {
	Whattypeofanimal = "<< No information provided by caller. >>";
}

if(isEmpty(natureoftheconcern)) {
	natureoftheconcern = "<< No information provided by caller. >>";
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

if(Intersection != "No Intersection") {
	locationInfo = locationInfo + "<br>" + "Intersection - " + Intersection
    }

if(databaseName != "AAPROD") {
	emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
	emailSubject = "**This is a test** " + emailSubject;
}


//var IsthisanEmergency = AInfo["Is this an Emergency?"];
//var Whattypeofanimal = AInfo["What type of animal?"];
//var natureoftheconcern = AInfo["What is the nature of the concern?"];


emailBody = "<html>" + 
"The City Of Knoxville 311 Call Center has received a call regarding the following:" + "<br>" + "<br>" +
"What is the nature of your request? - " + natureOfRequest + "<br>" + "<br>" +
"Is this an Emergency? - " + IsthisanEmergency + "<br>" + "<br>" +
"What type of animal? - " + Whattypeofanimal + "<br>" + "<br>" +
"What is the nature of the concern? - " + natureoftheconcern + "<br>" + "<br>" +
"Location - " + locationInfo + "<br>" + "<br>" + 
"Citizen Contact Information:" + "<br>" + 
contactInfo  + "<br>" + "<br>" + 
"City of Knoxville Reference Number - " + alternateId + 
"</html>";

email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
//End Script 32