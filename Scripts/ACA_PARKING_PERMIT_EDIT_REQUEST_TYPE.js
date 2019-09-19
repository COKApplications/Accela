var capModel = aa.env.getValue("CapModel");
var meterbagging = getASIFieldValue(capModel,"PARKING_PERMIT_TYPE","Meter Bagging");
var nonmeteredspaces = getASIFieldValue(capModel,"PARKING_PERMIT_TYPE","Non-Metered Space");
var annualpermit = getASIFieldValue(capModel,"PARKING_PERMIT_TYPE","Annual Permit");
var meterremoval = getASIFieldValue(capModel,"PARKING_PERMIT_TYPE","Meter Removal");

if ((meterbagging != "CHECKED") && 
   (nonmeteredspaces != "CHECKED") && 
  (annualpermit != "CHECKED") && 
   (meterremoval != "CHECKED")) {
message = "You must select a Request Type";
displayMessage(message);
} 



//assetListResult = aa.asset.getAssetListByWorkOrder(capId, null);
//if(assetListResult != null){
//	var assetModelList = assetListResult.getOutput();
//	for(i=0;i<assetModelList.length;i++){
//		var assetDataModel = assetModelList[i];
//		var capAssetId = assetDataModel.getAssetMasterModel().getG1AssetID();
//		logDebug("The asset name is: " + capAssetId);
//	}
//}
//var assetName = capAssetId;
//if(isEmpty(assetName)) {
//	assetName = "No Asset";
//}
//}


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

function displayMessage(str){
	if(str){
		aa.env.setValue("ErrorCode", "-1");
		aa.env.setValue("ErrorMessage", str);
	}
}