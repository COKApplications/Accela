/** 
 * The below code is related to the ASUA:ServiceRequest/Traffic Sign Investigation/NA/NA record, with
 * an ApplicationStatusUpdateAfter event. 
 * ASUA:ServiceRequest/Traffic Sign Investigation/NA/NA
 */

/**
 * Specific code for this SR type due to interface
 * If potential duplicate is found on initial submission, status goes to Potential Duplicate
 * User changes to Assigned to Dept to process
 * In order to get picked up by interface, script must now change status to Interface - Pending
 */

var parentPriority = capDetail.getPriority();


if(appStatus == "Assigned To Dept") {
//Start Script 32
var databaseName = lookup("COK_Database_Name", "Database_Name");
var alternateId = capId.getCustomID();
var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/ENG/SIGNS/NA/NA/NA");
var emailSubject = "A new Traffic Sign Investigation Service Request has been added. " + alternateId + " Priority-" + parentPriority; ;
var natureOfRequest = workDescGet(capId);

var signType = AInfo["What is the type of sign?"];
//var specMtc = AInfo["Is there a specific maintenance issue with any of the following?"];
//var ifOther = AInfo["If Other, please describe details"];

var locationInfo = "";
var contactInfo = "";
var capAddResult = aa.address.getAddressByCapId(capId);
var contactArray = getContactArray();
var emailBody = "";

if(isEmpty(natureOfRequest)) {
  natureOfRequest = "<< No information provided by caller. >>";
}

if(isEmpty(signType)) {signType = "<< No information provided by caller. >>";}
//if(isEmpty(specMtc)) {specMtc = "<< No information provided by caller. >>";}
//if(isEmpty(ifOther)) {ifOther = "<< No information provided by caller. >>";}

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

if(databaseName != "AAPROD") {
  emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
  emailSubject = "**This is a test** " + emailSubject;
}

emailBody = "<html>" + 
"The City Of Knoxville 311 Call Center has received a call regarding the following:" + "<br>" + "<br>" +
"What is the nature of the request - " + natureOfRequest + "<br>" + "<br>" +
"What is the type of sign? - " + signType + "<br>" + "<br>" +
//"Is there a specific maintenance issue with any of the following? - " + specMtc + "<br>" + "<br>" +
//"If Other, please describe details - " + ifOther + "<br>" + "<br>" +
"Location - " + locationInfo + "<br>" + "<br>" + 
"Citizen Contact Information:" + "<br>" + 
contactInfo  + "<br>" + "<br>" + 
"City of Knoxville Reference Number - " + alternateId + 
"</html>";

email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
//End Script 32

		//Start Script 09 - Create Traffic Engineering Investigation Record
		var myArray = [["What is the nature of the request?: ", workDescGet(capId)], 
		               ["What is the type of sign?:", AInfo["What is the type of sign?"]],
		               ["Is there a specific maintenance issue with any of the following?: ", AInfo["Is there a specific maintenance issue with any of the following?"]],
		               ["If Other, please describe details: ", AInfo["If Other, please describe details"]]];
		var childId = createChild("Enforcement","Traffic Engineering","Investigation","NA");
		var serviceInfo = "Traffic Sign Investigation ";

		//copyGisObjectsToChild(childId);
		updateAppStatus("Under Review", "Updated by Script.", childId);
		editPriority(parentPriority, childId);
		copyOwner(capId, childId);
                 copyAssets(cap, childId);

		for(i=0; i<myArray.length; i++) {
		     serviceInfo = serviceInfo + myArray[i,i] + "\r";
		}
                editAppSpecific("311 Service Request Type:", "Traffic Signal Investigation", childId);
		editAppSpecific("311 Service Request Info", serviceInfo, childId);
                editAppSpecific("311 Service Request Type","Traffic Sign Investigation", childId);
                editAppSpecific("311 Service Request Info",serviceInfo, childId);                
                childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
                var setDescription = updateWorkDesc(serviceInfo,childId);
		               // help desk #34836 Parcel needs to be in work desc so it can be seen on app
               var detailedDescription =  "Traffic Sign Investigation" + serviceInfo;
               var setDescription = updateWorkDesc(detailedDescription,childId);
               childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
               editAppSpecific("Service Area", childserviceArea, childId);
                childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
                editAppSpecific("Council District", childCouncilDistrict, childId);

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
                var setDescription = updateWorkDesc(serviceInfo,childId);

		childIntersection = getGISIdForLayer("Intersection");
		editAppSpecific("Intersection", childIntersection, childId); 
		editAppSpecific("Source of Call:", "311", childId); 
                assignCapToDept ("KNOXVILLE/KNOX/ENG/SIGNS/NA/NA/NA",childId);

		//End Script 09
}