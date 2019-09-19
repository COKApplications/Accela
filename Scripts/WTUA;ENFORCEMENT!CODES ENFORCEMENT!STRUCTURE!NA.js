/**
 * The below code is related to the Enforcement/Codes Enforcement/Structure/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

copyParcelGisObjects();

//Start Script 22 - Create Structure Work Order Record
var childId = "0";
var parentId = getCapId;
var parentPriority = capDetail.getPriority();

//showMessage = true;
//comment ("wfTask="+wfTask+" wfStatus= "+wfStatus);

if(wfTask == "STR: Board Structure" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS39 Board House Codes Enforcement", childId);
} else if(wfTask == "STR: PS WO Board House" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS39 Board House Codes Enforcement", childId);
} else if(wfTask == "STR: Final Demolition Process" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS40 Demolition", childId);
} else if(wfTask == "STR: PS WO Demo" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS40 Demolition", childId);
} else if(wfTask == "STR: Final Demolition Process" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS40 Demolition", childId);
} else if(wfTask == "STR: Cite to Court" && wfStatus == "Work Order") {
	if(AInfo["Board House - Codes"] == "CHECKED") {
		childId = createChild("AMS", "Work Order", "Public Service", "NA");
		editAppSpecific("Work Order Type", "PS39 Board House Codes Enforcement", childId);
	} else if(AInfo["Demolition"] == "CHECKED") {
		childId = createChild("AMS", "Work Order", "Public Service", "NA");
		editAppSpecific("Work Order Type", "PS40 Demolition", childId);
	}
}

if(childId != "0") {
	copyOwner(capId, childId);
	editPriority(parentPriority, childId);
	copyGisObjectsToChild(childId);
        childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
        editAppSpecific("Service Area", childserviceArea, childId);
        childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
        editAppSpecific("Council District", childCouncilDistrict, childId);

}
//End Script 22


//Start Script 24 - Create Lien Fees
//if(wfTask == "STR: Lien" && wfStatus == "Open-lien") {
if(wfTask == "STR: Lien" && (wfStatus == "Lien Owed - Work Completed" || "Lien Owed - Work Still In Progress")) {
	if(balanceDue == "0") {
		addFee("CE_LATE", "CE_STRUCTURE", "FINAL", feeAmountAll(capId,"NEW"), "N");
	} else {
		addFee("CE_LATE", "CE_STRUCTURE", "FINAL", balanceDue, "N");
	}
	
	addFee("CE_FILING", "CE_STRUCTURE", "FINAL", 1, "N");
}
//End Script 24


//Start Script 03 - Update Department
var workOrderType;
var serviceArea;
var assignedDepartment;
var foreman;

if(wfTask == "STR: Board Structure" && wfStatus == "Work Order") {
	workOrderType = "PS39 Board House Codes Enforcement";
} else if(wfTask == "STR: Final Demolition Process" && wfStatus == "Work Order") {
	workOrderType = "PS40 Demolition";
} else if(wfTask == "STR: Cite to Court" && wfStatus == "Work Order") {
	if(AInfo["Board House - Codes"] == "CHECKED") {
		workOrderType = "PS39 Board House Codes Enforcement";
	} else if(AInfo["Demolition"] == "CHECKED") {
		workOrderType = "PS40 Demolition";
}} else if(wfTask == "STR: PS WO Board House" && wfStatus == "Work Order") {
	workOrderType = "PS39 Board House Codes Enforcement";
} else if(wfTask == "STR: PS WO Demo" && wfStatus == "Work Order") {
	workOrderType = "PS40 Demolition";
}



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
        var vworkDesc = workOrderType;
        var vwfComment = wfComment;
        if(isEmpty(vwfComment)) {
	vwfComment = "No Comment";
	}
        if(vwfComment != "No Comment") {
	  vworkDesc = vworkDesc + " " + vwfComment;
         }
 
//	var setDescription = updateWorkDesc(workOrderType,childId);
        var setDescription = updateWorkDesc(vworkDesc,childId);
}
//End Script 29


//Start Script 23 - Add Ad-Hoc Tasks
var serviceArea;
var autoInspector; 

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
serviceArea = "Public Service Zones-" + serviceArea;
autoInspector = lookup("USER_DISTRICTS", serviceArea);

if(autoInspector == "No Inspector") {
	autoInspector = "CHOLLIFIELD";
}
if(wfTask == "STR: Letter Notice" && wfStatus == "In Violation") {
	activateEnforcementReinspection();
	//deactivateTask("STR: Letter Notice");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Letter Notice","In Violation","","");
	scheduleInspectDate("STR Re-Inspection", nextWorkDay(dateAdd(null, 119)), autoInspector, "", "Scheduled by Script.");
//comment ("inside STR: Letter Notice - in violation");
}

//HD#44614 - remove deactivate and replace with closecase for newUI workflow behavior.  we don't have a "letter notice"--see if above.  commented out.
//HD#44735 - cannot remove these lines b/c reschedules re-inspection.  These come from the workflow diagram by default.  8/3/2018 KCR
if(wfTask == "Letter Notice" && wfStatus == "In Violation") {
	activateEnforcementReinspection();
//	deactivateTask("Letter Notice");
        editTaskSpecific("Letter Notice","Date Letter Mailed",dateAdd(null,0));
	closeTask("Letter Notice","In Violation","","");
	scheduleInspectDate("STR Re-Inspection", nextWorkDay(dateAdd(null, 119)), autoInspector, "", "Scheduled by Script.");
//comment ("inside Letter Notice - in violation");

}
//if(wfTask == "Letter Notice" && wfStatus == "In Violation") {
//	activateEnforcementReinspection();
//	deactivateTask("Letter Notice");
//}

if(wfTask == "Re-Inspection" && wfStatus == "Work Order") {
	addUpdateAdhocTask("STR: PS Work Order");
	//deactivateTask("Re-Inspection");
}
	
if(wfTask == "STR: Board Structure" && wfStatus == "Work Order") {
//	addUpdateAdhocTask("STR: PS Work Order");
        addUpdateAdhocTask("STR: PS WO Board House");
	//deactivateTask("STR: Board Structure");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Board Structure","Work Order","","");
}

if(wfTask == "STR: Begin Demolition Process" && wfStatus == "In Violation") {
	addUpdateAdhocTask("STR: Confirmation on Utilities");
	//deactivateTask("STR: Begin Demolition Process");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Begin Demolition Process","In Violation","","");
}

if(wfTask == "STR: Confirmation on Utilities" && wfStatus == "In Violation") {
	addUpdateAdhocTask("STR: Final Demolition Process");
	//deactivateTask("STR: Confirmation on Utilities");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Confirmation on Utilities","In Violation","","");
}

if(wfTask == "STR: Final Demolition Process" && wfStatus == "Work Order") {
//	addUpdateAdhocTask("STR: PS Work Order");
        addUpdateAdhocTask("STR: PS WO Demo");
	//deactivateTask("STR: Final Demolition Process");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Final Demolition Process","Work Order","","");
}

//NOT SEEING A STR: PS Work Order Task  --- Dead Code.  see PS WO Board House and PS WO Demo below.  HD#44614  commented out.
//if(wfTask == "STR: PS Work Order" && wfStatus == "Completed") {
////	addUpdateAdhocTask("STR: Bill");
//	deactivateTask("STR: PS Work Order");
//}

if(wfTask == "STR: PS WO Board House" && wfStatus == "Completed") {
//	addUpdateAdhocTask("STR: Bill");
//deactivateTask("STR: PS WO Board House");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: PS WO Board House","Completed","","");
//	updateAppStatus("Bill Owed", "Updated by Script.");
}

if(wfTask == "STR: PS WO Demo" && wfStatus == "Completed") {
//	addUpdateAdhocTask("STR: Bill");
	//deactivateTask("STR: PS WO Demo");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: PS WO Demo","Completed","","");
//	updateAppStatus("Bill Owed", "Updated by Script.");
}

if(wfTask == "STR: Cite to Court") {
	
	if(wfStatus == "Violation Corrected") {
		closeEnforcementCaseWorkflow("Violation Corrected");
		//deactivateTask("STR: Cite to Court");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	        closeTask("STR: Cite to Court","Violation Corrected","","");
	}
	
	if(wfStatus == "Work Order") {
		addUpdateAdhocTask("STR: PS Work Order");
		//deactivateTask("STR: Cite to Court");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	        closeTask("STR: Cite to Court","Work Order","","");
	}
}

//if(wfTask == "STR: Public Officer Hearing" && wfStatus == "In Violation") {
//	deactivateTask("STR: Public Officer Hearing");
//}
//Changed deactivate to close  HD#44562 - causes us to not see information when status is set on this task in the new UI.
if(wfTask == "STR: Placard" && wfStatus == "In Violation") {
//	deactivateTask("STR: Placard");
	closeTask("STR: Placard","In Violation","","");
}
//End script 23


//Start Script 16 - Update Service Request Parent Status
if (wfTask == "Initial Inspection" && (wfStatus != "Under Review")) checkRelatedAndCloseSR ();
//End script 16

// KCR RFS#28671 4/2/2019
//
if (wfTask == "Letter Notice" && (wfStatus == "Graffiti Letter Sent")){
//	closeTask("Letter Notice","Graffiti Letter Sent","x","y");
	COK_CE_EMail();
	closeTask("Case Closed","Violation Corrected","a","b");
//comment ("Inside Case Closed - Graffiti Letter Sent");
}

// nlt help desk 35018 4/22/2016
//

if(wfTask == "STR: Lien" && wfStatus == "Lien Owed - Work Still In Progress") {
	updateAppStatus("Lien Owed - Open","Updated by Script.");
}

if(wfTask == "STR: Lien" && wfStatus == "Lien Owed - Work Completed") {
	updateAppStatus("Lien Owed - Closed","Updated by Script.");
}


if(wfTask == "STR: Lien" && wfStatus == "Lien Corrected - Work Still in Progress") {
	updateAppStatus("In Violation","Updated by Script.");  
        deactivateTask("STR: Lien");
}

if(wfTask == "STR: Lien" && wfStatus == "Lien Corrected - Work Completed") {
	updateAppStatus("Completed","Updated by Script.");
        //deactivateTask("STR: Lien");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Lien","Lien Corrected - Work Completed","","");
	closeEnforcementCaseWorkflow("Violation Corrected");   
        //deactivateTask("Case Closed");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("Case Closed","Lien Corrected - Work Completed","","");
}


//
//Help Desk Call #35333 Workflow closed but SR not closed
// 

if (wfTask == "Case Closed" && (wfStatus == "Canceled" || wfStatus == "No Violation" || wfStatus == "Violation Corrected")) {
     checkRelatedAndCloseSR();
     deactivateTask("Case Closed");
}

if (childId > "0") {
    capId = childId;
    deactivateTask("Setup Work Order");
    activateTask("Open");
}

//function COK_CE_EMail(capId, inputNotificationTemplate, inputReportName, inputReportModule, inputSource, inputContactType, inputContactEmail, inputEmailCopyTo,rptparamname) {
function COK_CE_EMail() {

//***********************************************************************
//Copied from Function in Custom Script: COKGenerateReportAttachToEMail
//***********************************************************************
//-----
//Build the parameters that are passed to the report template
//-----
	var params = aa.util.newHashtable(); 
showMessage = true;
comment ("In the FUNCTION");
//comment ("wfTask="+wfTask+" wfStatus= "+wfStatus);		

	//0.  $$testing$$  $$altId$$   ????in the subject line????

	//1.  Get the property address
	var streetAddressPlus1 = COKFormatCapStreetAddressPlus(capId);
comment ("var streetAddressPlus1="+streetAddressPlus1);
	addParameter(params, "$$streetAddressPlus$$", streetAddressPlus1);
	//var streetAddressOnly1 = COKFormatCapStreetAddressOnly(capId);
	//addParameter(params, "$$streetAddressOnly$$", streetAddressOnly1);

	//2.  Get the Owner Name  (see getContactArray in the "7.3 FP3Scripting Guide.pdf" (P:\Accela\Manuals ??)
	var v_inputContactType = 'OWNER';
	var contactArray = new Array();
	contactArray = getContactArray(capId);

comment ("contactArray.length="+contactArray.length);

	y=0;
	while(y < contactArray.length) {	
	
		var tContact = contactArray[y];

comment ("tContact="+tContact);

		getContactParams4Notification(params,tContact)
		//addParameter(params, "$$" + conType + "FullName$$", thisContact["fullName"]);

comment ("contact type="+tContact["contactType"]);
		
		
		var v_BusinessName = "NA";
		if (tContact["contactType"] == v_inputContactType){
			v_FullName = tContact["fullName"];
			addParameter(params, "$$OwnerFullName$$", v_FullName);
			v_BusinessName = tContact["businessName"];
			addParameter(params, "$$OwnerBusinessName$$", v_BusinessName);
		}
		
		y = y + 1;
	}
	//end 2. Get the Owner Name

//-----
//Look in Standard Choices for who to send the email to.  (See: ASA Service Request Animal Control)
//-----
	emailTo = lookup("COK_CE_EmailTo", "KNOXVILLE/KNOX/ENFORCEMENT/CODES/STRUCTURE/GRAFFITI");
	
//-----
//Send the Email
//-----

		//use null for report file parameter if no report is to be attached
		//sendNotification(null,"grandles@knoxvilletn.gov","",inputNotificationTemplate,params,null);
		//parameters:  from, to, cc, templateName, parms, reportfilename
		
		//sendNotification(null,"grandles@knoxvilletn.gov","",inputNotificationTemplate,params,null);
		sendNotification(null,"krobnett@knoxvilletn.gov","","COK_CE_GRAFFITI",params,null);

	

}/**
 * The below code is related to the Enforcement/Codes Enforcement/Structure/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

copyParcelGisObjects();

//Start Script 22 - Create Structure Work Order Record
var childId = "0";
var parentId = getCapId;
var parentPriority = capDetail.getPriority();

//showMessage = true;
//comment ("wfTask="+wfTask+" wfStatus= "+wfStatus);

if(wfTask == "STR: Board Structure" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS39 Board House Codes Enforcement", childId);
} else if(wfTask == "STR: PS WO Board House" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS39 Board House Codes Enforcement", childId);
} else if(wfTask == "STR: Final Demolition Process" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS40 Demolition", childId);
} else if(wfTask == "STR: PS WO Demo" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS40 Demolition", childId);
} else if(wfTask == "STR: Final Demolition Process" && wfStatus == "Work Order") {
	childId = createChild("AMS", "Work Order", "Public Service", "NA");
	editAppSpecific("Work Order Type", "PS40 Demolition", childId);
} else if(wfTask == "STR: Cite to Court" && wfStatus == "Work Order") {
	if(AInfo["Board House - Codes"] == "CHECKED") {
		childId = createChild("AMS", "Work Order", "Public Service", "NA");
		editAppSpecific("Work Order Type", "PS39 Board House Codes Enforcement", childId);
	} else if(AInfo["Demolition"] == "CHECKED") {
		childId = createChild("AMS", "Work Order", "Public Service", "NA");
		editAppSpecific("Work Order Type", "PS40 Demolition", childId);
	}
}

if(childId != "0") {
	copyOwner(capId, childId);
	editPriority(parentPriority, childId);
	copyGisObjectsToChild(childId);
        childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
        editAppSpecific("Service Area", childserviceArea, childId);
        childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
        editAppSpecific("Council District", childCouncilDistrict, childId);

}
//End Script 22


//Start Script 24 - Create Lien Fees
//if(wfTask == "STR: Lien" && wfStatus == "Open-lien") {
if(wfTask == "STR: Lien" && (wfStatus == "Lien Owed - Work Completed" || "Lien Owed - Work Still In Progress")) {
	if(balanceDue == "0") {
		addFee("CE_LATE", "CE_STRUCTURE", "FINAL", feeAmountAll(capId,"NEW"), "N");
	} else {
		addFee("CE_LATE", "CE_STRUCTURE", "FINAL", balanceDue, "N");
	}
	
	addFee("CE_FILING", "CE_STRUCTURE", "FINAL", 1, "N");
}
//End Script 24


//Start Script 03 - Update Department
var workOrderType;
var serviceArea;
var assignedDepartment;
var foreman;

if(wfTask == "STR: Board Structure" && wfStatus == "Work Order") {
	workOrderType = "PS39 Board House Codes Enforcement";
} else if(wfTask == "STR: Final Demolition Process" && wfStatus == "Work Order") {
	workOrderType = "PS40 Demolition";
} else if(wfTask == "STR: Cite to Court" && wfStatus == "Work Order") {
	if(AInfo["Board House - Codes"] == "CHECKED") {
		workOrderType = "PS39 Board House Codes Enforcement";
	} else if(AInfo["Demolition"] == "CHECKED") {
		workOrderType = "PS40 Demolition";
}} else if(wfTask == "STR: PS WO Board House" && wfStatus == "Work Order") {
	workOrderType = "PS39 Board House Codes Enforcement";
} else if(wfTask == "STR: PS WO Demo" && wfStatus == "Work Order") {
	workOrderType = "PS40 Demolition";
}



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
        var vworkDesc = workOrderType;
        var vwfComment = wfComment;
        if(isEmpty(vwfComment)) {
	vwfComment = "No Comment";
	}
        if(vwfComment != "No Comment") {
	  vworkDesc = vworkDesc + " " + vwfComment;
         }
 
//	var setDescription = updateWorkDesc(workOrderType,childId);
        var setDescription = updateWorkDesc(vworkDesc,childId);
}
//End Script 29


//Start Script 23 - Add Ad-Hoc Tasks
var serviceArea;
var autoInspector; 

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
serviceArea = "Public Service Zones-" + serviceArea;
autoInspector = lookup("USER_DISTRICTS", serviceArea);

if(autoInspector == "No Inspector") {
	autoInspector = "CHOLLIFIELD";
}
if(wfTask == "STR: Letter Notice" && wfStatus == "In Violation") {
	activateEnforcementReinspection();
	//deactivateTask("STR: Letter Notice");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Letter Notice","In Violation","","");
	scheduleInspectDate("STR Re-Inspection", nextWorkDay(dateAdd(null, 119)), autoInspector, "", "Scheduled by Script.");
//comment ("inside STR: Letter Notice - in violation");
}

//HD#44614 - remove deactivate and replace with closecase for newUI workflow behavior.  we don't have a "letter notice"--see if above.  commented out.
//HD#44735 - cannot remove these lines b/c reschedules re-inspection.  These come from the workflow diagram by default.  8/3/2018 KCR
if(wfTask == "Letter Notice" && wfStatus == "In Violation") {
	activateEnforcementReinspection();
//	deactivateTask("Letter Notice");
        editTaskSpecific("Letter Notice","Date Letter Mailed",dateAdd(null,0));
	closeTask("Letter Notice","In Violation","","");
	scheduleInspectDate("STR Re-Inspection", nextWorkDay(dateAdd(null, 119)), autoInspector, "", "Scheduled by Script.");
//comment ("inside Letter Notice - in violation");

}
//if(wfTask == "Letter Notice" && wfStatus == "In Violation") {
//	activateEnforcementReinspection();
//	deactivateTask("Letter Notice");
//}

if(wfTask == "Re-Inspection" && wfStatus == "Work Order") {
	addUpdateAdhocTask("STR: PS Work Order");
	//deactivateTask("Re-Inspection");
}
	
if(wfTask == "STR: Board Structure" && wfStatus == "Work Order") {
//	addUpdateAdhocTask("STR: PS Work Order");
        addUpdateAdhocTask("STR: PS WO Board House");
	//deactivateTask("STR: Board Structure");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Board Structure","Work Order","","");
}

if(wfTask == "STR: Begin Demolition Process" && wfStatus == "In Violation") {
	addUpdateAdhocTask("STR: Confirmation on Utilities");
	//deactivateTask("STR: Begin Demolition Process");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Begin Demolition Process","In Violation","","");
}

if(wfTask == "STR: Confirmation on Utilities" && wfStatus == "In Violation") {
	addUpdateAdhocTask("STR: Final Demolition Process");
	//deactivateTask("STR: Confirmation on Utilities");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Confirmation on Utilities","In Violation","","");
}

if(wfTask == "STR: Final Demolition Process" && wfStatus == "Work Order") {
//	addUpdateAdhocTask("STR: PS Work Order");
        addUpdateAdhocTask("STR: PS WO Demo");
	//deactivateTask("STR: Final Demolition Process");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Final Demolition Process","Work Order","","");
}

//NOT SEEING A STR: PS Work Order Task  --- Dead Code.  see PS WO Board House and PS WO Demo below.  HD#44614  commented out.
//if(wfTask == "STR: PS Work Order" && wfStatus == "Completed") {
////	addUpdateAdhocTask("STR: Bill");
//	deactivateTask("STR: PS Work Order");
//}

if(wfTask == "STR: PS WO Board House" && wfStatus == "Completed") {
//	addUpdateAdhocTask("STR: Bill");
//deactivateTask("STR: PS WO Board House");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: PS WO Board House","Completed","","");
//	updateAppStatus("Bill Owed", "Updated by Script.");
}

if(wfTask == "STR: PS WO Demo" && wfStatus == "Completed") {
//	addUpdateAdhocTask("STR: Bill");
	//deactivateTask("STR: PS WO Demo");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: PS WO Demo","Completed","","");
//	updateAppStatus("Bill Owed", "Updated by Script.");
}

if(wfTask == "STR: Cite to Court") {
	
	if(wfStatus == "Violation Corrected") {
		closeEnforcementCaseWorkflow("Violation Corrected");
		//deactivateTask("STR: Cite to Court");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	        closeTask("STR: Cite to Court","Violation Corrected","","");
	}
	
	if(wfStatus == "Work Order") {
		addUpdateAdhocTask("STR: PS Work Order");
		//deactivateTask("STR: Cite to Court");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	        closeTask("STR: Cite to Court","Work Order","","");
	}
}

//if(wfTask == "STR: Public Officer Hearing" && wfStatus == "In Violation") {
//	deactivateTask("STR: Public Officer Hearing");
//}
//Changed deactivate to close  HD#44562 - causes us to not see information when status is set on this task in the new UI.
if(wfTask == "STR: Placard" && wfStatus == "In Violation") {
//	deactivateTask("STR: Placard");
	closeTask("STR: Placard","In Violation","","");
}
//End script 23


//Start Script 16 - Update Service Request Parent Status
if (wfTask == "Initial Inspection" && (wfStatus != "Under Review")) checkRelatedAndCloseSR ();
//End script 16

// KCR RFS#28671 4/2/2019
//
if (wfTask == "Letter Notice" && (wfStatus == "Graffiti Letter Sent")){
//	closeTask("Letter Notice","Graffiti Letter Sent","x","y");
	COK_CE_EMail();
	closeTask("Case Closed","Violation Corrected","a","b");
//comment ("Inside Case Closed - Graffiti Letter Sent");
}

// nlt help desk 35018 4/22/2016
//

if(wfTask == "STR: Lien" && wfStatus == "Lien Owed - Work Still In Progress") {
	updateAppStatus("Lien Owed - Open","Updated by Script.");
}

if(wfTask == "STR: Lien" && wfStatus == "Lien Owed - Work Completed") {
	updateAppStatus("Lien Owed - Closed","Updated by Script.");
}


if(wfTask == "STR: Lien" && wfStatus == "Lien Corrected - Work Still in Progress") {
	updateAppStatus("In Violation","Updated by Script.");  
        deactivateTask("STR: Lien");
}

if(wfTask == "STR: Lien" && wfStatus == "Lien Corrected - Work Completed") {
	updateAppStatus("Completed","Updated by Script.");
        //deactivateTask("STR: Lien");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("STR: Lien","Lien Corrected - Work Completed","","");
	closeEnforcementCaseWorkflow("Violation Corrected");   
        //deactivateTask("Case Closed");  HD#44614 - remove deactivate and replace with closetask for newUI workflow behavior.
	closeTask("Case Closed","Lien Corrected - Work Completed","","");
}


//
//Help Desk Call #35333 Workflow closed but SR not closed
// 

if (wfTask == "Case Closed" && (wfStatus == "Canceled" || wfStatus == "No Violation" || wfStatus == "Violation Corrected")) {
     checkRelatedAndCloseSR();
     deactivateTask("Case Closed");
}

if (childId > "0") {
    capId = childId;
    deactivateTask("Setup Work Order");
    activateTask("Open");
}

//function COK_CE_EMail(capId, inputNotificationTemplate, inputReportName, inputReportModule, inputSource, inputContactType, inputContactEmail, inputEmailCopyTo,rptparamname) {
function COK_CE_EMail() {

//***********************************************************************
//Copied from Function in Custom Script: COKGenerateReportAttachToEMail
//***********************************************************************
//-----
//Build the parameters that are passed to the report template
//-----
	var params = aa.util.newHashtable(); 
showMessage = true;
comment ("In the FUNCTION");
//comment ("wfTask="+wfTask+" wfStatus= "+wfStatus);		

	//0.  $$testing$$  $$altId$$   ????in the subject line????

	//1.  Get the property address
	var v_streetAddressPlus1 = COKFormatCapStreetAddressPlus(capId);
comment ("var streetAddressPlus1="+v_streetAddressPlus1);
	addParameter(params, "$$streetAddressPlus$$", v_streetAddressPlus1);
	//var streetAddressOnly1 = COKFormatCapStreetAddressOnly(capId);
	//addParameter(params, "$$streetAddressOnly$$", streetAddressOnly1);

	//2.  Get the Owner Name  (see EMSEJavaDocs7_3 (P:\Accela\Manuals\EMSE-API 7.3.doc open Index.html)

	getPrimaryOwnerParams4Notification(params)
//	var v_OwnerFullName = getOwnerFullName
//	//returns ownerfullname
//comment ("var streetAddressPlus1="+v_OwnerFullName);
//	addParameter(params, "$$OwnerFullName$$", v_OwnerFullName)
	
	//end 2. Get the Owner Name

//-----
//Look in Standard Choices for who to send the email to.  (See: ASA Service Request Animal Control)
//-----
	emailTo = lookup("COK_CE_EmailTo", "KNOXVILLE/KNOX/ENFORCEMENT/CODES/STRUCTURE/GRAFFITI");
comment ("emailTo="+emailTo);
comment ("params="+params);
	
//-----
//Send the Email
//-----

		//use null for report file parameter if no report is to be attached
		//sendNotification(null,"grandles@knoxvilletn.gov","",inputNotificationTemplate,params,null);
		//parameters:  from, to, cc, templateName, parms, reportfilename
		
		//sendNotification(null,emailTo,"krobnett@knoxvilletn.gov","COK_CE_GRAFFITI",params,null);

		sendNotification("krobnett@knoxvilletn.gov","krobnett@knoxvilletn.gov","krobnett@knoxvilletn.gov","COK_CE_GRAFFITI",null,null);

}


