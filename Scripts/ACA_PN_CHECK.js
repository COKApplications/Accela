//ACA_PN_CHECK
//pageflow script
//Can get temp ID like 17EST-00000-00606
//Had to add function to get ASI value for project number
//Executes SQL to check if project number exists

//note cannot include Accela functions here - gives scripting error

//get capModel since working with temp record
var capModel = aa.env.getValue("CapModel");

var myId = capModel.getCapID();
var myAltId = myId.getCustomID();

//returns null
//var vProjectNumber;
//vProjectNumber = getAppSpecific("Project Number", myId);

//need capModel, ASI Sub Group, ASI Field Label
//field label must be value from ASI setup, not necessarily the label that is on the screen
var vProjectNumber = getASIFieldValue(capModel,"GENERAL","Project Number");
//var vTypeofBuilding = getASIFieldValue(capModel,"GENERAL","Type of Building");

//if no project number was entered, skip remainder of processing

if (vProjectNumber != null && vProjectNumber != "") {
	//capitalize number for consistency in checking
	vProjectNumber = vProjectNumber.toUpperCase();
	
	var sql = "select B1_ALT_ID, B1_PER_TYPE, B1_PER_SUB_TYPE, B1_PER_CATEGORY, B1_SPECIAL_TEXT, B1_APPL_STATUS, ";
	sql = sql + "B1_APPL_STATUS_DATE, B1_APP_TYPE_ALIAS, B1_PARCEL_NBR, B1_PRIMARY_PAR_FLG, B1_PARCEL_STATUS, B1_SUBDIVISION, ";
	sql = sql + "B1_HSE_NBR_START, B1_STR_DIR, B1_STR_NAME, B1_STR_SUFFIX, ";
	sql = sql + "case  ";
	sql = sql + "  when B1_STR_DIR is null then B1_HSE_NBR_START||' '||B1_STR_NAME||' '||B1_STR_SUFFIX ";
	sql = sql + "  else B1_HSE_NBR_START||' '||B1_STR_DIR||' '||B1_STR_NAME||' '||B1_STR_SUFFIX ";
	sql = sql + "end as ADDRESS_STRING, ";
	sql = sql + "B1_PRIMARY_ADDR_FLG, ACCELA.B1PERMIT.B1_PER_ID1, ACCELA.B1PERMIT.B1_PER_ID2, ACCELA.B1PERMIT.B1_PER_ID3 ";
	sql = sql + "from accela.b1permit, accela.b3parcel, accela.b3addres ";
	sql = sql + "where accela.b1permit.serv_prov_code = 'KNOXVILLE' ";
	sql = sql + "and accela.b1permit.b1_per_id1 = accela.b3parcel.b1_per_id1 "
	sql = sql + "and accela.b1permit.b1_per_id2 = accela.b3parcel.b1_per_id2 "
	sql = sql + "and accela.b1permit.b1_per_id3 = accela.b3parcel.b1_per_id3 "
	sql = sql + "and accela.b1permit.b1_per_id1 = accela.b3addres.b1_per_id1 "
	sql = sql + "and accela.b1permit.b1_per_id2 = accela.b3addres.b1_per_id2 "
	sql = sql + "and accela.b1permit.b1_per_id3 = accela.b3addres.b1_per_id3 "
	sql = sql + "and b1_alt_id = '" + vProjectNumber + "' ";
	sql = sql + "order by accela.b3parcel.b1_primary_par_flg desc, accela.b3addres.b1_primary_addr_flg desc"

	var dbName = "jetspeed";
	var result = aa.util.select(dbName, sql, null);

	var totalRecords = 0;
	var projectFound = "NO";
	var projectInfo = "";
	var projectAlias = "";
	var projectStatus = "";
	var projectParcel = "";
	var projectAddressString = "";
	var projectId1 = "";
	var projectId2 = "";
	var projectId3 = "";
	if (result.getSuccess()) {
		result = result.getOutput();
		totalRecords = result.size();
		if (totalRecords > 0) {
			//if found only a single record should be found with that project number
			projectFound = "YES";
			projectAlias = result.get(0).get("B1_APP_TYPE_ALIAS");
			projectStatus = result.get(0).get("B1_APPL_STATUS");
			projectParcel = result.get(0).get("B1_PARCEL_NBR");
			projectId1 = result.get(0).get("ACCELA.B1PERMIT.B1_PER_ID1");
			projectId2 = result.get(0).get("ACCELA.B1PERMIT.B1_PER_ID2");
			projectId3 = result.get(0).get("ACCELA.B1PERMIT.B1_PER_ID3");
			projectAddressString = result.get(0).get("ADDRESS_STRING");
			projectInfo = vProjectNumber + "<BR> Type: " + projectAlias + "<BR> Status: " + projectStatus;
			projectInfo = projectInfo + "<BR> Parcel: " + projectParcel + "<BR> Address: " + projectAddressString;
		}else{
			projectFound = "NO";
		}
	}
	//add checks for record type, status, parcel, etc. - if invalid force field to be cleared before processing continues
	//handle not found vs. found but not improper status, parcel, etc.

	var message;

	if (projectFound == "YES"){
		//display message during testing
		//message = "myId is: " + myId + " vProjectNumber: " + vProjectNumber + " totalRecords: " + totalRecords + " Project Found: " + projectFound + " Type: " + typeAlias;
		//message = "Project Found: " + projectInfo;

		var capModelUpdated;
		capModelUpdated = setASIFieldPageFlow("GENERAL","Lot Num",projectAddressString);
		
		message = "Lot Num Not Updated";

		//update - still will require user to save or complete application
		if (capModelUpdated) {
			aa.env.setValue("CapModel",capModel);
			message = "Lot Num Updated";
		}

//17EST	00000	00635

//myId is in the format 17EST-00000-00635	
//using 3 id pieces - add gives result of true the first time and false after that
//note that newId is not like 17EST-00000-00635 - it is an object
//should this be aa.cap or capModel?
//does not error but does not add parcel

		var capParcel = aa.parcel.getCapParcelModel().getOutput();
//		message = "capParcel: " + capParcel;

		var idsplit;
		idsplit = myId.toString().split("-");

		var id1 = idsplit[0];
		var id2 = idsplit[1];
		var id3 = idsplit[2];
		
//		var newId = aa.cap.getCapID("17EST", "00000", "00635");
		var newId = aa.cap.getCapID(id1, id2, id3);
		var altID = newId.getOutput().getCustomID();

		capParcel.setCapIDModel(newId.getOutput());

//Is this setting as primary?
		capParcel.setL1ParcelNo(projectParcel);

		capParcel.setParcelNo(projectParcel);

		var addParcelResult = aa.parcel.createCapParcel(capParcel);
//		message = "addParcelResult: " + addParcelResult.getSuccess() + " newId: " + newId + " altID: " + altID + " myId: " + myId + " myAltId: " + myAltId + " id1: " + id1;
//		displayMessage(message);

		aa.env.setValue("CapModel",capModel);

	//2nd set of code for copy parcel - uses functions found lower in script
	//will not run - error when trying getParcelandAttribute
	//var projectId = aa.cap.getCapID(projectId1, projectId2, projectId3);
	//var projectId = aa.cap.getCapID(projectId1 + "-" + projectId2 + "-" + projectId3).getOutput();
	//var tmpprojectId = "17PLM-00000-00124";
	//var projectId = aa.cap.getCapID(tmpprojectId).getOutput();
	//var capParcelResult = aa.parcel.getParcelandAttribute(projectId,null);

	//message = "projectId: " + projectId;
	//message = "capParcelResult.getSuccess(): " + capParcelResult.getSuccess();
	//displayMessage(message);

	
	//copyParcel(parentCapId, targetCapId);		
	//copyParcel(projectId, newId);		

	//var copyParcels = getParcel(projectId);
	//var s_result = aa.parcel.getParcelandAttribute(projectId, null);

	//aa.env.setValue("CapModel",capModel);
		
	}else{
		//display message and halt processing
		//message = "Project Number: " + vProjectNumber + " not found. Please check the value and re-enter. " + sql;
		message = "Project Number: " + vProjectNumber + " not found. Please check the value and re-enter.";
		message = message + "<BR><BR>You may need to Save and resume later (in the lower right of this page), ";
		message = message + "<BR>then return to the Search Permits and Records Page to find the correct Project Number.";
		message = message + "<BR>At that time you can Resume Application on this record (" + myAltId + ") and enter the correct Project Number.";
		message = message + "<BR><BR>If this permit is not associated with an existing project, then please clear the Project Number field.";
		message = message + "<BR>If you cannot determine the Project Number, contact our office and we can assist you.";
		displayMessage(message);
	}	

}

//may want to make this a custom function assuming that it can be accessed from ACA
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
//	var asiGroups = cap.getAppSpecificInfoGroups();
	var asiGroups = capModel.getAppSpecificInfoGroups();
	for (i = 0; i < asiGroups.size(); i++) {
		if (asiGroups.get(i).getGroupName() == gName) {
			for (x = 0; x < asiGroups.get(i).getFields().size(); x++) {
				if (asiGroups.get(i).getFields().get(x).getCheckboxDesc() == fName) {
					asiGroups.get(i).getFields().get(x).setChecklistComment(fValue);
//					cap.setAppSpecificInfoGroups(asiGroups);
					capModel.setAppSpecificInfoGroups(asiGroups);
					return true;
				}
			}
		}
	}
	return false;
} 

//display message in ACA - stop moving forward
function displayMessage(str){
	if(str){
		aa.env.setValue("ErrorCode", "-1");
		aa.env.setValue("ErrorMessage", str);
	}
}

function copyParcel(srcCapId, targetCapId)
{
  //1. Get parcels with source CAPID.
  var copyParcels = getParcel(srcCapId);
  if (copyParcels == null || copyParcels.length == 0)
  {
    return;
  }
  //2. Get parcel with target CAPID.
  var targetParcels = getParcel(targetCapId);
  //3. Check to see which parcel is matched in both source and target.
  for (i = 0; i < copyParcels.size(); i++)
  {
    sourceParcelModel = copyParcels.get(i);
    //3.1 Set target CAPID to source parcel.
    sourceParcelModel.setCapID(targetCapId);
    targetParcelModel = null;
    //3.2 Check to see if sourceParcel exist.
    if (targetParcels != null && targetParcels.size() > 0)
    {
      for (j = 0; j < targetParcels.size(); j++)
      {
        if (isMatchParcel(sourceParcelModel, targetParcels.get(j)))
        {
          targetParcelModel = targetParcels.get(j);
          break;
        }
      }
    }
    //3.3 It is a matched parcel model.
    if (targetParcelModel != null)
    {
      //3.3.1 Copy information from source to target.
      var tempCapSourceParcel = aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, 

      sourceParcelModel).getOutput();
      var tempCapTargetParcel = aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, 

      targetParcelModel).getOutput();
      aa.parcel.copyCapParcelModel(tempCapSourceParcel, tempCapTargetParcel);
      //3.3.2 Edit parcel with sourceparcel. 
      aa.parcel.updateDailyParcelWithAPOAttribute(tempCapTargetParcel);
    }
    //3.4 It is new parcel model.
    else
    {
      //3.4.1 Create new parcel.
      aa.parcel.createCapParcelWithAPOAttribute(aa.parcel.warpCapIdParcelModel2CapParcelModel

      (targetCapId, sourceParcelModel).getOutput());
    }
  }
}

function isMatchParcel(parcelScriptModel1, parcelScriptModel2)
{
  if (parcelScriptModel1 == null || parcelScriptModel2 == null)
  {
    return false;
  }
  if (parcelScriptModel1.getParcelNumber().equals(parcelScriptModel2.getParcelNumber()))
  {
    return true;
  }
  return  false;
}

function getParcel(capId)
{
  capParcelArr = null;
  var s_result = aa.parcel.getParcelandAttribute(capId, null);
  if(s_result.getSuccess())
  {
    capParcelArr = s_result.getOutput();
    if (capParcelArr == null || capParcelArr.length == 0)
    {
      aa.print("WARNING: no parcel on this CAP:" + capId);
      capParcelArr = null;
    }
  }
  else
  {
    aa.print("ERROR: Failed to parcel: " + s_result.getErrorMessage());
    capParcelArr = null;  
  }
  return capParcelArr;
}
