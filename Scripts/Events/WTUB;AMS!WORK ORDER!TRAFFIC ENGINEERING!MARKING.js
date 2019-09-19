if((wfTask == "Open") && (wfStatus == "In Queue")){
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