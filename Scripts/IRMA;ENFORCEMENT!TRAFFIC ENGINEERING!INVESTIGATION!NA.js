// Enter your script here...

var v_transfer_type = "None";
var v_CE_Initial_insp;
var childId = "0";
var parentId = getCapId;
var parentPriority = capDetail.getPriority();
var v_sr_flag = "0";

if(inspType == "TE Initial Inspection") {
  var v_actionrecommendation  = inspResultComment;
	editTaskSpecific("Set Action Type and Recommendation", "Action Type", inspResult);
	editAppSpecific("WF Task - Action Type", inspResult);	
	editTaskSpecific("Set Action Type and Recommendation","Action Recommendation", v_actionrecommendation) ; 
	editAppSpecific("WF Task - Recommendation", v_actionrecommendation) ; 
    updateTask("TEINVEST: Initial Inspection","Completed","Updated By Initial Inspection");
    updateTask("Set Action Type and Recommendation","Completed","Updated By Initial Inspection");	
    deactivateTask("TEINVEST: Initial Inspection");
    deactivateTask("Set Action Type and Recommendation");
  if(inspResult == "Work Order") {
   TEaddUpdateAdhocTask("TEINVEST: Work Order");
   updateAppStatus("Work Order", "Updated by Script.");
 }	
   else	if(inspResult == "Property Owner Work") {
   updateAppStatus("In Violation Send Letter", "Updated by Script.");
   TEaddUpdateAdhocTask("TEINVEST: Letter Notice");
   TEaddUpdateAdhocTask("TEINVEST: Re-Inspection");
 }
 else if(inspResult == "Transfer To CE ROW Obstruction") {
  updateAppStatus("Transferred", "Updated by Script.");
                v_transfer_type = "ROW Obstruction";
                v_CE_Initial_insp = "ROW Initial Inspection";
}
 else if(inspResult == "Transfer To CE Dirty Lot") {
                 v_transfer_type = "Dirty Lot";
                 v_CE_Initial_insp = "LOT Initial Inspection";
 updateAppStatus("Transferred", "Updated by Script.");
}
else if(inspResult == "Traffic Study") {
  TEaddUpdateAdhocTask("TEINVEST: Traffic Study");
}
else if (inspResult == "Duplicate") {
  updateAppStatus("Completed", "Updated by Script.");
  deactivateTask("TEINVEST: Initial Inspection");
  closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
  closeTask("Case Closed", "Completed", "Updated by Script.", "Updated by Script.");
  checkRelatedAndCloseSR();
}
else if (inspResult == "No Action") {
  updateAppStatus("Approval Requested", "Updated by Script.");
  updateTask("Waiting Completion Of Ad Hoc Tasks","Completed","Updated By Initial Inspection");	
  deactivateTask("Waiting Completion Of Ad Hoc Tasks");
  updateTask("TEINVEST: Initial Inspection", "Completed","Updated by Script.", "");
  deactivateTask("TEINVEST: Initial Inspection");  
  activateTask("Case Closed");  
checkRelatedAndCloseSR();

}
else if (inspResult == "Transfer To KPD" ||
         inspResult == "Transfer To Civil Engineering"  ||
         inspResult == "Transfer To Stormwater") {
  updateAppStatus("Transferred", "Updated by Script.");
  deactivateTask("TEINVEST: Initial Inspection");
  closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
  v_sr_flag = "1";
 closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
 closeTask("Case Closed", "Completed", "Updated by Script.", "Updated by Script.");
}

//Capital Project 
//Other
}

if(inspType == "TE Re-Inspection") {
  updateTask("TEINVEST: Re-Inspection",inspResult,"");
  deactivateTask("TEINVEST: Re-Inspection");
// showMessage = true;
 //  comment("inspResult=" + inspResult);
if(inspResult == "Work Order") {
   TEaddUpdateAdhocTask("TEINVEST: Work Order");
   updateAppStatus("Work Order", "Updated by Script.");
   closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
   activateTask("Case Closed");
}	
   else	if(inspResult == "In Violation Send Letter") {
   TEaddUpdateAdhocTask("TEINVEST: Letter Notice");
   TEaddUpdateAdhocTask("TEINVEST: Re-Inspection");
   closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
    updateAppStatus("In Violation Send Letter", "Updated by Script.");
   activateTask("Case Closed");
}
 else if(inspResult == "Transfer To CE ROW") {
                v_transfer_type = "ROW Obstruction";
 v_CE_Initial_insp = "ROW Initial Inspection";
		activateTask("Case Closed");
updateAppStatus("Transferred", "Updated by Script.");
closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");

}
 else if(inspResult == "Transfer To CE Dirty Lot") {
		activateTask("Case Closed");
                 v_transfer_type = "Dirty Lot";
 v_CE_Initial_insp = "LOT Initial Inspection";
 closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
updateAppStatus("Transferred", "Updated by Script.");
}
else if(inspResult == "Violation Corrected") {
 closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
		activateTask("Case Closed");
                updateAppStatus("Completed", "Updated by Script.");
                checkRelatedAndCloseSR();

}

//In Violation
 

}

if (v_transfer_type != "None") {
 childId = createChild("Enforcement","Codes Enforcement",v_transfer_type,"NA");
 //Start Script 17 - Create and Schedule Initial Inspection
  var serviceArea;
  var autoInspector; 
  copyParcelGisObjects();
   serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
   serviceArea = "Public Service Zones-" + serviceArea;
  editAppSpecific("Service Request Information", "Transferred From Traffic Engineering", childId);
  autoInspector = lookup("USER_DISTRICTS", serviceArea);
  //showMessage = true;
  //comment("serviceArea = " + serviceArea);
  //comment("autoInspector=" + autoInspector);
  //comment("v_CE_INITIAL_insp=" + v_CE_Initial_insp);
  if(autoInspector == "No Inspector") {
	autoInspector = "CHOLLIFIELD";
	}
  if(autoInspector != "No Inspector") {
	scheduleInspectDateChild(v_CE_Initial_insp,nextWorkDay(), autoInspector, "", "Scheduled by Script.");
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
  var xdetailedDescription = 
  "Transferred From Traffic Engineering" + "\r" + 
  "Action Recommendation " + v_actionrecommendation + "\r" + 
  myworkDesc + "\r" + 
  mySRInfo;
  var xsetDescription = updateWorkDesc(xdetailedDescription,childId);
  closeTask("Waiting Completion Of Ad Hoc Task", "Completed", "Updated by Script.", "Updated by Script.");
}
