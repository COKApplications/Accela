var parentRecord = getParent();

if(isEmpty(parentRecord) == false) {
	//Start Script 16 - Update Service Request Parent Status
	if (wfTask == "Open" && (wfStatus == "Canceled" || wfStatus == "Completed")) {
                checkRelatedAndCloseSR ();
                checkRelatedENFAndCloseENF ();
	        deactivateTask("Closed");
    	}
}
	//End Script 16

  if (wfTask == "Open" && (wfStatus == "Canceled" || wfStatus == "Completed")) {
	updateTask("Closed", wfStatus, "Updated by Script.", "Updated by Script.")
	updateAppStatus("Closed", "Updated by Script.");
} 


if((wfTask == "Open") && (wfStatus == "In Queue")){
for (i in wfObj) {
   fTask = wfObj[i];
   if (fTask.getTaskDescription().equals(wfTask) && 
      (fTask.getProcessID() == wfProcessID)) {
       wfAssignedStaff = fTask.getTaskItem().getAssignedUser();
      var taskAssignUser = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
      if (taskAssignUser != null)
       {
         // re-grabbing for userid.
         wfUserObj = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
         v_userID = wfUserObj.getUserID();
  	     assignCap(v_userID);
             editAppSpecific("Assigned To", v_userID);
      }
 //     showMessage = true;
  //    comment ("Workflow Assigned Staff=" + wfAssignedStaff);
  //    comment ("Workflow Assigned StaffUserId=" + v_userID);
}
}
}