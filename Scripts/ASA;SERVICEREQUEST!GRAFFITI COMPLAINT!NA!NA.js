/**
 * The below code is related to the ServiceRequest/Graffiti Complaint/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

var WhoseProperty = AInfo["On whose property is the graffiti?"];
var AssignedToDept = "KNOXVILLE/KNOX/311/NA/NA/NA/NA";

//assignment and email vary based on response
//some options result in autoclose

var AutoClose = "N"
var SendToInterface = "N"

if     (WhoseProperty == "City Property")                {AssignedToDept = "KNOXVILLE/KNOX/PS/FACILITI/NA/NA/NA";  
      } else if(WhoseProperty == "City Signs / Meters")  {AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA";SendToInterface="Y";
      } else if(WhoseProperty == "City Traffic Lights / Poles / Boxes") 
                                                         {AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGNAL/NA/NA";SendToInterface="Y";
      } else if(WhoseProperty == "PBA Managed Property") {AssignedToDept = "KNOXVILLE/KNOX/PBA/NA/NA/NA/NA";AutoClose="Y";
      } else if(WhoseProperty == "KUB")                  {AssignedToDept = "KNOXVILLE/KNOX/KUB/NA/NA/NA/NA";AutoClose="Y";
      } else if(WhoseProperty == "Unknown")              {AssignedToDept = "KNOXVILLE/KNOX/311/NA/NA/NA/NA";
      } else if(WhoseProperty == "TDOT - State Property / Interstate") 
                                                         {AssignedToDept = "KNOXVILLE/POTHOLE-TDOT/NA/NA/NA";AutoClose="Y";
      } else if(WhoseProperty == "Railroad / Trestle")  {AssignedToDept = "KNOXVILLE/KNOX/NSRAILRD/NA/NA/NA/NA";AutoClose="Y";
      } else if(WhoseProperty == "US Post Office")       {AssignedToDept = "KNOXVILLE/KNOX/USPOSTOF/NA/NA/NA/NA";AutoClose="Y";
      } else if(WhoseProperty == "News Sentinel")        {AssignedToDept = "KNOXVILLE/KNOX/NEWSSNTL/NA/NA/NA/NA";AutoClose="Y";
      }

logDebug("AssignedToDept = " + AssignedToDept);
logDebug("WhoseProperty = " + WhoseProperty);


assignCapToDept(AssignedToDept);


//Start Script 01
var addrsObj = aa.address.getAddressByCapId(capId);
if(addrsObj.getSuccess() ) {
	var addrs = addrsObj.getOutput();
	if(addrs[0] != null){
		var addrId = addrs[0].getUID();
		//get cap List
		var capList = getRecordsByAddressIdBuffer(addrId,"KGIS","Parcels","PARCELID","-10");
		//filter duplicates
		var dupeList = getFilteredRecords(capList, appTypeString, new Array("Assigned To Dept"), 30);
		
		//display possible duplicates
		for(var x in dupeList){
			showMessage=true;
			comment("Possible Duplicate: " + dupeList[x]);
		}
	}
	
	if(isEmpty(dupeList) == false) {
		updateAppStatus("Potential Duplicate", "Updated by Script.");
	}
	
	if(isEmpty(dupeList) == true) {


		if (AutoClose == "Y") {
			//Start Script 04 - Auto Close Record
			closeTask("Service Request Intake", "Completed", "The record has been closed by a script.", "The record has been closed by a script.");
			closeCap(currentUserID);
			//End Script 04
		}
		
		if (SendToInterface == "Y") {
			updateAppStatus("Interface - Pending", "Updated by Script.");
		}

		var onWhoseProperty = AInfo["On whose property is the graffiti?"];
		
		if(onWhoseProperty == "City Property") {
			//Start Script 05 - Create Graffiti Work Order
			var myArray = [["What is the nature of the request?: ", workDescGet(capId)], 
			               ["On whose property is the graffiti?: ", AInfo["On whose property is the graffiti?"]], 
			               ["Could you please describe the graffiti?: ", AInfo["Could you please describe the graffiti?"]], 
			               ["What is the service area number?: ", AInfo["Service Area"]],
			               ["Is this an internal request?: ", AInfo["Is this an internal request?"]],
			               ["If Yes, which Organization originated the request?: ", AInfo["If Yes, which Organization originated the request?"]]]; 
			var childId = createChild("AMS", "Work Order", "Public Service", "NA");
			var serviceInfo = "";
			var parentPriority = capDetail.getPriority();
			
			copyAssets(cap, childId);

			editAppSpecific("Work Order Type", "PS29 Graffiti Removal", childId);

			for(i=0; i<myArray.length; i++) {
			     serviceInfo = serviceInfo + myArray[i,i] + "\r";
			}

			editAppSpecific("Service Request Information", serviceInfo, childId);
			copyGisObjectsToChild(childId);
			copyOwner(capId, childId);
			editPriority(parentPriority, childId);
			//End Script 05


			//Start Script 30 - Update Source of Call
			var sourceOfCall = AInfo["If Yes, which Organization originated the request?"];

			if(isEmpty(sourceOfCall)) {
				editAppSpecific("Source of Call", "Call Center", childId);
			} else {
				editAppSpecific("Source of Call", sourceOfCall, childId);
			}
			//End Script 30


			//Start Script 03 - Update Department
			var workOrderType;
			var serviceArea;
			var assignedDepartment;
			var foreman;

			workOrderType = "PS29 Graffiti Removal";
			copyParcelGisObjects();serviceArea = getGISInfo("KGIS","Public Service Zones","Zone_");
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

			if(foreman != "No Assignment") {
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
			editAppSpecific("Work Center", workCenter, childId);
			var setDescription = updateWorkDesc(workOrderType,childId);
			childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
			editAppSpecific("Service Area", childserviceArea, childId);
			childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
			editAppSpecific("Council District", childCouncilDistrict, childId);

			childIntersection = getGISIdForLayer("Intersection");
			editAppSpecific("Intersection", childIntersection, childId); 

			//End Script 29
		}

//RFS 25586 - 12/2017 - Start Script create Traffic Engineering Work Order - type depends on whose property

		if(onWhoseProperty == "City Traffic Lights / Poles / Boxes" || onWhoseProperty == "City Signs / Meters") {

			if(onWhoseProperty == "City Traffic Lights / Poles / Boxes") {
				var childId = createChild("AMS", "Work Order", "Traffic Engineering", "Signal");
				AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGNAL/NA/NA";
			}else{
				var childId = createChild("AMS", "Work Order", "Traffic Engineering", "Sign");
				AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA";
			}

			var serviceInfo = "";
			copyGisObjectsToChild(childId);
			copyAssets(cap, childId);
			childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
			editAppSpecific("Service Area", childserviceArea, childId);
			childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
			editAppSpecific("Council District", childCouncilDistrict, childId);
			childIntersection = getGISIdForLayer("Intersection");
			editAppSpecific("Intersection", childIntersection, childId); 
			//for(i=0; i<myArray.length; i++) {
			//     serviceInfo = serviceInfo + myArray[i,i] + "\r";
			//}

			var parentPriority = capDetail.getPriority();
			
			serviceInfo = 
			"What is the nature of the request?: " + workDescGet(capId) + "\r" + "\r" +
			"On whose property is the graffiti?: " + AInfo["On whose property is the graffiti?"] + "\r" + "\r" +
			"Could you please describe the graffiti?: " + AInfo["Could you please describe the graffiti?"] + "\r" + "\r" +
			"What is the service area number?: " + AInfo["Service Area"] + "\r" + "\r" +
			"Is this an internal request?: " + AInfo["Is this an internal request?"] + "\r" + "\r" +
			"If yes, which organization originated the request?: " + AInfo["If yes, which organization originated the request?"]; 

			editAppSpecific("Service Request Information", serviceInfo, childId);
			editAppSpecific("Source of Call", "Call Center", childId);
			var reportedDate = new Date();
			var reportedDatestr;
			reportedDatestr = reportedDate;

			editAppSpecific("Reported Time:", reportedDatestr, childId);

			editPriority(parentPriority, childId);
			copyGisObjectsToChild(childId);
			copyOwner(capId, childId);

			var setDescription = updateWorkDesc(workDescGet(capId),childId);

			assignCapToDept(AssignedToDept,childId); 
			var childalternateId = childId.getCustomID();		

		}

//End RFS 25586
		
		//Start Script 32
		var databaseName = lookup("COK_Database_Name", "Database_Name");
		var alternateId = capId.getCustomID();
		var emailTo = lookup("COK_Service_Request_Email_To", AssignedToDept);
		var emailSubject = "A new Graffiti Service Request has been added. " + alternateId;
		var natureOfRequest = workDescGet(capId);
		var whoseProperty = AInfo["On whose property is the graffiti?"];
		var describeGraffiti = AInfo["Could you please describe the graffiti?"];
		var workCenter = AInfo["Service Area"];
		var internalRequest = AInfo["Is this an internal request?"];
		var organizationOrigination = AInfo["If Yes, which Organization originated the request?"];
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

		if(isEmpty(natureOfRequest)) {
			natureOfRequest = "<< No information provided by caller. >>";
		}

		if(isEmpty(whoseProperty)) {
			whoseProperty = "<< No information provided by caller. >>";
		}

		if(isEmpty(describeGraffiti)) {
			describeGraffiti = "<< No information provided by caller. >>";
		}

		if(isEmpty(workCenter)) {
			workCenter = "<< No information provided by caller. >>";
		}

		if(isEmpty(internalRequest)) {
			internalRequest = "<< No information provided by caller. >>";
		}

		if(isEmpty(organizationOrigination)) {
			organizationOrigination = "<< No information provided by caller. >>";
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
			//emailTo = "grandles@knoxvilletn.gov";
			emailSubject = "**This is a test** " + emailSubject;
		}

		emailBody = "<html>" + 
		"The City Of Knoxville 311 Call Center has received a call regarding the following:" + "<br>" + "<br>" +
		"What is the nature of the request? - " + natureOfRequest + "<br>" + "<br>" +
		"On whose property is the graffiti? - " + whoseProperty + "<br>" + "<br>" +
		"Could you please describe the graffiti? - " + describeGraffiti + "<br>" + "<br>" +
		"What is the work center number? - " + workCenter + "<br>" + "<br>" +
		"Is this an internal request? - " + internalRequest + "<br>" + "<br>" +
		"If Yes, which Organization originated the request? - " + organizationOrigination + "<br>" + "<br>" +
		"Location - " + locationInfo + "<br>" + "<br>" + 
		"Citizen Contact Information:" + "<br>" + 
		contactInfo  + "<br>" + "<br>" + 
		"City of Knoxville Reference Number - " + alternateId + 
		"</html>";

		email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
		//End Script 32

//		if(onWhoseProperty != "City Property") {
//			if(onWhoseProperty == "City Signs / Meters") {								//Steve Sharp and Bill Cole @ ssharp@cityofknoxville.org and bcole@cityofknoxville.org
//				email("jtu@accela.com", "311@knoxvilletn.gov", emailSubject, emailBody);
//			} else if(onWhoseProperty == "City Traffic Lights / Poles / Boxes") {		//Ernie Pierce and Allen Arnett @ epierce@cityofknoxville.org and aarnett@cityofknoxville.org
//				email("jtu@accela.com", "311@knoxvilletn.gov", emailSubject, emailBody);
//			} else if(onWhoseProperty == "PBA Managed Property") {						//Jayne Burritt @ jburritt@cityofknoxville.org						
//				email("jtu@accela.com", "311@knoxvilletn.gov", emailSubject, emailBody);
//			} else if(onWhoseProperty == "US Post Office") {							//Tim Massie @ Tim.A.Massie@usps.gov
//				email("jtu@accela.com", "311@knoxvilletn.gov", emailSubject, emailBody);
//			} else if(onWhoseProperty == "News Sentinel") {								//Marshall Smith @ smithm@knoxnews.com					
//				email("jtu@accela.com", "311@knoxvilletn.gov", emailSubject, emailBody);
//			}
//		}

		//RFS 25586 - 12/2017 - do not create TE investigation if property = "City Traffic Lights / Poles / Boxes or City Signs /Meters"

		if(isEmpty(dupeList) == true && SendToInterface == "Y" && onWhoseProperty != "City Traffic Lights / Poles / Boxes" && onWhoseProperty != "City Signs / Meters") {
				//Start Script 09 - Create Traffic Engineering Investigation Record
		//		var myArray  [["What is the nature of the request?: ", workDescGet(capId)], 
		//			               ["On whose property is the graffiti?: ", AInfo["On whose property is the graffiti?"]], 
		//			               ["Could you please describe the graffiti?: ", AInfo["Could you please describe the graffiti?"]], 
		//			               ["What is the service area number?: ", AInfo["Service Area"]],
		//			               ["Is this an internal request?: ", AInfo["Is this an internal request?"]],
		//			               ["If Yes, which Organization originated the request?: ", AInfo["If Yes, which Organization originated the request?"]]]; 
				var childId = createChild("Enforcement","Traffic Engineering","Investigation","NA");
				var parentPriority = capDetail.getPriority();
				var serviceInfo = "";

				//copyGisObjectsToChild(childId);
				updateAppStatus("Under Review", "Updated by Script.", childId);
				editPriority(parentPriority, childId);
				copyOwner(capId, childId);

		//		for(i=0; i<myArray.length; i++) {
		//		     serviceInfo = myArray[i,i] + "\r";
		//		}
				editAppSpecific("311 Service Request Type:", "Graffiti", childId);
				editAppSpecific("311 Service Request Info:", serviceInfo, childId);
				childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
				var setDescription = updateWorkDesc("Graffiti",childId);
				// help desk #34836 Parcel needs to be in work desc so it can be seen on app
				childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
				editAppSpecific("Service Area", childserviceArea, childId);
				childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
				editAppSpecific("Council District", childCouncilDistrict, childId);
				childIntersection = getGISIdForLayer("Intersection");
				editAppSpecific("Intersection", childIntersection, childId); 
				editAppSpecific("Priority", "311 Request", childId); 
				assignCapToDept (AssignedToDept,childId);
				//End Script 09
		}

	}
}
//End Script 01

