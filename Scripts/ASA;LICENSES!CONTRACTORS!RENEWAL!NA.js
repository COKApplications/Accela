if (publicUser) {
   showMessage = true;
  comment("I am a public user");
}


if (true) {
//aa.runScript("ApplicationSubmitAfter4Renew");
aa.runScript("APPLICATIONSUBMITAFTER4RENEW");

pCapId = getParentLicenseCapID(capId);

	{
		if (pCapId != false) {
		   capObj = aa.cap.getCap(pCapId).getOutput();
		   cAppName = getAppName(pCapId);
		   editAppName(cAppName);
		   copyLicensedProf(pCapId, capId);
		}
	}
}

var v_capId = getCapId();

//var contractorArray = getLicenseProfessional(v_capId);

var contractorArray = aa.licenseScript.getLicenseProf(v_capId).getOutput();

//var contractorArray = cap.getLicenseProfessionalModel();

var setDescription = updateWorkDesc("Licensed Contractor Renewal");

for(ca in contractorArray) {
   var thisContractor = contractorArray[ca];
   var licenseType = thisContractor["licenseType"];
   var licenseNbr = thisContractor["licenseNbr"];
   var licenseExpirDate =thisContractor["licenseExpirDate"] 
   var licenseBoard =   thisContractor["licenseBoard"];
   showMessage = true;
  comment("licenseType=" + licenseType);
  comment("licenseNbr=" +  licenseNbr);
  comment("licenseExpirDate=" +  licenseExpirDate);
  comment("licenseBoard=" +  licenseBoard);
//   comment("contractorArray[0]=" + contractorArray[0]);
 // var getlicenseExpirDate = aa.licenseprofessional.getlicenseExpirDate(licenseNbr);
 //  comment("getlicenseExpirDate=" +  getlicenseExpirDate);
}

  var v_license_class_desc = licenseBoard;

  if(isEmpty(v_license_class_desc) == true) {
     v_license_class_desc = "None";
	}

  var v_license_class =  v_license_class_desc.substring(0, 2);
  var v_renewal_fee;

  if  (v_license_class == "E1") {
       v_renewal_fee = "LRENEW_E1";
  }
  if  (v_license_class == "E2") {
       v_renewal_fee = "LRENEW_E2";
  }
  if  (v_license_class == "E3") {
       v_renewal_fee = "LRENEW_E3";
  }
  if  (v_license_class == "E4") {
       v_renewal_fee = "LRENEW_E4";
  }
  if  (v_license_class == "E5") {
       v_renewal_fee = "LRENEW_E5";
  }
  if  (v_license_class == "E6") {
       v_renewal_fee = "LRENEW_E6";
  }

if (v_license_class_desc  != "None") {
   addFee(v_renewal_fee, "LICENSED_CONTRACTOR_RENEWAL", "FINAL",1,"Y");
}

  
//addFee("LRENEW_E1", "LICENSED_CONTRACTOR_RENEWAL", "FINAL",1,"Y");

