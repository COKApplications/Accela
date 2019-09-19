function getScriptText(ipScriptName)
{
    var fvScriptName = ipScriptName.toUpperCase();
    var fvEmseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var fvEmseScript = fvEmseBiz.getScriptByPK(aa.getServiceProviderCode(), fvScriptName, "ADMIN");
    return fvEmseScript.getScriptText() + "";
}

//var tstRecordId = "???";

//Setting the current cap id
//var tstCapId = aa.cap.getCapID(tstRecordId).getOutput();
//aa.print("CapId:" + tstCapId.getID1() + "-" + tstCapId.getID2() + "-" + tstCapId.getID3() + " AltId:" + tstCapId.getCustomID());
//aa.env.setValue("PermitId1", tstCapId.getID1());
//aa.env.setValue("PermitId2", tstCapId.getID2());
//aa.env.setValue("PermitId3", tstCapId.getID3());



eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
v_balanceDue = balanceDue;
showMessage = true;
comment("PPA Script Begin balanceDue=" + v_balanceDue);
if (v_balanceDue == 0){
var v_capId = getCapId();
closeTask("Payment", "Received", "Updated by Script.", "Updated by Script.");
deactivateTask("Payment");
var contractorArray = getLicenseProfessional(v_capId);
for(ca in contractorArray) {
   var thisContractor = contractorArray[ca];
   var licenseType = thisContractor["licenseType"];
   var licenseNbr = thisContractor["licenseNbr"];
   var licenseExpirDate =thisContractor["licenseExpirDate"] 
   var licenseBoard =   thisContractor["licenseBoard"];
}
  var v_license_class_desc = licenseBoard;

  if(isEmpty(v_license_class_desc) == true) {
     v_license_class_desc = "None";
                }

  var v_license_class =  v_license_class_desc.substring(0, 2);
  showMessage = true;
  comment ("License Class=" + v_license_class);


//  if (v_license_class == "B1") {
      
  if (v_license_class == "E5" || v_license_class == "G5" || v_license_class == "ME" || v_license_class == "P5") { 
   comment ("License Class=" + v_license_class + " Reciprocal license needs copy of current permit");
   comment ("Check Documents to see if the current license has already been uploaded");
   comment ("If the current license has been uploaded, use the Workflow to complete the renewal"); 
   activateTask("Reciprocal License Approval");
   }
  else {   
   closeTask("Case Final", "Completed", "Updated by Script.", "Updated by Script.");
   deactivateTask("Case Final");
   updateAppStatus("Completed", "Updated by Script.");
   var d = new Date();
   var yy = d.getFullYear().toString();
   var mm = d.getMonth().toString();
   if (mm.length < 2) {
                mm = "0" + mm;
    }
   if (Number(mm) > 9) {
      yy = Number(yy) + 1;
    }

    var v_LIC_EXPIR_DD =  "12" + "/" + "31" + "/" + yy;  
    var v_expires =  new Date();
    v_expires = v_LIC_EXPIR_DD;
    var licenseNbr = thisContractor["licenseNbr"];
  comment ("License Expires=" + v_LIC_EXPIR_DD);
  comment ("Professional License#=" + licenseNbr);
     comment ("License Expires=" + v_expires);
   comment("licenseType:" + licenseType);
  myProfObject = licenseProfObject(licenseNbr,licenseType);
 //   aa.print("myProf functions");
 // aa.print("myProf functions");
 // aa.print("can we get the status"  + myProfObject.refLicModel.getBusinessName2());
 // myProfObject.refLicModel.setBusinessName2("A");
//  aa.print("can we get the status"  + myProfObject.refLicModel.getBusinessName2());
  var ParsedexpAADate = aa.date.parseDate(v_LIC_EXPIR_DD); 
  myProfObject.refLicModel.setLicenseExpirationDate(ParsedexpAADate); 
   myProfObject.updateRecord();
// licProfScriptModel.setLicenseExpirDate(v_LIC_EXPIR_DD,"ExpireDt");
// aa.licProfScriptModel.setLicenseExpirDate(v_LIC_EXPIR_DD);
//  licEditExpInfo ("A", v_LIC_EXPIR_DD);

//   var v_LP_UPDATE = editLicensedProfessional
//   REC_STATUS = 'A'
}
}
if (true) {
aa.runScript("PAYMENTRECEIVEAFTER4RENEW");
}


