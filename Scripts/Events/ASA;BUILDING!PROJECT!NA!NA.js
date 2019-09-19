// Enter your script here...
copyParcelGisObjects();
var addrsObj = aa.address.getAddressByCapId(capId);
if(addrsObj.getSuccess() ) {
	var addrs = addrsObj.getOutput();
	if(addrs[0] != null){
	showMessage=true;
	comment("Checking Duplicates ....");

		var addrId = addrs[0].getUID();
		//get cap List
		var capList = getRecordsByAddressIdBuffer(addrId,"KGIS","Parcels","PARCELID","-10");
		//filter duplicates
		var dupeList = getFilteredRecords(capList, appTypeString, new Array("Applied"), 21);
		
		//display possible duplicates
		for(var x in dupeList){
			showMessage=true;
			comment("Possible Duplicate: " + dupeList[x]);
		}
	}
}

var ApplicantIs = AInfo["Property Type"];
if  (ApplicantIs == "Residential (One and Two Family Dwellings)") {
    var childId;
    cTypeArray = new Array("Building","Residential","Building Permit","Trade Contractor");
    childId = createChildTempRecord(cTypeArray);
//showMessage = true;
//comment("childId =" + childId);
}