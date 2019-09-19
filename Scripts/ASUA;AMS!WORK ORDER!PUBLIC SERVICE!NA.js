var capStatus = cap.getCapStatus();

if (capStatus == "Completed" || capStatus == "Canceled" || "Closed") {
var userId = currentUserID;
deactivateTask("Setup Work Order");
deactivateTask("Open");
updateTask("Open", capStatus, "Updated Due To Record Status Change.", userId);
checkRelatedAndCloseSR();
}