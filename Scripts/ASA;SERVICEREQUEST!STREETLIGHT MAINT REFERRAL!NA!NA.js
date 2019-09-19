/**
 * The below code is related to the ServiceRequest/STREETLIGHT MAINT REFERRAL/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */
 
copyParcelGisObjects();
serviceArea = getGISInfo("KGIS","Public Service Zones","ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

var AssignedToDept = capDetail.getAsgnDept();
if (isEmpty(AssignedToDept)){
	AssignedToDept = "KNOXVILLE/KNOX/KUB/NA/NA/NA/NA";
	capDetail.setAsgnDept(AssignedToDept) ;
}

var contactInfo = " No Contact Information Entered ";
var Intersection = AInfo["Intersection"];

if(isEmpty(Intersection)) {
	Intersection = "No Intersection";
	}

contactArray = getContactArray();

    for (ca in contactArray) {
        thisContact = contactArray[ca];

        if (thisContact["contactType"] == "Citizen") {
			var contactBusinessPhone = thisContact["phone1"] 
			var contactMobilePhone = thisContact["phone2"]
			var contactHomePhone = thisContact["phone3"]
			var contactFName = thisContact["firstName"]
			var contactMName = thisContact["middleName"]
			var contactLName = thisContact["lastName"]
			var contactfullName = thisContact["fullName"]
			var contactfullAddress = thisContact["fullAddress"];

			if (isEmpty(contactFName)){
				contactFName = " ";
			}

			if (isEmpty(contactMName)){
				contactMName = " ";
			}

			if (isEmpty(contactLName)){
				contactLName = " ";
			}

			if (isEmpty(contactfullName)){
				contactfullName = contactFName + " " + contactMName + " " + contactLName;
			}

			if (isEmpty(contactBusinessPhone)){
				contactBusinessPhone = " ";
			}

			if (isEmpty(contactMobilePhone)){
				contactMobilePhone = " ";
			}

			if (isEmpty(contactHomePhone)){
				contactHomePhone = " ";
			}

			if (isEmpty(contactfullAddress)){
				contactfullAddress = " ";
			}

			contactInfo = "  Contact Name=" + contactfullName +  "<br>" +
			"  Contact Address=" + contactfullAddress + "<br>" +
			"  Contact Business Phone=" + contactBusinessPhone + "<br>" +
			"  Contact Home Phone=" + contactHomePhone + "<br>" + 
			"  Contact Mobile Phone=" + contactMobilePhone + "<br>";

			}
	}

var capAddResult = aa.address.getAddressByCapId(capId);
 if (capAddResult.getSuccess())
 {
  var addrArray = new Array();
  var addrArray = capAddResult.getOutput();
  if (addrArray.length==0 || addrArray==undefined)
  {
   logDebug("The current CAP has no address.")
  }
  
  var hseNum = addrArray[0].getHouseNumberStart();
  var streetDir = addrArray[0].getStreetDirection();  
  var streetName = addrArray[0].getStreetName();
  var streetSuffix = addrArray[0].getStreetSuffix();
  var streetCity = addrArray[0].getCity();
  var streetState = addrArray[0].getState();
  var streetZip = addrArray[0].getZip();

	if (isEmpty(streetDir)){
		streetDir = " ";
	}

  capAddress = hseNum + " " + streetDir + " " + streetName + " " + streetSuffix;
 }

var DatabaseName = lookup("COK_Database_Name","Database_Name");
var B1_ALT_ID = capId.getCustomID();
var Address = capAddress;

//2018-01 - added unit information to email

var unitType = addrArray[0].getUnitType();
var unitStart = addrArray[0].getUnitStart();

var unitInfo;

if(isEmpty(unitType)) {
	unitInfo = "";
}else{
	unitInfo = unitType + " " + unitStart + " - ";
}

//Address = Address + " " + unitInfo;
Address = hseNum + " " + streetDir + " " + streetName + " " + streetSuffix + " " + unitInfo + " " + streetCity + " " + streetState + " " + streetZip;

if(Intersection != "No Intersection") {
	Address = Address + "<br>" + "Intersection - " + Intersection
    }

var NatureOfRequest = workDescGet(capId);
var Problem = AInfo["What is the problem?"];
var emailsubject = "A new Street Light Maintenance Referral Request has been added. " + B1_ALT_ID;
var emailfrom = "311@knoxvilletn.gov";

//2018-03 - changed to email to new Streetlightmtc group instead of KUB
//if the answer to what is the problem is street light out or street light maintenance
//also added call to custom function to set deparment since capDetail.setAsgnDept(AssignedToDept) does not work

//showMessage = true;

var emailto = lookup("COK_Service_Request_Email_To",AssignedToDept);

if (Problem == "1. Street Light Out") {
	emailto = lookup("COK_Service_Request_Email_To","KNOXVILLE/KNOX/ENG/STREETLIGHTMTC/ADMIN/NA");
	AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/STLIGHT/NA/NA";
	//capDetail.setAsgnDept(AssignedToDept);
	assignDepartment_Custom(AssignedToDept);
}

if (Problem == "2. Street Light Maintenance") {
	emailto = lookup("COK_Service_Request_Email_To","KNOXVILLE/KNOX/ENG/STREETLIGHTMTC/NA/NA");
	AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/STLIGHT/NA/NA";
	//capDetail.setAsgnDept(AssignedToDept);
	assignDepartment_Custom(AssignedToDept);
}

if (Problem == "3. Retrofit Issues") {
	emailto = lookup("COK_Service_Request_Email_To","KNOXVILLE/KNOX/ENG/STREETLIGHTMTC/ADMIN/NA");
	AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/STLIGHT/NA/NA";
	//capDetail.setAsgnDept(AssignedToDept);
	assignDepartment_Custom(AssignedToDept);
}

if (Problem == "4. Tree Trimming Street Light / Wire") {
	emailto = lookup("COK_Service_Request_Email_To","KNOXVILLE/KNOX/ENG/STREETLIGHTMTC/PS/NA");
	AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/STLIGHT/NA/NA";
	//capDetail.setAsgnDept(AssignedToDept);
	assignDepartment_Custom(AssignedToDept);
}

if (Problem == "5. Other") {
	emailto = lookup("COK_Service_Request_Email_To","KNOXVILLE/KNOX/ENG/STREETLIGHTMTC/NA/NA");
	AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/STLIGHT/NA/NA";
	//capDetail.setAsgnDept(AssignedToDept);
	assignDepartment_Custom(AssignedToDept);
}
if (isEmpty(NatureOfRequest)){
	NatureOfRequest = " ";
}

//comment("emailto: " + emailto + " AssignedToDept: " + AssignedToDept);

var emailbody = "<html>" +
"The City Of Knoxville 311 Call Center has received a call regarding the following:" + "<br>" + "<br>" + 
"  Reported issue - " + Problem + "<br>" + "<br>" + 
"  Description - " + NatureOfRequest  + "<br>" + "<br>" + 
"  Location - " + Address + "<br>" + "<br>" + 
"Citizen Contact Information:" + "<br>" + 
contactInfo  + "<br>" + "<br>" + 
"City of Knoxville Reference Number - " + B1_ALT_ID + "</html>";

if (DatabaseName != "AAPROD"){
	emailto = lookup("COK_Service_Request_Email_To","KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
	emailsubject = "**This is a test** " + emailsubject;
}

email(emailto,emailfrom,emailsubject,emailbody);

//2018-03 - changed to leave record open
//if the answer to what is the problem is street light out or street light maintenance

//Start Script 04 - Auto Close Record
var AutoClose = "YES";

if (Problem == "1. Street Light Out") {
	var AutoClose = "NO";
}

if (Problem == "2. Street Light Maintenance") {
	var AutoClose = "NO";
}

if (Problem == "3.  Retrofit Issues") {
	var AutoClose = "NO";
}


if (Problem == "4.  Tree Trimming Street Light / Wire") {
	var AutoClose = "NO";
}


if (Problem == "5.  Other") {
	var AutoClose = "NO";
}


if (AutoClose == "YES"){
	closeTask("Service Request Intake", "Completed", "The record has been closed by a script.", "The record has been closed by a script.");
	closeCap(currentUserID);
}
//End Script 04