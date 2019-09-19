var v_capId = getCapId();
var contractorArray = getLicenseProfessional(v_capId);
showMessage = true;
//comment("contractorArray=" + contractorArray);

for(ca in contractorArray) {
   var thisContractor = contractorArray[ca];
   var licenseType = thisContractor["licenseType"];
   var licenseNbr = thisContractor["licenseNbr"];
   var licenseExpirDate =thisContractor["licenseExpirDate"] 
   var licenseBoard =   thisContractor["licenseBoard"];
//   comment("licenseType=" + licenseType);
 //  comment("licenseNbr=" +  licenseNbr);
 //  comment("licenseExpirDate=" +  licenseExpirDate);
 //  comment("licenseBoard=" +  licenseBoard);
//   comment("contractorArray[0]=" + contractorArray[0]);
 // var getlicenseExpirDate = aa.licenseprofessional.getlicenseExpirDate(licenseNbr);
 //  comment("getlicenseExpirDate=" +  getlicenseExpirDate);
}

//
//Licensed Professional Contractor Electrical Class
//
//E1 - Electrical Contractor
//E2 - Electrical Residential
//E3 - Electrical Maintenance
//E4 - Electrical Appliance Dealer
//E5 - Electrical Special Limited State License
//E6 - Electrical Low Voltage
//HO -  Home Owner
//
//E1 and E5 can do any subtype
//


//  var v_license_class_desc = AInfo["Contractor License Class"];

  var v_license_class_desc = licenseBoard;
  var v_license_class =  v_license_class_desc.substring(0, 2);
  if(v_license_class != "E1" && v_license_class != "E5"){
  var v_sub_type = AInfo["Sub Type"];
  var v_valid_classes = lookup("COK_BLD_ELE_SUB_TYPES", v_sub_type);
  if (v_valid_classes.search("ELEC_" + v_license_class) == -1) {
    showMessage = true;
    comment("****Contractor's License Class Is Invalid For This Sub Type****!!!! ");
 //  cancel = true;
 //   updateAppStatus("Error","");
}
}

var myLicNbr = "E000414";
var myLicType = "Electrical Contractor";
var myLic = licenseProfObject(myLicNbr,myLicType);

if(myLic.valid){
    comment("Valid License: " + myLicNbr + " " + myLicType);
    var testType = myLic.refLicModel.getLicenseType();
    comment("testType: " + testType);

	var thisDate = new Date();
//only convert date to readable format if needed
//date compare works better in native format
//	var thisDate = jsDateToMMDDYYYY(thisDate);
	
    var testDateType = "EXPIRE";
    var testDate = refLicProfGetDate(myLicNbr, testDateType);
//  testDate = jsDateToMMDDYYYY(testDate);
    comment("testDate: " + testDate + " testDateType: " + testDateType);
	if (thisDate > testDate){
	    comment("License has expired as of: " + thisDate);
	}
	else {
	    comment("License has not expired as of: " + thisDate);
	}

//INSURANCE = SURETY BOND ON Reference Professional Form
    var testDateType = "INSURANCE";
    var testDate = refLicProfGetDate(myLicNbr, testDateType);
    comment("testDate: " + testDate + " testDateType: " + testDateType);

    var testDateType = "BUSINESS";
    var testDate = refLicProfGetDate(myLicNbr, testDateType);
    comment("testDate: " + testDate + " testDateType: " + testDateType);

    var vBusinessName = refLicProfGetAttribute(myLicNbr, "Business Name");
    comment(vBusinessName);

    myLic.copyToRecord(v_capId,true);
    comment("Licensed Professional " + myLicNbr + " " + testType + " added to record");
}
else {
    comment("Not A Valid License: " + myLicNbr + " " + myLicType);
}

comment("Completed");
