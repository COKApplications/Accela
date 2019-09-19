/**
 * The below code is related to the ENFORCEMENT/STORMWATER/DRY WEATHER SCREENING/NA record, with
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

if((wfTask == "DWSO Intake") && (wfStatus == "In Process")){
	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().equals(wfTask) && (fTask.getProcessID() == wfProcessID)) {
			wfAssignedStaff = fTask.getTaskItem().getAssignedUser();
			var taskAssignUser = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
			wfUserObj = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
			v_userID = wfUserObj.getUserID();
			assignCap(v_userID);
			//showMessage = true;
			//comment ("Workflow Assigned Staff=" + wfAssignedStaff);
			//comment ("v_userID=" + v_userID);
		}
	}
}