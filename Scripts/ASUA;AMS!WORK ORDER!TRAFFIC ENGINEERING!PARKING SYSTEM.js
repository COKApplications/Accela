showMessage = true;
x = getGISInfo2("KGIS","Parcels","PARCELID", 1000, "feet");
comment("x = " + x);

var capStatus = cap.getCapStatus();

if (capStatus == "Completed" || capStatus == "Canceled") {
var userId = currentUserID;
deactivateTask("Setup Work Order");
deactivateTask("Open");
updateTask("Open", capStatus, "Updated Due To Record Status Change.", userId);
checkRelatedAndCloseSR();
updateTask("Closed", capStatus, "Updated Due To Record Status Change.", userId);
 }

if (capStatus == "In Queue" || capStatus == "In Progress") {
var userId = currentUserID;
deactivateTask("Setup Work Order");
activateTask("Open");
updateTask("Open", capStatus, "Updated Due To Record Status Change.", userId);
}

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

//get nearest address if none on record and parking meter is attached

//showMessage = true;
//showDebug options - true displays on popup screen, 3 displays on popup screen and in log
//showDebug = true;

//call function to add nearest address-parcel-owner to record if none exists on record
//that function will look up a standard choice called COK_Nearest_Address_Function_Input
//that entry will need the appropriate values GIS layers, attribute, etc. for the record type specified
var addNearestAddress = COK_Nearest_Address_Function("AMS/Work Order/Traffic Engineering/Parking System~Parking Meters");

//take return code from function and look up appropriate message in standard choice
//if code = 0 (no issue) may not want to display message
comment(capId + " cok_error_code: " + addNearestAddress);
var v_get_error_message = lookup("COK_Nearest_Address_Function_Errors", addNearestAddress);
comment(capId + " v_get_error_message: " + v_get_error_message);
logDebug(capId + " v_get_error_message: " + v_get_error_message);

//get nearest address if none on record and parking zone is attached
var addNearestAddress = COK_Nearest_Address_Function("AMS/Work Order/Traffic Engineering/Parking System~Parking Zones");

//take return code from function and look up appropriate message in standard choice
//if code = 0 (no issue) may not want to display message
comment(capId + " cok_error_code: " + addNearestAddress);
var v_get_error_message = lookup("COK_Nearest_Address_Function_Errors", addNearestAddress);
comment(capId + " v_get_error_message: " + v_get_error_message);
logDebug(capId + " v_get_error_message: " + v_get_error_message);


showMessage = true;

//get intersection for parking meter if one on record
var addNearestIntersection = COK_Nearest_Intersection_Function("AMS/Work Order/Traffic Engineering/Parking System~Parking Meters");

comment(capId + " add intersection cok_error_code: " + addNearestIntersection);

//get intersection for parking zone if one on record
var addNearestIntersection = COK_Nearest_Intersection_Function("AMS/Work Order/Traffic Engineering/Parking System~Parking Zones");

comment(capId + " add intersection cok_error_code: " + addNearestIntersection);

//test asset information

//display and change asset attributes
//note that code for changing is commented out

var assetListResult = aa.asset.getAssetListByWorkOrder(capId,null);

if(assetListResult != null){

	var assetModelList = assetListResult.getOutput();

	for(i=0;i<assetModelList.length;i++){
		var assetDataModel = assetModelList[i];
		capAssetSeqNum = assetDataModel.getAssetMasterModel().getG1AssetSequenceNumber();
		//comment("capAssetSeqNum: " + capAssetSeqNum);

		x = aa.asset.getAssetData(capAssetSeqNum).getOutput().getAssetDataModel();
		//comment("x: " + x);
		var a = x.getDataAttributes();

		for (var i = 0;i < a.size(); i++) {
			var z = a.get(i);
			comment("attribute " + z.getG1AttributeName() + " = " + z.getG1AttributeValue());

			//if asset is VENDOR then change value to Donuts
			//note that this changes the value in the actual asset itself - not just a transactional value
			//if (z.getG1AttributeName().equals("VENDOR")) {
			//	z.setG1AttributeValue("Donuts");  
			//	comment("setting to Donuts");
			//}
			//aa.asset.editAsset(x);
		}

	}
}

