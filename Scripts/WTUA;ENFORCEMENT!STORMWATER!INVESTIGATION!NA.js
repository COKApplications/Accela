/**
 * The below code is related to the Enforcement/Stormwater/Investigation/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

var v_transfer = "0";
var v_close = "0";
var v_CE = "0";
var v_CE_Initial_insp;
var v_SR = "0"; 
var v_work_order_type = "";
var vcomment = wfComment;
var WorkDesc = wfComment;
var childId = "0";
var parentId = getCapId;
var v_userID = "";
//var taskId = getWorkflowId;
var parentPriority = capDetail.getPriority();
var AssignedToDept = "KNOXVILLE/KNOX/ENG/STORM/NA/NA/NA";

showMessage = true;
comment("start WTUA script");
var currentuser;
currentuser = aa.env.getValue("CurrentUserID");
comment("currentuser: " + currentuser);



if((wfTask == "Assign Inspection") && (wfStatus == "Completed")){
	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().equals(wfTask) && (fTask.getProcessID() == wfProcessID)) {
			wfAssignedStaff = fTask.getTaskItem().getAssignedUser();
			var taskAssignUser = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
			if (taskAssignUser != null) {
				// re-grabbing for userid.
				wfUserObj = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
				v_userID = wfUserObj.getUserID();
				assignCap(v_userID);
				var v_AsgnStaff = v_userID; 
				scheduleInspectDate("SW Inspection", nextWorkDay(dateAdd(null, -1)), v_AsgnStaff , "", "Scheduled by Script.");
			}
			//      showMessage = true;
			//     comment ("Workflow Assigned Staff=" + wfAssignedStaff);
			//     comment ("Workflow Assigned StaffUserId=" + v_userID);
		}
	}
}

if((wfTask == "Set Action Type and Recommendation")  && (wfStatus == "Approved" || wfStatus == "Completed" || wfStatus == "Transfer to Another Department")){
	deactivateTask("Set Action Type and Recommendation");
	var v_actiontype = AInfo["Action"];
	var v_actionrecommendation =  AInfo["Action Recommendation"];
	var v_servicerequest = AInfo["Transfer-Service Request Type"];
	editAppSpecific("WF Task - Recommendation", v_actionrecommendation) ; 
	editAppSpecific("WF Task - Action Type", v_actiontype);
	var natureOfRequest = workDescGet(capId);
	if (v_actiontype == "Property Owner Work") {
		childId = "0";
		//	TEaddUpdateAdhocTask("TEINVEST: Letter Notice");
		//	TEaddUpdateAdhocTask("TEINVEST: Re-Inspection");
		//        activateTask("Waiting Completion Of Ad Hoc Tasks");
	}

	if (v_actiontype == "Work Order") {
		TEaddUpdateAdhocTask("SWINVEST: Work Order");
		activateTask("Waiting Completion Of Ad Hoc Tasks");

	}
 
	if (v_actiontype == "Transfer To Codes Enforcement Dirty Lot") {
		v_close = "1";
		v_CE = "1";
		v_transfer = "1";
		v_CE_Initial_insp = "LOT Initial Inspection";
		updateAppStatus("Transferred", "Updated by Script.");
		childId = createChild("Enforcement","Codes Enforcement","Dirty Lot","NA");

	}

	if (v_actiontype == "Transfer To Codes Enforcement ROW Obstruction") {
		v_CE = "1";
		v_close = "1";
		v_transfer = "1";
		v_CE_Initial_insp = "ROW Initial Inspection";
		updateAppStatus("Transferred", "Updated by Script.");
		childId = createChild("Enforcement","Codes Enforcement","ROW Obstruction","NA");
	}
 
	if (v_actiontype == "Transfer To Civil Engineering") {
		v_SR = "1";
		updateAppStatus("Transferred", "Updated by Script.");
		if(isEmpty(v_servicerequest) == false) {	
			childId = createChild("ServiceRequest",v_servicerequest,"NA","NA");
		}
		v_close = "1";
		v_transfer = "1";
	}
 
	if (v_actiontype == "Transfer To Stormwater") {
		v_SR = "1";
		if(isEmpty(v_servicerequest) == false) {	
			childId = createChild("ServiceRequest",v_servicerequest,"NA","NA");
		}
		updateAppStatus("Transferred", "Updated by Script.");
		v_close = "1";
		v_transfer = "1";
	}

	if (v_actiontype == "Transfer To KPD") {
		childId = 0;
		v_close = "1";
		updateAppStatus("Transferred", "Updated by Script.");
	}

	if (v_actiontype == "No Action") {
		childId = 0;
		updateAppStatus("Approval Requested", "Updated by Script.");
		deactivateTask("Waiting Completion Of Ad hoc Tasks");
		updateTask("TEINVEST: Initial Inspection", "Completed","Updated by Script.", "");
		deactivateTask("TEINVEST: Initial Inspection");
		activateTask("Case Closed");
		checkRelatedAndCloseSR();
	}

	if (v_actiontype == "Field Inspection") {
		scheduleInspectDate("TE Initial Inspection", nextWorkDay(dateAdd(null, 0)), autoInspector, "", "Scheduled by Script.");
		TEaddUpdateAdhocTask("TEINVEST: Initial Inspection");
		activateTask("Waiting Completion Of Ad Hoc Tasks");
	}
}

var autoInspector = "";

comment("Checking for WO");

 
if(wfTask == "SWINVEST: Work Order" && wfStatus == "Create Work Order") {
	v_work_order_type = AInfo["Work Order Type:"];
	v_due_to_paving = AInfo["Problem Due To Paving?"];

	//showMessage = true;
	comment("WO type: " + v_work_order_type);
	comment("Problem due to paving: " + v_due_to_paving);

	editAppSpecific("Problem Due To Paving?",v_due_to_paving);
	if (v_work_order_type == "Marking") {
		childId = createChild("AMS", "Work Order", "Traffic Engineering", "Marking");
		AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA";
		assignCapToDept(AssignedToDept ,childId);
		editAppSpecific("Source of Call", "Stormwater Engineering",childId); 
	}

	if (v_work_order_type == "Parking System") {
		childId = createChild("AMS", "Work Order", "Traffic Engineering", "Parking System");
		AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/PARKING/NA/NA";
		assignCapToDept(AssignedToDept ,childId);
	}

	if (v_work_order_type == "Operations") {
		childId = createChild("AMS", "Work Order", "Traffic Engineering", "Operations");
		AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/OPERATNS/NA/NA";
		assignCapToDept(AssignedToDept ,childId); 
	}

	if (v_work_order_type == "Sign") {
		childId = createChild("AMS", "Work Order", "Traffic Engineering", "Sign");
		AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA";
		assignCapToDept(AssignedToDept ,childId);
	}

	if (v_work_order_type == "Signal") {
		childId = createChild("AMS", "Work Order", "Traffic Engineering", "Signal");
		AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGNAL/NA/NA";
		assignCapToDept(AssignedToDept ,childId); 
	}


	if (v_work_order_type == "Public Service Work Order") {

		//Start Script 20 - Create Public Server Work Order Record

		var workorderType = AInfo["Public Service Work Order Type"];
		//  showMessage = true;
		  comment ("workorderType=" + workorderType);

		WorkDesc = workorderType + "\r" + WorkDesc;
		childId = createChild("AMS", "Work Order", "Public Service", "NA");

		editAppSpecific("Work Order Type", workorderType, childId);
		
		editAppSpecific("Source of Call","Stormwater Engineering", childId);
		
		v_servicerequestinfo = AInfo["311 Service Request Info"];  
		v_sourceofcall = AInfo["Source of Call"];
		v_ServiceRequestType = AInfo["311 Service Request Type"];
		v_requestinfo = "Source of Call " + v_sourceofcall + "\r" +
					   "311 Service Request Type " + v_ServiceRequestType + "\r" +
					   "Service Request Info " + v_servicerequestinfo;
		editAppSpecific("311 Service Request Info"),
		CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
		editAppSpecific("Council District", CouncilDistrict, childId);
		//10-19-18 Added Assign To User Current User for Engineering Construction
		if (workorderType == "PS52 Engineering Construction") {
                   comment("PS52 Engineering Construction " + currentuser);		
                   assignCap(currentuser, childId);
		}
		
		//comment("Work Order Type: " + workorderType);
	
		//End Script 20

		//Start Script 03 - Update Department
		var serviceArea;
		var assignedDepartment;
		var foreman;
		serviceArea = getGISInfo("KGIS","Public Service Zones","Zone_");
		editAppSpecific("Work Center", serviceArea + "SVC AREA " + serviceArea, childId);
		editAppSpecific("Service Area", serviceArea, childId);
		assignedDepartment = lookup("WO_TYPES", workorderType);
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
                if (workorderType == "PS52 Engineering Construction") {
                   foreman = currentuser
		   comment("PS52 Engineering Construction - Foreman: " + currentuser) ;		
                   assignCap(foreman, childId);
                 }
		logDebug("The Work Order Type is " + workorderType + ".");
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
		}
		//End Script 29
	}

	if (v_work_order_type == "Contractor Work Order") {

		//Start Script 21 - Create Stormwater Work Order Record

		var workorderType = "Contractor Work Order";
		

		WorkDesc = workorderType; 
		//+ "\r" + WorkDesc;
		childId = createChild("AMS", "Work Order", "Stormwater", "Stormwater");
		editAppSpecific("Work Order Type", workorderType, childId);
		editAppSpecific("Source of Call","Stormwater Engineering", childId);
		v_servicerequestinfo = AInfo["311 Service Request Info"];  
		v_sourceofcall = AInfo["Source of Call"];
		v_ServiceRequestType = AInfo["311 Service Request Type"];
		v_requestinfo = "Source of Call " + v_sourceofcall + "\r" +
					   "311 Service Request Type " + v_ServiceRequestType + "\r" +
					   "Service Request Info " + v_servicerequestinfo;
		editAppSpecific("311 Service Request Info"),
		CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
		editAppSpecific("Council District", CouncilDistrict, childId);

		//End Script 21
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
	copyAssets(cap, childId);
	var parentIntersection = AInfo["Intersection"];
	editAppSpecific("Intersection", parentIntersection, childId);
	// if(isEmpty(workorderType) == true) {
	var setDescription = updateWorkDesc(WorkDesc,childId); 
	editAppSpecific("Source of Call","Stormwater Engineering", childId);
	//  }
}

if (v_CE == "1") {
	//Start Script 17 - Create and Schedule Initial Inspection
	var serviceArea;

	copyParcelGisObjects();
	serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
	serviceArea = "Public Service Zones-" + serviceArea;
	autoInspector = lookup("USER_DISTRICTS", serviceArea);
	if(autoInspector != "No Inspector") {
		scheduleInspectDateChild(v_CE_Initial_insp, nextWorkDay(), autoInspector, "", "Scheduled by Script.");
	}
	if(autoInspector == "No Inspector") {
		autoInspector = "CHOLLIFIELD";
	}
	assignCap(autoInspector, childId);
	//End Script 17
}

//
//Help Desk Call #35333 Workflow closed but SR not closed
// 

if (wfTask == "Case Closed" && (wfStatus == "Canceled" || wfStatus == "Completed" || wfStatus == "Approved")) {
	checkRelatedAndCloseSR();
	deactivateTask("Case Closed");
}

if (wfTask == "TEINVEST: Re-Inspection" && wfStatus == "Work Order") {
	TEaddUpdateAdhocTask("SWINVEST: Work Order");
	activateTask("Waiting Completion Of Ad Hoc Tasks");
}

if (wfTask == "TEINVEST: Re-Inspection" && wfStatus == "In Violation Send Letter") {
	TEaddUpdateAdhocTask("TEINVEST: Letter Notice");
}

if (wfTask == "TEINVEST: Re-Inspection" && wfStatus == "Transfer to CE Dirty Lot") {
	v_close = "1";
	v_CE = "1";
	v_transfer = "1";
	v_CE_Initial_insp = "LOT Initial Inspection";
	updateAppStatus("Transferred", "Updated by Script.");
	childId = createChild("Enforcement","Codes Enforcement","Dirty Lot","NA");
}

if (wfTask == "TEINVEST: Re-Inspection" && wfStatus == "Transfer to CE ROW") {
	v_CE = "1";
	v_close = "1";
	v_transfer = "1";
	v_CE_Initial_insp = "ROW Initial Inspection";
	updateAppStatus("Transferred", "Updated by Script.");
	childId = createChild("Enforcement","Codes Enforcement","ROW Obstruction","NA");
}

if (wfTask == "TEINVEST: Re-Inspection" && wfStatus == "Violation Corrected") {
	deactivateTask("TEINVEST: Re-Inspection");
	deactivateTask("Waiting Completion Of Ad Hoc Tasks");
	updateAppStatus("Completed", "Updated by Script.");
	v_close = "1";
}

//In Violation
//In Violation Send Letter
//Transfer to CE Dirty Lot
//Transfer to CE ROW
//Violation Corrected
//Work Order

if (wfTask == "TEINVEST: Letter Notice" && wfStatus == "Completed") {
	var autoInspector = capDetail.getAsgnStaff();
	editTaskSpecific("TEINVEST: Letter Notice","Date Letter Mailed",dateAdd(null,0));
	//  editTaskSpecific("TEINVEST: Letter Notice","Date Letter Mailed",Date());
	scheduleInspectDate("TE Re-Inspection", nextWorkDay(dateAdd(null, 13)), autoInspector, "", "Scheduled by Script.");
	deactivateTask("TEINVEST: Letter Notice"); 
	//activateTask("TEINVEST: Re-Inspection");
}

//if ((wfTask == "Initial Review" || wfTask == "TEINVEST: Traffic Study")) {				
// var see_actiontype = AInfo["Action Type"];				
// if(isEmpty(see_actiontype) == false) {				
//   editAppSpecific("Action Type", see_actiontype, parentId);  				
//}				
//}				

if(wfTask == "Set Action and Recommendation" && wfStatus == "Approved") {
	updateTask("Set Action and Recommendation", "Completed","Updated by Script.", "");
};

if(wfTask == "Traffic Study" && wfStatus == "Approved") {
	updateTask("Traffic Study", "Completed","Updated by Script.", "");
	deactivateTask("Traffic Study");
};

if (v_close == "1"){
	deactivateTask("Waiting Completion Of Ad hoc Tasks");
	activateTask("Closed");
	updateTask("Closed","Approval Requested","Updated by Script.","");
	checkRelatedAndCloseSR ();
};

if ((childId != "0") && (v_transfer > "0")) {
	var myworkDesc = workDescGet(capId);
	var mySRInfo = AInfo["311 Service Request Info"];
	var xdetailedDescription = 
	"Transferred From Stormwater" + "\r" + 
	"Action Recommendation " + v_actionrecommendation + "\r" + 
	myworkDesc + "\r" + 
	"311 SR Info " + mySRInfo;
	var xsetDescription = updateWorkDesc(xdetailedDescription,childId);
}

//if ((wfTask == "Set Action Type and Recommendation")  && (wfStatus == "Duplicate - Close" || wfStatus == "No Action Needed" || wfStatus == "Transfer to Another Department")){
//     deactivateTask("Case Closed");
//}

if((wfTask == "Set Action Type and Recommendation")  && (wfStatus == "Duplicate - Close" || wfStatus == "No Action Needed")){
	checkRelatedAndCloseSR();
}

if(wfTask == "SWINVEST: Work Order" && wfStatus == "Create Work Order" && childId != "0") {
	updateAppStatus("Pending", "Updated by Script.",childId);
	updateAppStatus("Work Order", "Updated by Script.");
	var v_approvalYN = AInfo["Additional setup required?"];
	if(v_approvalYN == "N" ) {
		updateAppStatus("Approval Requested", "Updated by Script.", childId);
		capId = childId;
		updateTask("Setup Work Order", "Approval Requested","Updated by Script.","");
	}

	if(v_approvalYN == "Approved" ) {
		updateAppStatus("Under Review", "Updated by Script.",childId);
		capId = childId;
		deactivateTask("Setup Work Order");
		activateTask("Open");
	}		
};

if((wfTask == "Waiting Completion Of Ad Hoc Tasks")  && (wfStatus == "Relate To Existing Stormwater Investigation")) {   
	existingSWInvest = AInfo["Relate to this existing investigation"]; 
}
