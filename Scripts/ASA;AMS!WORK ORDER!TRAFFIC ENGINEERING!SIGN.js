copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

assignCapToDept ("KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA",capId);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

deactivateTask("Setup Work Order");
activateTask("Open");

updateAppStatus("Under Review", "Updated by PRA Script");

var assetListResult = aa.asset.getAssetListByWorkOrder(capId, null);
    if(assetListResult != null){var assetModelList = assetListResult.getOutput();
                for(i=0;i<assetModelList.length;i++){
                  var assetDataModel = assetModelList[i];
                  var capAssetId = assetDataModel.getAssetMasterModel().getG1AssetID();
                  logDebug("The asset name is: " + capAssetId);
                 }}
    var assetName = capAssetId
    if(isEmpty(assetName)) {
      assetName = "No Asset";
		}

workDesc = workDescGet(capId); 
var setDescription = updateWorkDesc("Sign Support " + assetName + " " + "\r" + workDesc);
