/**
 * The below code is related to the Enforcement/Codes Enforcement/Zoning Complaint/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

copyParcelGisObjects();

//Start Script 23 - Add Ad-Hoc Tasks
var serviceArea;
var autoInspector = lookup("COK_ZONING_INSP", "ZONING_INSPECTOR");
var inspectionDays = getAppSpecific("Re-Inspection Days");

if(wfTask == "Letter Notice" && wfStatus == "In Violation") {
	activateEnforcementReinspection();
	deactivateTask("Letter Notice");
    //editTaskSpecific("Letter Notice","Date Letter Mailed",dateAdd(null,0));	
      if(isEmpty(inspectionDays) == true) {
//		scheduleInspectDate("Zoning Re-Inspection", nextWorkDay(dateAdd(null, 13)), autoInspector, "", "Scheduled by Script.");
		scheduleInspectDate("Zoning Re-Inspection", nextWorkDay(dateAdd(null, 13)), getInspector("Zoning Initial Inspection"), "", "Scheduled by Script.");
		assignCap(autoInspector);
		updateTask("Zoning Re-Inspection", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
	} else if(isEmpty(inspectionDays) == false) {
//		scheduleInspectDate("Zoning Re-Inspection", nextWorkDay(dateAdd(null, inspectionDays - 1)), autoInspector, "", "Scheduled by Script.");
		scheduleInspectDate("Zoning Re-Inspection", nextWorkDay(dateAdd(null, inspectionDays - 1)), getInspector("Zoning Initial Inspection"), "", "Scheduled by Script.");
		assignCap(autoInspector);
		updateTask("Zoning Re-Inspection", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
	}
}

if(wfTask == "Re-Inspection") {
	if(wfStatus == "Violation Corrected") {
		closeEnforcementCaseWorkflow("Violation Corrected");
	}
}

//   showMessage = true;
//   comment ("wfTask=" + wfTask);
//if(wfTask == "Initial Inspection") {
//   var taskAssignUser = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
//   comment ("taskAssignUser=" + taskAssignUser);
//   if (taskAssignUser != null) {
//		wfUserObj = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
//	    v_userID = wfUserObj.getUserID();	
//			//getInspector("Initial Inspection")  //inspection description is the parameter.  change line below to use this instead of v_userID?
//		if(v_userID != autoInspector) {
//			//change the inspector on the inspection - don't think I can do this.
//			//assignInspection(seqnumberofinspection, v_userID, capID)  //I think providing capid will update the user on the record.  if not use assign cap.
//			//change the assign to on the record
//			assignCap(v_userID);
//			//send an email to wfStaff person
//			var databaseName = lookup("COK_Database_Name", "Database_Name");
//			var alternateId = capId.getCustomID();
//  comment ("databaseName=" + databaseName + ' alternateId='+ alternateId);
// 			if(databaseName != "AAPROD") {
//				var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS2/NA/NA/NA/NA");
//				var emailSubject = "**This is a test** Forwarding Zoning Violation: " + alternateId;
//				//var emailFrom = autoInspector;
//			} else 	{
//				var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/INSPZONE/NA/NA/NA/NA");
//				var emailSubject = "Forwarding Zoning Violation: " + alternateId ; 
//				//var emailFrom = "krobnett@knoxvilletn.gov";
//				//var emailFrom = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/INSPZFRM/NA/NA/NA/NA");
//			}
//  comment ("emailTo=" + emailTo + " emailSubject=" + emailSubject);
//			var emailFrom = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/INSPZFRM/NA/NA/NA/NA");
//			var emailBody = "A new Zoning Violation has been assigned to you: " + alternateId ;  
//			email(emailTo, emailFrom, emailSubject, emailBody);
//			}
//		}
//	}

//End Script 23

//Start Script 16 - Update Service Request Parent Status
if (wfTask == "Initial Inspection" && (wfStatus == "Canceled" || wfStatus == "No Violation")) checkRelatedAndCloseSR ();
if (wfTask == "Re-Inspection" && (wfStatus == "Violation Corrected")) checkRelatedAndCloseSR ();
if (wfTask == "Bill" && (wfStatus == "Violation Corrected")) {
	deactivateTask("Case Closed")
	updateTask("Case Closed", "Violation Corrected", "Scheduled by Script.", "Scheduled by Script.");
	checkRelatedAndCloseSR ();
}
if (wfTask == "Bill" && (wfStatus == "Cite to Court")) {
	deactivateTask("Bill");
	activateTask("Cite to Court");
	updateTask("Cite to Court", "Under Review", "Scheduled by Script.", "Scheduled by Script.");
}
if (wfTask == "Cite to Court" && (wfStatus == "Cite to Court")) {
	updateAppStatus("Cite to Court", "Updated by Script.");     ///this does not happen
}
//End Script 16

//
//Help Desk Call #35333 Workflow closed but SR not closed
// 

if (wfTask == "Case Closed" && (wfStatus == "Canceled" || wfStatus == "No Violation" || wfStatus == "Violation Corrected")) {
     checkRelatedAndCloseSR();
     deactivateTask("Case Closed");
}

//if (childId > "0") {
//    capId = childId;
//    deactivateTask("Setup Work Order");
//    activateTask("Open");//\\
//}