/**
 * The below code is related to the Service Request/Parks Maintenance Request/NA/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

copyParcelGisObjects();

//Start Script 20 - Create Work Order Record
var childId = "0";
var parentId = getCapId;
var parentPriority = capDetail.getPriority();
var TaskComment = wfComment; 

if(isEmpty(TaskComment) == true) {
		TaskComment = " ";
	}

if(wfTask == "SR Intake" && wfStatus == "Parks & Rec Work Order") {
    var workOrderType = AInfo["Parks & Rec Work Order Type"];
    childId = createChild("AMS", "Work Order", "Parks and Recreation", "NA");
	copyOwner(capId, childId);
	editPriority(parentPriority, childId);
	copyGisObjectsToChild(childId);
        childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
        editAppSpecific("Service Area", childserviceArea, childId);
        childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
        editAppSpecific("Council District", childCouncilDistrict, childId);
        editAppSpecific("Parks & Rec Work Order Type", workOrderType, childId);
        var assignedDepartment =  "KNOXVILLE/KNOX/PARKS/NA/NA/NA/NA";
        assignCapToDept(assignedDepartment,childId);
        var WorkDesc = workOrderType +  " " + TaskComment;
	var setDescription = updateWorkDesc(WorkDesc,childId);
        copyAssets(cap, childId);
}



if(wfTask == "SR Intake" && wfStatus == "Public Service Work Order") {
    var workOrderType = AInfo["Public Service Work Order Type"];
    var TaskComment = wfComment; 
    childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", workOrderType, childId);
	copyOwner(capId, childId);
	editPriority(parentPriority, childId);
	copyGisObjectsToChild(childId);
        copyAssets(cap, childId);
        childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
        editAppSpecific("Service Area", childserviceArea, childId);
        childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
        editAppSpecific("Council District", childCouncilDistrict, childId);
        editAppSpecific("Source of Call", "Parks and Recreation", childId);
        editAppSpecific("Work Order Type", workOrderType, childId);
        editAppSpecific("Service Request Information", TaskComment, childId);           
        var assignedDepartment;
        var foreman;

        serviceArea = getGISInfo("KGIS","Public Service Zones","Zone_");
        assignedDepartment = lookup("WO_TYPES", workOrderType);

if(assignedDepartment == "Service Area") {
	if (serviceArea >= "100" && serviceArea <= "199") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC1/NA/NA/NA";
	} else if(serviceArea >= "200" && serviceArea <= "299") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC2/NA/NA/NA";
	} else if(serviceArea >= "300" && serviceArea <= "399") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC3/NA/NA/NA";
	} else if(serviceArea >= "400" && serviceArea <= "499") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC4/NA/NA/NA";
	} else if(serviceArea >= "500" && serviceArea <= "599") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC5/NA/NA/NA";
	} else if(serviceArea >= "600" && serviceArea <= "699") {
		assignedDepartment = "KNOXVILLE/KNOX/PS/GENSVC6/NA/NA/NA";
	}
}

foreman = lookup("COK_Public_Service_Foremen", assignedDepartment);

if(foreman != "No Assignment" && childId != "0") {
	assignCap(foreman, childId);
}

logDebug("The Work Order Type is " + workOrderType + ".");
logDebug("The Service Area is " + serviceArea + ".");
logDebug("The Department is " + assignedDepartment + ".");
logDebug("The Foreman is " + foreman + ".");
//End Script 03


//Start Script 29 - Update Work Center
var serviceArea29;
var workCenter; 

serviceArea29 = getGISInfo("KGIS", "Public Service Zones", "ZONE_");

switch(serviceArea29) {
	case "100":
		serviceArea29 = serviceArea29 + " AREA 1 (MISC)";
		break;
	case "200":
		serviceArea29 = serviceArea29 + " AREA 2 (MISC)";
		break;
	case "300":
		serviceArea29 = serviceArea29 + " AREA 3 (MISC)";
		break;
	case "400":
		serviceArea29 = serviceArea29 + " AREA 4 (MISC)";
		break;
	case "500":
		serviceArea29 = serviceArea29 + " AREA 5 (MISC)";
		break;
	case "600":
		serviceArea29 = serviceArea29 + " AREA 6 (MISC)";
		break;
	case "921":
		serviceArea29 = serviceArea29 + " SERV AREA OFFI";
		break;
	default:
		serviceArea29 = serviceArea29 + " SVC AREA " + serviceArea29;		
}

workCenter = lookup("WO_WORK_CENTERS", serviceArea29);
if(childId != "0") {
	editAppSpecific("Work Center", workCenter, childId);
   	var setDescription = updateWorkDesc(workOrderType,childId);
}
//End Script 29
}


//Start Script 16 - Update Service Request Parent Status
if (wfTask == "Initial Inspection" && (wfStatus == "Canceled" || wfStatus == "No Violation")) checkRelatedAndCloseSR ();
if (wfTask == "Re-Inspection" && (wfStatus == "Violation Corrected")) checkRelatedAndCloseSR ();
if (wfTask == "LOT: Cite to Court" && (wfStatus == "Violation Corrected")) checkRelatedAndCloseSR ();
if (wfTask == "PS Work Order" && (wfStatus == "Canceled" || wfStatus == "Completed")) checkRelatedAndCloseSR ();
//End Script 16




//
//Help Desk Call #35333 Workflow closed but SR not closed
// 

if (wfTask == "Case Closed" && (wfStatus == "Canceled" || wfStatus == "No Violation" || wfStatus == "Violation Corrected")) {
     checkRelatedAndCloseSR();
     deactivateTask("Case Closed");
}

if(wfTask == "SR Intake" && wfStatus == "Public Service Work Order") {
		//Start Script 32
    var databaseName = lookup("COK_Database_Name", "Database_Name");
    var alternateId = childId.getCustomID();
    var emailTo = lookup("COK_EMAIL_GROUPS", "SR_PARK_MAINT_WHEN_PS_WO_ADDED");
    var emailSubject = "Public Service Work Order From Parks & Rec. " + alternateId;
    var natureOfRequest = workDescGet(childId);
    var Priority = AInfo["Priority:"];
 
   var locationInfo = "";
    var contactInfo = "";
    var capAddResult = aa.address.getAddressByCapId(capId);
    var contactArray = getContactArray();
    var emailBody = "";
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
      if(assetName != "No Asset") {
		  locationInfo = locationInfo + "<br>" + "Location Name - " + assetName
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
	"Location - " + locationInfo + "<br>" + "<br>" + 
        "Nature Of Request: " + natureOfRequest + "<br>" + "<br>" + 
        "Priority: " +  Priority + "<br>" + "<br>" + 
        "Work Description: " + TaskComment + "<br>" + "<br>" +
   	"Citizen Contact Information:" + "<br>" + 
	contactInfo  + "<br>" + "<br>" + 
	"City of Knoxville Reference Number - " + alternateId + 
	"</html>";

	email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
	//End Script 32
}