/**
 * The below code is related to the ServiceRequest/Smoke Alarm Program/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
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
var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/311/SMOKEALARM/NA/NA/NA");

//moved subject line below - needs to incorporate answer to one of the questions

var natureOfRequest = workDescGet(capId);

var whatIs = AInfo["What is being requested?"];
var manyBatteries = AInfo["How many batteries are needed?"];
var manyNewAlarms = AInfo["How many new alarms are needed?"];
var highCeilings = AInfo["Are the ceilings high (over 8 feet)?"];
var availableDate = AInfo["Available date for service"];
var aftOrMorn = AInfo["Afternoon or morning?"];

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

if(isEmpty(whatIs)) {whatIs = "<< No information provided by caller. >>";}
if(isEmpty(manyBatteries)) {manyBatteries = "<< No information provided by caller. >>";}
if(isEmpty(manyNewAlarms)) {manyNewAlarms = "<< No information provided by caller. >>";}
if(isEmpty(highCeilings)) {highCeilings = "<< No information provided by caller. >>";}
if(isEmpty(availableDate)) {availableDate = "<< No information provided by caller. >>";}
if(isEmpty(aftOrMorn)) {aftOrMorn = "<< No information provided by caller. >>";}

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

var emailSubject = whatIs + " - " + locationInfo + " - " + alternateId;

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
"What is being requested? - " + whatIs + "<br>" + "<br>" +
"How many batteries are needed? - " + manyBatteries + "<br>" + "<br>" +
"How many new alarms are needed? - " + manyNewAlarms + "<br>" + "<br>" +
"Are the ceilings high (over 8 feet)? - " + highCeilings + "<br>" + "<br>" +
"Available date for service - " + availableDate + "<br>" + "<br>" +
"Afternoon or morning? - " + aftOrMorn + "<br>" + "<br>" +
"Location - " + locationInfo + "<br>" + "<br>" + 
"Citizen Contact Information:" + "<br>" + 
contactInfo  + "<br>" + "<br>" + 
"City of Knoxville Reference Number - " + alternateId + 
"</html>";

email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
//End Script 32
