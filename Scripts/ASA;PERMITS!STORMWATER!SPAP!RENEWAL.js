//var v_script_run = "NO";

if (true) {
//aa.runScript("ApplicationSubmitAfter4Renew");
aa.runScript("APPLICATIONSUBMITAFTER4RENEW");
updateTask("Active","Active","Updated By Initial Inspection");
//v_script_run = "APPLICATIONSUBMITAFTER4RENEW was run";
};

assignCapToDept ("KNOXVILLE/KNOX/ENG/STORM/NA/NA/NA",capId);
var v_parent_capId = getParentCapID4Renewal(capId);
var v_parent_altId = v_parent_capId.getCustomID(); 

//application name = project name = special text
//var cap = aa.cap.getCap(v_parent_capId).getOutput();
//var v_capName = cap.getSpecialText();

var parentLicenseCAPID = getParentLicenseCapID(capId);
// copyParcelGisObjects(parentLicenseCAPID,capId);
 copyParcelGisObjects(v_parent_capId,capId);

 var save_capId = capId;
 capId = parentLicenseCAPID;

 var v_description = workDescGet(parentLicenseCAPID);

 capId = save_capId;
// var workdesc = "Renewal for: " + v_parent_altId + " - " + v_description + " - " + v_script_run;
 var workdesc = "Renewal for: " + v_parent_altId + " - " + v_description;
 var setDescription = updateWorkDesc(workdesc);

