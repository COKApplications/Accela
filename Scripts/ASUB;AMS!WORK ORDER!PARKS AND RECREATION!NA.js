if(appStatus == "Completed") {  
var v_comment = AInfo("Comments");
   if(isEmpty(v_comment) == true) {
    showMessage = true;
    comment("Comment Is Missing");
    cancel = true;
    }
}