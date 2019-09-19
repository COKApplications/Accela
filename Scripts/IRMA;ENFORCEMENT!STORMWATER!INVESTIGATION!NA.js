// IRMA - Inspection Result Modify After

//showMessage = true;
//comment("IRMA script");

var checkSendEmail = "YES";
var capStatus = cap.getCapStatus();
var v_transfer_type = "None";
var v_CE_Initial_insp;
var childId = "0";
var parentId = getCapId;
var parentPriority = capDetail.getPriority();
var v_sr_flag = "0";
varResult = inspResult;

if(inspType == "SW Inspection") {
    var v_actionrecommendation  = inspResultComment; //IRMA
    var v_source = "inspectionirma";                 //IRMA
 // var v_actionrecommendation  = inspComment;     //IRSA
 // var v_source = "InspectionIRSA";               //IRSA 
    //editTaskSpecific("Inspection", "Action", inspResult);
	if(inspResult == "Work Order No Follow Up" || inspResult == "Work Order Follow Up")  {
		var woexists =  isTaskActive("SWINVEST: Work Order");
		if (woexists != true) {
		   TEaddUpdateAdhocTask("SWINVEST: Work Order");
		   updateAppStatus("Work Order", "Updated by Script.");
		   updateTask("Inspection","Completed","Updated By Initial Inspection");
		   deactivateTask("Inspection");
		   activateTask("Waiting Completion of Ad Hoc Tasks");
		}
	}	
	else if(inspResult == "Referred To Codes - ROW") {
			updateAppStatus("Transferred", "Updated by Script.");
            v_transfer_type = "ROW Obstruction";
            v_CE_Initial_insp = "ROW Initial Inspection";
			updateTask("Inspection","Completed","Updated By Initial Inspection");
			deactivateTask("Inspection");
	}

	else if(inspResult == "Referred To Codes - Dirty Lot") {
			v_transfer_type = "Dirty Lot";
            v_CE_Initial_insp = "LOT Initial Inspection";
			updateAppStatus("Transferred", "Updated by Script.");
			updateTask("Inspection","Completed","Updated By Initial Inspection");
			deactivateTask("Inspection"); 
	}

	else if(inspResult == "Transferred to Traffic Eng") {
			childId = createChild("Enforcement","Traffic Engineering","Investigation","NA");
			updateAppStatus("Transferred", "Updated by Script.");
			updateTask("Inspection","Completed","Updated By Initial Inspection");
			deactivateTask("Inspection");  
	}

	else if(inspResult == "Neighborhood Drainage CIP") {
			TEaddUpdateAdhocTask("SWINVEST: Capital Project");
			activateTask("Waiting Completion of Ad Hoc Tasks");
			updateTask("Inspection","Completed","Updated By Initial Inspection");
			varResult = "Referred to Capital Project - Neighborhood Drainage";
			deactivateTask("Inspection");  
	}

	else if(inspResult == "Water Quality CIP") {
			TEaddUpdateAdhocTask("SWINVEST: Water Quality CIP");
			activateTask("Waiting Completion of Ad Hoc Tasks");
			updateTask("Inspection","Completed","Updated By Initial Inspection");
			varResult = "Referred to Capital Project - Water Quality";
			deactivateTask("Inspection");  
	}

	else if(inspResult == "Dilapidated Pipe Repair CIP") {
			TEaddUpdateAdhocTask("SWINVEST: Capital Project");
			activateTask("Waiting Completion of Ad Hoc Tasks");
			updateTask("Inspection","Completed","Updated By Initial Inspection");
			varResult = "Referred to Capital Project - Dilapidated Pipe Repair";
			deactivateTask("Inspection");  
	}

	else if (inspResult == "Linked to Duplicate") {
			updateAppStatus("Completed", "Updated by Script.");
			closeTask("Waiting Completion Of Ad Hoc Task", "Completed", 

			"Updated by Script.", "Updated by Script.");
			closeTask("Case Closed", "Completed", "Updated by Script.", 

			"Updated by Script.");
			checkRelatedAndCloseSR();
			updateTask("Inspection","Completed","Updated By Initial Inspection");
			deactivateTask("Inspection");
	}

	else if (inspResult == "More Field Inspection") {
			//updateAppStatus("Completed", "Updated by Script.");
			//closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
			//closeTask("Case Closed", "Completed", "Updated by Script.", "Updated by Script.");
			//checkRelatedAndCloseSR();
			//updateTask("Inspection","Completed","Updated By Initial Inspection");
			deactivateTask("Inspection");
	}

	else if (inspResult == "Problem Not Found" || "City Not Responsible") {
			updateAppStatus("Approval Requested", "Updated by Script.");
			updateTask("Waiting Completion Of Ad Hoc Tasks","Completed","Updated By Initial Inspection");	
			deactivateTask("Waiting Completion Of Ad Hoc Tasks");
			updateTask("Inspection", "Completed","Updated by Script.", "");
			deactivateTask("Inspection");
			activateTask("Case Closed");  
			checkRelatedAndCloseSR();

	}

	else if (inspResult == "Referred to KUB" ||
			inspResult == "Referred to TDEC" ||
			inspResult == "Referred to TDOT" ||
			inspResult == "Referred To Civil Engineering") {
			updateAppStatus("Transferred", "Updated by Script.");
			deactivateTask("Inspection");
			v_sr_flag = "1";
			updateTask("Inspection","Completed","Updated By Initial Inspection");
			deactivateTask("Inspection");
			closeTask("Waiting Completion Of Ad Hoc Task", "Completed", 

			"Updated by Script.", "Updated by Script.");
			closeTask("Case Closed", "Completed", "Updated by Script.", 

			"Updated by Script.");
	}

//Capital Project 
//Other
}

if (v_transfer_type != "None") {
	childId = createChild("Enforcement","Codes Enforcement",v_transfer_type,"NA");
	//Start Script 17 - Create and Schedule Initial Inspection 
	var serviceArea;
	var autoInspector; 
	copyParcelGisObjects();
	serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
	serviceArea = "Public Service Zones-" + serviceArea;
	editAppSpecific("Service Request Information", "Transferred From Stormwater", childId);
	autoInspector = lookup("USER_DISTRICTS", serviceArea);
	//showMessage = true;
	//comment("serviceArea = " + serviceArea);
	//comment("autoInspector=" + autoInspector);
	//comment("v_CE_INITIAL_insp=" + v_CE_Initial_insp);
	if(autoInspector == "No Inspector") {
		autoInspector = "CHOLLIFIELD";
	}
	if(autoInspector != "No Inspector") {
		scheduleInspectDateChild (v_CE_Initial_insp,nextWorkDay(), autoInspector, "", "Scheduled by Script.");
	}

	assignCap(autoInspector, childId);
	//End Script 17
}

if(childId != "0") {
	copyOwner(capId, childId);
	editPriority(parentPriority, childId);
	copyGisObjectsToChild(childId);
	childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
	editAppSpecific("Service Area", childserviceArea, childId);
	childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
	editAppSpecific("Council District", childCouncilDistrict, childId);
	var myworkDesc = workDescGet(capId);
	var mySRInfo = AInfo["311 Service Request Info"];
	var mySRType = AInfo["311 Service Request Type"];
	var mySRInfo = mySRType + "\r" + mySRInfo;
	editAppSpecific("311 Service Request Info", mySRInfo, childId);
	var xdetailedDescription =   "Transferred From Stormwater" + "\r" +   "Action Recommendation " + v_actionrecommendation + "\r" + myworkDesc + "\r";
	var xsetDescription = updateWorkDesc(xdetailedDescription,childId);
	closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
}

var DatabaseName = lookup("COK_Database_Name","Database_Name");
if (checkSendEmail != null) {
	var contactArray = new Array();
	contactArray = getContactArray();
	var params = aa.util.newHashtable(); 

	//will send an email to each contact type that has an email address
	x=0;
	while(x < contactArray.length) {	
		var tContact = contactArray[x];
		getContactParams4Notification(params,tContact)
		//comment("Contact Type: " + tContact ["contactType"]);
		//comment("Contact BusinessName: " + tContact ["businessName"]);

		var contactEmail;
		if (tContact["email"] != null){
			contactEmail = tContact["email"];
			contactType = tContact["contactType"];
			var notificationTemplate = "COK_SW_INSPECTION_RESULT";
			//get copy (cc) addresses if there are any
			//var checkEmailCopy = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/311/SRTHANKSCOPY/NA/NA/NA");
			//comment("checkEmailCopy: " + checkEmailCopy);
			//var emailCopyTo = "";
			//if (checkEmailCopy != null) {
			//	emailCopyTo = checkEmailCopy;
			//}
			//provide capId, template to use
			//if for some reason report is not to be attached, send null in that field
			//limit to specific contact type
			//comment("contactEmail: " + contactEmail);
			//comment("contactType.toUpperCase: " + contactType.toUpperCase());

			if (contactType.toUpperCase() == "CITIZEN"){
				//comment("contactType: " + contactType);
				//comment("sending email");
				var inspComment = inspResult + " - " + v_actionrecommendation;
		  
				if (DatabaseName != "AAPROD"){ 
					contactEmail = lookup("COK_Service_Request_Email_To","KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
				}			
			
				//showMessage = true;
				//comment("Sending email from IRMA script");
				//HD call - comment out actual send at this time
				//COKGenerateReportAttachToEmail(capId, notificationTemplate, null, "Enforcement", v_source, contactType, contactEmail, null);
		}
		else{
			contactEmail = "NA";
		}
		}else{
			contactEmail = "NA";
		}
		//comment("contactEmail: " + contactEmail);
		x = x + 1;
	}
}
