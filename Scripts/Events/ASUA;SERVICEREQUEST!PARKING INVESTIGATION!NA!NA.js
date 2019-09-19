//ASUA:SERVICEREQUEST/PARKING INVESTIGATION/NA/NA
var parentPriority = capDetail.getPriority();

if(appStatus == "Assigned To Dept") {

	//2017-06 - added code to gather ASI questions and reported date for email and work order

        //2018-01 - added unit information to email

	var reportedDate = new Date();
	var reportedDateString;
	reportedDateString = reportedDate;

	//showMessage = true;
	var ASIValuesForEmail = "Service Request reported: " + reportedDateString;
	var ASIValuesString = "Service Request reported: " + reportedDateString;
	var alternateId = capId.getCustomID();
	var cap1 = capId.getID1();
	var cap2 = capId.getID2();
	var cap3 = capId.getID3();
	//comment(cap1 + " " + cap2 + " " + cap3);
	var dbName = "jetspeed";
	var sql = "select B1_CHECKBOX_DESC, B1_CHECKLIST_COMMENT ";
	sql = sql + "from accela.bchckbox ";
	sql = sql + "where serv_prov_code = 'KNOXVILLE' ";
	sql = sql + "and b1_per_id1 = '" + cap1 + "' ";
	sql = sql + "and b1_per_id2 = '" + cap2 + "' ";
	sql = sql + "and b1_per_id3 = '" + cap3 + "' ";
	sql = sql + "order by b1_group_display_order, b1_display_order "
	//comment(sql);
	var result = aa.util.select(dbName, sql, null);

	if (result.getSuccess()) {
		result = result.getOutput();
		var i = 0;
	//			comment("Total # of records: " + result.size());

		if (i < result.size()) {
			for (i = 0; i < result.size(); i++) { 
				ASIValuesForEmail = ASIValuesForEmail + "<br>" + result.get(i).get("B1_CHECKBOX_DESC") + ": " + result.get(i).get("B1_CHECKLIST_COMMENT");
				ASIValuesString = ASIValuesString + " | " + result.get(i).get("B1_CHECKBOX_DESC") + ": " + result.get(i).get("B1_CHECKLIST_COMMENT");
	//					comment("Value is: " + ASIValuesForEmail);		
			}
		}
	}


	//Start Script 09 - Create Traffic Engineering Work Order Parking System Record
	var childId = createChild("AMS","Work Order","Traffic Engineering","Parking System");
	var parentPriority = capDetail.getPriority();
	//var serviceInfo = workDescGet(capId);
        var serviceInfo = workDescGet(capId) + " Service Request reported: " + reportedDateString;	//copyGisObjectsToChild(childId);
	updateAppStatus("Under Review", "Updated by Script.", childId);
	editPriority(parentPriority, childId);
	copyOwner(capId, childId);
	copyAssets(cap, childId);
	editAppSpecific("Source of Call", "Call Center", childId);
	//editAppSpecific("Service Request Information", serviceInfo, childId);
	editAppSpecific("Service Request Information", serviceInfo  + " Details: " + ASIValuesString, childId);
	childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
	//var detailedDescription = "Parking Investigation" ;

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

      var setDescription = updateWorkDesc("Meter " + assetName + "\r" + serviceInfo,childId);

	childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
	editAppSpecific("Service Area", childserviceArea, childId);
	childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
	editAppSpecific("Council District", childCouncilDistrict, childId);
	childIntersection = getGISIdForLayer("Intersection");
	editAppSpecific("Intersection", childIntersection, childId); 
	editAppSpecific("Source of Call:", "311", childId); 
	assignCapToDept ("KNOXVILLE/KNOX/ENG/TRAFFIC/PARKING/NA/NA",childId);
	deactivateTask("Setup Work Order",childId);
	activateTask("Open",childId);
	var childalternateId = childId.getCustomID();

	//End Script 09

		//Start Script 32
		var databaseName = lookup("COK_Database_Name", "Database_Name");
		var alternateId = capId.getCustomID();
		var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/ENG/TRAFFIC/PARKING/NA/NA");
		var emailSubject = "A new Parking Investigation Service Request has been added. " + alternateId + " Priority-" + parentPriority;
		var natureOfRequest = workDescGet(capId);
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

		if(capAddResult.getSuccess()) {
			var addrArray = new Array();
			var addrArray = capAddResult.getOutput();
			
			if(addrArray.length==0 || addrArray==undefined) {
				logDebug("The current CAP has no address.")
			}
		 else{
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
		}}

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
		"What is the nature of the request - " + natureOfRequest + "<br>" + "<br>" +
		"Location - " + locationInfo + "<br>" + "<br>" + 
		"Parking Details" + "<br>" +  
		ASIValuesForEmail + "<br>" + "<br>" + 
		"Citizen Contact Information:" + "<br>" + 
		contactInfo  + "<br>" + "<br>" + 
		"City of Knoxville Service Request Number - " + alternateId + 
		"City of Knoxville Traffic WO Number - " + childalternateId + 
		"</html>";

		email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
		//End Script 32



	}


if(isEmpty(childId) == false) {
capId = childId;
//showMessage = true;
//comment ("childalternateId=" + childalternateId + " capId=" + capId);
deactivateTask("Setup Work Order");
activateTask("Open");
}