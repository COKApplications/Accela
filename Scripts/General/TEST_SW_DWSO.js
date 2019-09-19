//eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

//run based on ASIT value
//showMessage = true;
//var setDescription = updateWorkDesc("Test ASIT" + "\r");

var alertMessage = "";

//alertMessage += aa.env.getValue("alertMessage");

//var alertMessage = workDescGet(capId);

parentCapId = null;
parentCapIdString = "" + cap.getParentCapID()

aa.env.setValue("ScriptReturnMessage", parentCapIdString);
aa.env.setValue("ScriptReturnCode", "1");


//var setDescription = updateWorkDesc("Test ASIT" + "\r");


//var workDesc = workDescGet(capId);