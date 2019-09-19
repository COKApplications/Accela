var capModel = aa.env.getValue("CapModel");
var callerId = aa.env.getValue("CallerID");
var uploadTypes = new Array();
var notContainsTypes = "";
var capId = capModel.getCapID();

//checks for multiple attachments and tells the user to only make one attachment
 
var docuScriptModel = aa.document.getDocumentListByEntity(capId.toString(), "TMP_CAP");
 
if (!docuScriptModel.getSuccess()) {
       aa.env.setValue("ErrorMessage", docuScriptModel.getErrorMessage());
}
 
var attachmentList = docuScriptModel.getOutput();
 
if (attachmentList != null && attachmentList.size() > 1) {
       aa.env.setValue("ErrorMessage","Cannot accept multiple document, please delete unnecessary files!");
}

//addFee("E_ISS", "BLD_ELE","STANDARD",1,"Y", capId);
