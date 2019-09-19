/**
 * The below code is related to the ServiceRequest/Traffic Signal Malfunction/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

var parentPriority = capDetail.getPriority();
var locationInfo = "";

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
		  locationInfo = "Location Name - " + assetName
		    }

var Intersection = AInfo["Intersection"];

if(isEmpty(Intersection)) {
	Intersection = "No Intersection";
	}

if(Intersection != "No Intersection") {
	locationInfo = locationInfo + " Intersection - " + Intersection
	}

//Start Script 01
//Start Script create Traffic Engineering Signal Work Order
var childId = createChild("AMS", "Work Order", "Traffic Engineering", "Signal");
var serviceInfo = "";
copyGisObjectsToChild(childId);
copyAssets(cap, childId);
childIntersection = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", childIntersection, childId); 
//for(i=0; i<myArray.length; i++) {
//     serviceInfo = serviceInfo + myArray[i,i] + "\r";
//}

serviceInfo = 
"What is the nature of the request?: " + workDescGet(capId) + "\r" + "\r" +
"When did you observe the problem (Specific time is best.)?: " + AInfo["When did you observe the problem (Specific time is best.)?"] + "\r" + "\r" +
"What type of signal is it?: " + AInfo["What type of signal is it?"] + "\r" + "\r" +
"What is your direction of travel?: " + AInfo["What is your direction of travel?"] + "\r" + "\r" +
"What is wrong with the signal?: " + AInfo["What is wrong with the signal?"] + "\r" + "\r" +
"Is there a power failure in the area?: " + AInfo["Is there a power failure in the area?"] + "\r" + "\r" +
"Describe the problem in detail.: " + AInfo["Describe the problem in detail."] + "\r" + "\r" +
"Is this an internal request?: " + AInfo["Is this an internal request?"] + "\r" + "\r" +
"If yes, which organization originated the request?: " + AInfo["If yes, which organization originated the request?"] + "\r" + "\r" +
"How many bulbs?: " + AInfo["How many bulbs?"] + "\r" + "\r" +
"Which bulbs?: " + AInfo["Which bulbs?"]; 

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


var setDescription = updateWorkDesc(natureOfRequest,childId);

AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGNAL/NA/NA";
assignCapToDept(AssignedToDept,childId); 
var childalternateId = childId.getCustomID();
//End Script 01

//Start Script 32
var databaseName = lookup("COK_Database_Name", "Database_Name");
var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/ENG/SIGNAL/NA/NA/NA");
var emailSubject = "A new Traffic Signal Malfunction Service Request has been added. " + alternateId + " Priority-" + parentPriority;
var problemObserved = AInfo["When did you observe the problem (Specific time is best.)?"];
var signalType = AInfo["What type of signal is it?"];
var directionTravel = AInfo["What is your direction of travel?"];
var signalIssue = AInfo["What is wrong with the signal?"];
var powerFailure = AInfo["Is there a power failure in the area?"];
var problemDetail = AInfo["Describe the problem in detail."];
var internalRequest = AInfo["Is this an internal request?"];
var organizationOrigination = AInfo["If yes, which organization originated the request?"];
var numberBulbs = AInfo["How many bulbs?"];
var whichBulbs = AInfo["Which bulbs?"];
//var locationInfo = "";
var contactInfo = "";
var capAddResult = aa.address.getAddressByCapId(capId);

if(capAddResult.getSuccess()) {
	var addrArray = new Array();
	var addrArray = capAddResult.getOutput();
			
//			if(addrArray.length==0 || addrArray==undefined) {
//				logDebug("The current CAP has no address.")
//			}
        if (addrArray.length != 0) {
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

	locationInfo = locationInfo + " Address - " + hseNum + " " + streetDir + " " + streetName + " " + streetSuffix + " " + streetCity + " " + streetState + " " + streetZip;
}}

var contactArray = getContactArray();
var emailBody = "";
//var Intersection = AInfo["Intersection"];

//if(isEmpty(Intersection)) {
//	Intersection = "No Intersection";
//	}

//var assetListResult = aa.asset.getAssetListByWorkOrder(capId, null);
//    if(assetListResult != null){var assetModelList = assetListResult.getOutput();
//               for(i=0;i<assetModelList.length;i++){
//                  var assetDataModel = assetModelList[i];
//                  var capAssetId = assetDataModel.getAssetMasterModel().getG1AssetID();
//                  logDebug("The asset name is: " + capAssetId);
//                 }}
//    var assetName = capAssetId
//    if(isEmpty(assetName)) {
//      assetName = "No Asset";
//		}

//      if(assetName != "No Asset") {
//		  locationInfo = locationInfo + "<br>" + "Location Name - " + assetName
//		    }

if(isEmpty(natureOfRequest)) {
	natureOfRequest = "<< No information provided by caller. >>";
}

if(isEmpty(problemObserved)) {
	problemObserved = "<< No information provided by caller. >>";
}

if(isEmpty(signalType)) {
	signalType = "<< No information provided by caller. >>";
}

if(isEmpty(directionTravel)) {
	directionTravel = "<< No information provided by caller. >>";
}

if(isEmpty(signalIssue)) {
	signalIssue = "<< No information provided by caller. >>";
}

if(isEmpty(powerFailure)) {
	powerFailure = "<< No information provided by caller. >>";
}

if(isEmpty(problemDetail)) {
	problemDetail = "<< No information provided by caller. >>";
}

if(isEmpty(internalRequest)) {
	internalRequest = "<< No information provided by caller. >>";
}

if(isEmpty(organizationOrigination)) {
	organizationOrigination = "<< No information provided by caller. >>";
}

if(isEmpty(numberBulbs)) {
	numberBulbs = "<< No information provided by caller. >>";
}

if(isEmpty(whichBulbs)) {
	whichBulbs = "<< No information provided by caller. >>";
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
"What is the nature of the request? - " + natureOfRequest + "<br>" + "<br>" +
"When did you observe the problem (Specific time is best.)? - " + problemObserved + "<br>" + "<br>" +
"What type of signal is it? - " + signalType + "<br>" + "<br>" +
"What is your direction of travel? - " + directionTravel + "<br>" + "<br>" +
"What is wrong with the signal? - " + signalIssue + "<br>" + "<br>" +
"Is there a power failure in the area? - " + powerFailure + "<br>" + "<br>" +
"Describe the problem in detail. - " + problemDetail + "<br>" + "<br>" +
"Is this an internal request? - " + internalRequest + "<br>" + "<br>" +
"If yes, which organization originated the request? - " + organizationOrigination + "<br>" + "<br>" +
"How many bulbs? - " + numberBulbs + "<br>" + "<br>" +
"Which bulbs? - " + whichBulbs + "<br>" + "<br>" +
"Location - " + locationInfo + "<br>" + "<br>" + 
"Citizen Contact Information:" + "<br>" + 
contactInfo  + "<br>" + "<br>" + 
"City of Knoxville Reference Number - " + alternateId + "<br>" + 
"Traffic Engineering Signal Work Order Number - " + childalternateId + 

"</html>";

email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
//End Script 32


if(isEmpty(childId) == false) {
capId = childId;
//capId = getCapId(childalternateId)
 //   var relatedRecordType = "Traffic Engineering Signal Work Order";
//    var relatedRecordType = "AMS/Work Order/Traffic Engineering/Signal";

//    var relatedRecords = getChildren(relatedRecordType, getParent());
 //   var relatedRecords = getChildren(relatedRecordType); 
  //  if (relatedRecords != null) {
  //      for (y in relatedRecords) {
    //        aa.print("a child: " + relatedRecords[y].getCustomID());
       //     var resetCapId = capId;
       //     capId = relatedRecords[y];
 //           capId = resetCapId;
//showMessage = true;
//comment ("childalternateId=" + childalternateId + " capId=" + capId);
deactivateTask("Setup Work Order");
activateTask("Open");

//    }
//}
}

