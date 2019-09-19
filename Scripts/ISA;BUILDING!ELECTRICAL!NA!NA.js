showMessage = true;
comment("ISA Script Start");

var estValue = 0; var calcValue = 0; var feeFactor			// Init Valuations
var valobj = aa.finance.getContractorSuppliedValuation(capId,null).getOutput();	// Calculated valuation
if (valobj.length) {
	estValue = valobj[0].getEstimatedValue();
	calcValue = valobj[0].getCalculatedValue();
	feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
	}

aa.print("Estimated Value: " + estValue);
aa.print("Calculated Valuation: " + calcValue);
aa.print("Fee Factor: " + feeFactor);

var balanceDue = 0 ; var houseCount = 0; feesInvoicedTotal = 0;		// Init detail Data
var capDetail = "";
var capDetailObjResult = aa.cap.getCapDetail(capId);			// Detail
if (capDetailObjResult.getSuccess())
	{
	capDetail = capDetailObjResult.getOutput();
	var houseCount = capDetail.getHouseCount();
	var feesInvoicedTotal = capDetail.getTotalFee();
	var balanceDue = capDetail.getBalance();
	}

aa.print("House Count: " + houseCount);
aa.print("Fees Invoiced Total: " + feesInvoicedTotal);
aa.print("Balance Due: " + balanceDue);

//var parInfo = new Array();
//loadParcelAttributes(parInfo, capId);

var parcelTract = AInfo["ParcelAttribute.Tract"];
var parcelStatus = AInfo["ParcelAttribute.ParcelStatus"];
var parcelLegalDesc = AInfo["ParcelAttribute.LegalDesc"];
var parcelBlock = AInfo["ParcelAttribute.Block"];
var parcelLot = AInfo["ParcelAttribute.Lot"];
var parcelMapNo = AInfo["ParcelAttribute.MapNo"];
var parcelMapRef = AInfo["ParcelAttribute.MapRef"];

aa.print("Parcel Tract: " + parcelTract);
aa.print("Parcel Status: " + parcelStatus);
aa.print("Parcel LegalDesc: " + parcelLegalDesc);
aa.print("Parcel Block: " + parcelBlock);
aa.print("Parcel Lot: " + parcelLot);
aa.print("Parcel MapNo: " + parcelMapNo);
aa.print("Parcel MapRef: " + parcelMapRef);

var addressstreetName = AInfo["AddressAttribute.streetName"];

aa.print("Address Street Name: " + addressstreetName);

aa.print("\n");


var vFrom = aa.env.getValue("From");
//var vInspectorFirstName = aa.env.getValue("InspectorFirstName");
//var vInspectorLastName = aa.env.getValue("InspectorLastName");

//display inspections information in debug window
//loops through all inspections for record
myResult = aa.inspection.getInspections(capId);

if(myResult.getSuccess()) {
	myInspections = myResult.getOutput();
} 
else {
	aa.print(myResult.getErrorMessage());
	aa.abortScript();
}
i=0;
while(i < myInspections.length) {
	theItem = myInspections[i];
	aa.print(theItem.getIdNumber());
	aa.print(theItem.getInspectionType());
	aa.print(theItem.getScheduledDate().getMonth() + "/" + theItem.getScheduledDate().getDayOfMonth() + "/" + theItem.getScheduledDate().getYear());
	aa.print(theItem.getScheduledTime());
	aa.print(theItem.getInspector());
	aa.print(theItem.getInspector().getFirstName());
	aa.print(theItem.getInspector().getLastName());
	aa.print(theItem.getInspectionStatusDate().getMonth() + "/" + theItem.getInspectionStatusDate().getDayOfMonth() + "/" + theItem.getInspectionStatusDate().getYear());
	aa.print(theItem.getInspectionStatus() + "\n");
	i = i + 1;
}

//highest numbered would be most current?

//in app inspector cannot be assigned 
//still need a way to check if inspector is filled in
//inspector name does not work - is blank even if "inspector" has a value
//ACA should be from ACA, AA is from AA, App has no value

if (vFrom != "ACA" || vFrom != "AA"){

//can do editAppSpecific if needed
//    editAppSpecific("Ward", "From: " + vFrom);

//lookup inspector from std choice user_districts
    var vinspectorArea = AInfo["Inspection Area"];
    var vinspDisciplineDistrict = "Electric Inspection Zones-" + vinspectorArea;
    var autoInspector = lookup("USER_DISTRICTS", vinspDisciplineDistrict);

//	comment("Inspector: " + autoInspector);

    var vinspId = aa.env.getValue("InspectionIdList");

//    assignInspection(vinspId,"BLDTEST"); 
    assignInspection(vinspId,autoInspector); 
}

/*
var vinspInspector = inspInspector;
comment("Inspector: " + vinspInspector);

if (vinspInspector != "BLDTEST") {

	//var vinspType = inspType;
	//comment("Inspection Type: " + vinspType);

	var vinspectorArea = AInfo["Inspection Area"];
	comment("Inspection Area from ASI: " + vinspectorArea);

	var vinspDisciplineDistrict = "Electric Inspection Zones-" + vinspectorArea;
	comment("Inspection Discipline District: " + vinspDisciplineDistrict);

	var autoInspector = lookup("USER_DISTRICTS", vinspDisciplineDistrict);
	comment("Found Inspector: " + autoInspector);

	var vinspId = inspId;
	comment("Inspection ID: " + vinspId);

	assignInspection(vinspId,"BLDTEST"); 
}
*/