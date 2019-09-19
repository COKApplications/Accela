var  workOrderType = AInfo["Updated.Work Order Type"];
   var  psworkOrderType = AInfo["Updated.Public Service Work Order Type"];

if(wfTask == "TEINVEST: Work Order" && wfStatus == "Create Work Order") {
   if(isEmpty(workOrderType) == true) {
    showMessage = true;
    comment("****Work Order Type Is Missing");
    cancel = true;
    }
}

if(wfTask == "TEINVEST: Work Order" && wfStatus == "Create Work Order"  &&  workOrderType == "Public Service"  ) {
   if(isEmpty(psworkOrderType) == true) { 
   showMessage = true;
    comment("****Public Service Work Order Type Is Missing");
    cancel = true;
    }
}

if((wfTask == "After Assigning-Set Request Type and Put In Queue") && (wfStatus == "Completed")){
for (i in wfObj) {
   fTask = wfObj[i];
   if (fTask.getTaskDescription().equals(wfTask) && 
      (fTask.getProcessID() == wfProcessID)) {
       wfAssignedStaff = fTask.getTaskItem().getAssignedUser();
      var taskAssignUser = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
   var see_user = wfAssignedStaff.toString();
 //  if (wfAssignedStaff.search("KNOX") == -1) {
     if (see_user.search("KNOX") == -1) {
         showMessage = true;
         comment ("****This Workflow Has Not Been Assigned");
         comment ("Workflow Assigned Staff=" + wfAssignedStaff);
         cancel = true;
                }

}
}
}