/**
 * The below code is related to the Enforcement/Stormwater/Investigation/NA record, with
 * an ApplicationSubmitAfter event. 
 */


assignCapToDept ("KNOXVILLE/KNOX/ENG/STORM/NA/NA/NA",capId);

var v_source = AInfo["Source"];
var v_type = AInfo["Type"];
var v_priority = "Low";

if(v_source  == "Mayoral Request" || v_source == "TDEC Request" || v_source == "Directors Request" || v_source == "Paving List") {
     v_priority = "High";
}

//If (v_source == "Mayoral Request"){
//v_priority = "High";
//}

if(v_source  == "Council Request" ) {
     v_priority = "Medium";
} 

copyParcelGisObjects();
editPriority(v_priority);
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);

// SW Investigation Assign Watershed based on address
// if address is not valid watershed will be undefined
watershed = getGISInfo("KGIS", "Watershed Boundary", "BASIN_NAME");
editAppSpecific("Watershed", watershed);

//
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);
setSingleAddressToPrimary(capId);
var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

//Start Script 17 - Create and Schedule Initial Inspection
var autoInspector; 
// if address is not valid swdistrict will be undefined
swdistrict = getGISInfo("KGIS", "SWM Zones", "DISTRICT_ID");
if (swdistrict != undefined) {
	swdistrict = "SW Districts-" + swdistrict;
	//Lookup Inspector in Standard Choices - USER_DISTRICTS
	autoInspector = lookup("USER_DISTRICTS", swdistrict);
	if(autoInspector == "No Inspector") {
		autoInspector = "GLOWE";
	}
} else {
	showMessage = true;
	comment("Inspector cannot be determined from address.  Enter valid address.")
	logDebug(capId + " Inspector cannot be determined.  Enter valid address.")
	autoInspector = "GLOWE";
}	

assignCap(autoInspector);
var InspectionType = "SW Inspection";

scheduleInspectDate(InspectionType, nextWorkDay(dateAdd(null, -1)), autoInspector, "", "Scheduled by Script.");
updateTask("Assign Inspection", "Completed","Updated by Script.", "")
deactivateTask("Assign Inspection");
activateTask("Inspection");;
updateAppStatus("In Queue", "Updated by Script."); 
//autoInspector_email();     

//End Script 17

//Start Script 32
var databaseName = lookup("COK_Database_Name", "Database_Name");
var alternateId = capId.getCustomID();
var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/ENG/STORM/NA/NA/NA");
//var emailSubject = "A new Sinkhole Cave-In Inspection Service Request has been added. " + alternateId;
var natureofrequest = workDescGet(capId);
var incidentSource = AInfo["Source"];
var incidentType = AInfo["Incident Type"];
var incidentWatershed = AInfo["Watershed"];
var problemPaving = AInfo["Problem Due To Paving?"];
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
"What is the nature of the request - " + natureofrequest + "<br>" + "<br>" +
"Source - " + incidentSource + "<br>" + "<br>" +
"Incident Type - " + incidentType + "<br>" + "<br>" +
"Watershed - " + incidentWatershed + "<br>" + "<br>" +
"Problem Paving? - " + problemPaving + "<br>" + "<br>" +
"Location - " + locationInfo + "<br>" + "<br>" + 
"Citizen Contact Information:" + "<br>" + 
contactInfo  + "<br>" + "<br>" + 
"City of Knoxville Reference Number - " + alternateId + 
"</html>";

var v_system = "avprod";
if(databaseName != "AAPROD") {
	v_system = "avdev";
}

//email inspector assigned to SW Investigation
//reset emailTo and emailSubject

emailBody = emailBody + "<html><br>Stormwater Investigation Number: " + alternateId +
"<br>" + 
"Assigned to: " + autoInspector + "<br>" + 
"<a href=https://" + v_system + ".city.knoxvilletn.gov/portlets/reports/adHocReport.do?mode=deepLink&reportCommand=recordDetail&altID=" + alternateId + " target=_blank>Record Detail for: " + alternateId + "</a>"  + "<br>" +
"(Only available for logged in user)<br><br></html>";

var emailTo = autoInspector + "@knoxvilletn.gov";
//comment("emailTo: " + emailTo);
var emailSubject = "You have been assigned a Stormwater Investigation. " + alternateId;

if(databaseName != "AAPROD") {
	emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
	emailSubject = "**This is a test** " + emailSubject;
}

email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);

//End Script 32


