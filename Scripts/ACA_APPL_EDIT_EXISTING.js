var dbName = "jetspeed";
var sql;
var i = 0;
var message;

//Gettting and updating ASI values in ACA pageflow script

//get capModel since working with temp record
var capModel = aa.env.getValue("CapModel");

var myId = capModel.getCapID();

var myAltId = myId.getCustomID();

//var existingProject = getASIFieldValue(capModel,"PROJECT_INFORMATION","Is This Application For An Existing Project?");

//if  (existingProject == "Yes") {
   var ProjectNumber = getASIFieldValue(capModel,"PROJECT_INFORMATION","Existing Project Number");
   var v_count = "0"; 
   var v_STATUS = "None";
   sql = "select B1_APPL_STATUS, B1_SPECIAL_TEXT from accela.b1permit WHERE b1_alt_id = '"; 
   sql = sql + ProjectNumber + "'";  
   var result = aa.util.select(dbName, sql, null);
   if (result.getSuccess()) {
     v_result = result.getSuccess();
     result = result.getOutput();
     if (i < result.size()) {
     v_STATUS = result.get(i).get("B1_APPL_STATUS");
       }}
      if (v_STATUS == "None") {
 	message = "This appears to an invalid Project Number.</br>If you believe that this message is in error please contact us at 865-215-XXXX";
        displayMessage(message);
          }
     else {
//    update current project name
      v_PROJECT_NAME = result.get(i).get("B1_SPECIAL_TEXT");
     message = "Project Name=" + v_PROJECT_NAME;
     displayMessage(message);
    sql = "update accela.b1permit set B1_SPECIAL_TEXT = '"; 
    sql = sql + v_PROJECT_NAME + "' where b1_alt_id = '";
    sql = sql + myAltId + "'";

   message = "update sql = " + sql;
   displayMessage(message);
    var updateresult = aa.util.update(dbName, sql, null);

//    copy APO

   var v_project = aa.cap.getCapID(ProjectNumber);
 //  var parentCapId = "REC17-00000-000LR"; // v_project.getCapID();
     message = "parentCapId = " + parentCapId;
     displayMessage(message);
 //     var targetCapId = myId; 
     copyAddresses(parentCapId, targetCapId);
//      copyParcel(parentCapId, targetCapId);
 //     copyOwner(parentCapId, targetCapId);
//      copyCapWorkDesInfo(parentCapId, targetCapId);
//    
      }
   
}

function displayMessage(str){
	if(str){
		aa.env.setValue("ErrorCode", "-1");
		aa.env.setValue("ErrorMessage", str);
	}
}

function getASIFieldValue(capModel,subGroupName,labelName)
{
  //can return value, null (label found but no value input), or undefined (label or group does not exist)
  var asiGroups = capModel.getAppSpecificInfoGroups();
  var checklistComment;
  for(var i=0;i< asiGroups.size();i++)
  {
    var asiGroup = asiGroups.get(i);
    var fields = asiGroup.getFields();

    if(asiGroup.getGroupName()!=subGroupName)
    {
      continue;
    }
    if(fields)
    {
      for(var j=0;j<fields.size();j++)
      {        
        var fieldLabel = fields.get(j);            
        if(fieldLabel.getFieldLabel()==labelName)
        {
          checklistComment = fieldLabel.getChecklistComment();
          return checklistComment;
        }          
      }
    }
  }
}

//sets value of ASI field - pass ASI group, ASI field name, new value
function setASIFieldPageFlow(gName,fName,fValue) {
//            var asiGroups = cap.getAppSpecificInfoGroups();
                var asiGroups = capModel.getAppSpecificInfoGroups();
                for (i = 0; i < asiGroups.size(); i++) {
                                if (asiGroups.get(i).getGroupName() == gName) {
                                                for (x = 0; x < asiGroups.get(i).getFields().size(); x++) {
                                                                if (asiGroups.get(i).getFields().get(x).getCheckboxDesc() == fName) {
                                                                                asiGroups.get(i).getFields().get(x).setChecklistComment(fValue);
//                                                                            cap.setAppSpecificInfoGroups(asiGroups);
                                                                                capModel.setAppSpecificInfoGroups(asiGroups);
                                                                                return true;
                                                                }
                                                }
                                }
                }
                return false;
}

