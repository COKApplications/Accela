if(wfTask == "Open" && wfStatus == "Completed") {
var parentId = getCapId;
  var v_comments = AInfo["Comments"],parentId;
   if(isEmpty(v_comments) == true) {
    showMessage = true;
    comment("ASI Comments are Required");
    cancel = true;
    }
}