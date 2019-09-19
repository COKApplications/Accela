var capStatus = cap.getCapStatus();

if (capStatus == "Completed" || capStatus == "Canceled") {
var userId = currentUserID;
deactivateTask("Setup Work Order");
deactivateTask("Open");
updateTask("Open", capStatus, "Updated Due To Record Status Change.", userId);
checkRelatedAndCloseSR();
  if (capStatus == "Completed") {
     activateTask("Closed");
   }
}

if (capStatus == "In Queue" || capStatus == "In Progress") {
var userId = currentUserID;
deactivateTask("Setup Work Order");
activateTask("Open");
updateTask("Open", capStatus, "Updated Due To Record Status Change.", userId);
}