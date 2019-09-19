// Enter your script here...
//   aa.env.setValue("ErrorMessage","Address is not in the city");
//eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
//var v_jurisdiction = getGISInfo2ASB("KGIS","Address","Neighborhood");
//if (v_jurisdiction != "1") {
//   aa.env.setValue("ErrorMessage","Address is not in the city");
//}

//check for neighborhood value (jurisdiction) for selected address
//if value <> 1 then address is not in City according to KGIS - halt processing
//if value = 1 then allow to continue

var cap = aa.env.getValue("CapModel");
var parcel = getParcel();
var addressNeighborhood = getAddressNeighborhood();

var message=getMessage(parcel);
var message=getMessage(addressNeighborhood);
displayMessage(message);

function getMessage(parcel){
	var message;
	var parcelobjectid = getGISInfo('KGIS',parcel,'Parcels','OBJECTID');
	message = "Parcel is: " + parcel + " " + parcelobjectid;
	return message;
}

function getMessage(addressNeighborhood){
	var message;
//	message = "City: " + addressNeighborhood;
	if(addressNeighborhood!='1'){
		message = 'This appears to be a location outside of the City. This site is for City permits only.</br>If you believe that this message is in error please contact us at 865-215-XXXX';
	}

	return message;
}

//get address from capmodel
function getAddressNeighborhood(){
	var addressNeighborhood;
	try{
//		addressNeighborhood = cap.getAddressModel().getStreetName();
		addressNeighborhood = cap.getAddressModel().getNeighborhood();
	}catch(err){
		return addressNeighborhood
	}
	return addressNeighborhood;
}
//display message in ACA - stop moving forward
function displayMessage(str){
	if(str){
		aa.env.setValue("ErrorCode", "-1");
		aa.env.setValue("ErrorMessage", str);
	}
}

//get parcel number from capmodel
function getParcel(){
	var parcel;
	try{
		parcel = cap.getParcelModel().getParcelNo();
	}catch(err){
		return parcel;
	}
	return parcel;
}

//get drill-down data for specific parcel number.
function getGISInfo(svc,parcelNumber,layer,attributename)
	{
	var distanceType = "feet";
	var retString = "na";
	if(!parcelNumber){
		return retString;
	}
	//get parcel object
	var fGisObjs = aa.gis.getParcelGISObjects(parcelNumber);
	var fGisObj;
	if(fGisObjs.getSuccess()){
	fGisObj = fGisObjs.getOutput()[0];
	}
	//set buffer object
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
	{
	var buf = bufferTargetResult.getOutput();
	buf.addAttributeName(attributename);
	}

	var bufchk = aa.gis.getBufferByRadius(fGisObj, "0", distanceType, buf);

	if (bufchk.getSuccess())
	var proxArr = bufchk.getOutput();
	else
	{ logDebug("**WARNING: Retrieving Buffer Check Results. Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false } 

	for (a2 in proxArr)
	{
	var proxObj = proxArr[a2].getGISObjects(); // if there are GIS Objects here, we're done
	for (z1 in proxObj)
	{
	var v = proxObj[z1].getAttributeValues()
	retString = v[0];
	}

	}
return retString
}

