assignCapToDept ("KNOXVILLE/KNOX/ENG/STORM/NA/NA/NA",capId);

//showMessage = true;

//Pond Object associated with record
//PondObject = getGISInfo("KGIS", "SWMA Detention Fill", "OBJECTID");
PondObject = getGISInfo("KGIS", "Detention and Retention Ponds", "DEVICEID");
//comment("PondObject: " + PondObject);

//call function to add nearest address-parcel-owner to record if none exists on record
//that function will look up a standard choice called COK_Nearest_Address_Function_Input
//that entry will need the appropriate values GIS layers, attribute, etc. for the record type specified
//var addNearestAddress = COK_Nearest_Address_Function("Enforcement/Stormwater/Detention Pond/NA~SWMA Detention Fill");
var addNearestAddress = COK_Nearest_Address_Function("Enforcement/Stormwater/Detention Pond/NA~Detention and Retention Ponds");

//take return code from function and look up appropriate message in standard choice
//if code = 0 (no issue) may not want to display message
//comment(capId + " cok_error_code: " + addNearestAddress);
var v_get_error_message = lookup("COK_Nearest_Address_Function_Errors", addNearestAddress);
//comment(capId + " v_get_error_message: " + v_get_error_message);
logDebug(capId + " v_get_error_message: " + v_get_error_message);

addrs = aa.address.getAddressByCapId(capId).getOutput(); 
for (thisAddr in addrs) {
	addrs[thisAddr].setPrimaryFlag("N"); 
	aa.address.editAddress(addrs[thisAddr]);
}

var nbrOfAddrs = addrs.length;
//showMessage = true;
//comment(nbrOfAddrs);
if (nbrOfAddrs != 0) {
	addrs[0].setPrimaryFlag("Y"); 
	aa.address.editAddress(addrs[0]);
}