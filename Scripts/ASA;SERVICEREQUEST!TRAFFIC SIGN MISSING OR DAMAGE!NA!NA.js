/**
 * The below code is related to the ServiceRequest/Traffic Sign Missing or Damage/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

var parentPriority = capDetail.getPriority();

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

copyParcelGisObjects();serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

var alternateId = capId.getCustomID();
var natureOfRequest = workDescGet(capId);
var serviceInfo = "";

serviceInfo = 
"What is the nature of the request? " + natureOfRequest + "\r" +
"What is the type of sign? " + AInfo["What is the type of sign?"] +  "\r" +
"Is there a specific maintenance issue with any of the following? " + AInfo["Is there a specific maintenance issue with any of the following?"] + "\r" +
"If Other, please describe details " + AInfo["If Other, please describe details"] + "\r";

var Intersection = AInfo["Intersection"];

if(isEmpty(Intersection)) {
	Intersection = "No Intersection";
	}

var assetListResult = aa.asset.getAssetListByWorkOrder(capId, null);
    if(assetListResult != null){var assetModelList = assetListResult.getOutput();
                for(i=0;i<assetModelList.length;i++){
                  var assetDataModel = assetModelList[i];
                  var capAssetId = assetDataModel.getAssetMasterModel().getG1AssetID();
                  logDebug("The asset name is: " + capAssetId);
                 }}
    var assetName = capAssetId
    if(isEmpty(assetName)) {
      assetName = "No Asset";
		}

      if(assetName != "No Asset") {
		  locationInfo = locationInfo + "<br>" + "Location Name - " + assetName
		    }
//Start Script 01
//Start Script create Traffic Engineering Sign Work Order
var childId = createChild("AMS", "Work Order", "Traffic Engineering", "Sign");
copyGisObjectsToChild(childId);
copyAssets(cap, childId);
childIntersection = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", childIntersection, childId); 
//for(i=0; i<myArray.length; i++) {
//     serviceInfo = serviceInfo + myArray[i,i] + "\r";
//}

editAppSpecific("Service Request Information", serviceInfo, childId);
editAppSpecific("Source of Call", "Call Center", childId);

var reportedDate = new Date();
var reportedDatestr;
reportedDatestr = reportedDate;

editAppSpecific("Reported Time:", reportedDatestr, childId);

//copyParcelGisObjectsChild();
//copyOwner(capId, childId);
editPriority(parentPriority, childId);
		//End Script 06


var setDescription = updateWorkDesc("Sign Support " + assetName + " " + "\r" + serviceInfo,childId);

AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA";
assignCapToDept(AssignedToDept,childId); 
deactivateTask("Setup Work Order",childId);
activateTask("Open",childId);

var childalternateId = childId.getCustomID();
//End Script 01

//Start Script 32
var databaseName = lookup("COK_Database_Name", "Database_Name");
var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/ENG/SIGNS/NA/NA/NA");
var emailSubject = "A new Traffic Sign Missing or Damaged Service Request has been added. " + alternateId + " Priority-" + parentPriority;
var signType = AInfo["What is the type of sign?"];
var issue = AInfo["Is there a specific maintenance issue with any of the following?"];
var ifOther = AInfo["If Other, please describe details"];
var locationInfo = "";
var contactInfo = "";
var capAddResult = aa.address.getAddressByCapId(capId);
var contactArray = getContactArray();
var emailBody = "";
var Intersection = AInfo["Intersection"];

if(isEmpty(Intersection)) {
	Intersection = "No Intersection";
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

var assetListResult = aa.asset.getAssetListByWorkOrder(capId, null);
    if(assetListResult != null){var assetModelList = assetListResult.getOutput();
                for(i=0;i<assetModelList.length;i++){
                  var assetDataModel = assetModelList[i];
                  var capAssetId = assetDataModel.getAssetMasterModel().getG1AssetID();
                  logDebug("The asset name is: " + capAssetId);
                 }}
    var assetName = capAssetId
    if(isEmpty(assetName)) {
      assetName = "No Asset";
		}

      if(assetName != "No Asset") {
		  locationInfo = locationInfo + "<br>" + "Location Name - " + assetName
		    }

if(isEmpty(natureOfRequest)) {
	natureOfRequest = "<< No information provided by caller. >>";
}

if(isEmpty(signType)) {
	signalType = "<< No information provided by caller. >>";
}


if(isEmpty(issue)) {
	issue = "<< No information provided by caller. >>";
}

if(isEmpty(ifOther)) {
	ifOther = "<< No information provided by caller. >>";
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
	//emailTo = "grandles@knoxvilletn.gov";
	emailSubject = "**This is a test** " + emailSubject;
}

emailBody = "<html>" + 
"The City Of Knoxville 311 Call Center has received a call regarding the following:" + "<br>" + "<br>" +
"What is the nature of the request? - " + natureOfRequest + "<br>" + "<br>" +
"What is the type of sign? - " + signType + "<br>" + "<br>" +
"Is there a specific maintenance issue with any of the following? " + issue + "<br>" + "<br>" + 
"If Other, please describe details " + ifOther + "<br>" + "<br>" + 
"Location - " + locationInfo + "<br>" + "<br>" +
"Citizen Contact Information:" + "<br>" + 
contactInfo  + "<br>" + "<br>" + 
"City of Knoxville Reference Number - " + alternateId + "<br>" + 
"Traffic Engineering Sign Work Order Number - " + childalternateId + 

"</html>";

email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
//End Script 32

if(isEmpty(childId) == false) {
capId = childId;
//showMessage = true;
//comment ("childalternateId=" + childalternateId + " capId=" + capId);
deactivateTask("Setup Work Order");
activateTask("Open");
}