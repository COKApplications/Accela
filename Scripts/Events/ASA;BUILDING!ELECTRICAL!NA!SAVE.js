eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);
trafficzone = getGISInfo("KGIS", "Traffic Zones (2000 Census)", "TAZ");
editAppSpecific("Traffic Zone", trafficzone);
zoning =  getGISInfo("KGIS", "Zoning Labels", "ZONE_LABEL");
editAppSpecific("Zoning", zoning);
var today = new Date();
editAppSpecific("Applied",dateFormatted(today.getMonth()+1,today.getDate(),today.getFullYear(),"MM/DD/YYYY"));

InspectorName = getGISInfo("KGIS", "Electric Inspection Zones", "Inspector",-1,"feet");
//InspectorInitials = getGISInfo("KGIS", "Electric Inspection Zones", "Comments",-1,"feet");
//comment("Insp Name: " + InspectorName);
//comment("Insp Initials: " + InspectorInitials);
InspectorArea = getGISInfo("KGIS", "Electric Inspection Zones", "OBJECTID",-1,"feet");
editAppSpecific("Inspection Area", InspectorArea);

//validate building permit# and then link this permit to the building permit
var v_capId = getCapId();
var v_buildingpermit = AInfo["Building Permit#"];
if (isEmpty(v_buildingpermit) == false) { 
    var pCapId = aa.cap.getCapID(v_buildingpermit).getOutput();
    if (isEmpty(pCapId) == true) {
       showMessage = true;
       comment("Building Permit Is Invalid");
       cancel = true;
     }
else
      showMessage = true;
      comment("1 Building Permit Is Valid pCapId=" + pCapId);
     var addparent = aa.cap.createAssociatedFormsHierarchy(pCapId,v_capId);
 //     var linkparent = aa.cap.createAssociatedFormsHierarchy(pCapId,v_capId);
 //     var v_palternateId = pCapId.getCustomID();
 //     comment ("1 Building Permit Alternate Id=" + v_palternateId);
     var vv_newalternateId = v_buildingpermit + "-EL" + "01"; 
     comment ("1 New Alternate Id=" + vv_newalternateId);
   var vv_update = aa.cap.updateCapAltID(v_capId, vv_newalternateId);

}

//PermitsPlus triggers lhn/

//COMMENT	Charge issuance	fee for commercial	and new non-comm	0
//COMP	Sub_Type	"NSFR"		2
//COMP	Sub_Type	"NDUP"		2
//COMP	Sub_Type	"NMFR"		2
//
//

//AUTO ADD FEES
// 

  var v_charge_issue_fee = "N";
  var v_sub_type = AInfo["Sub Type"];
  var v_construction_type = lookup("COK_BLD_ELE_SUB_TYPES", v_sub_type);
  var v_see_result = v_construction_type.search("COMMERCIAL");
   if (v_construction_type.search("(COMMERCIAL)") != -1) {
       v_charge_issue_fee = "Y";
    }
else
  if (v_construction_type.search("(NEW NON-COMMERCIAL)") != -1) {
      v_charge_issue_fee = "Y";
    }

   showMessage = true;
  // logDebug("v_charge_issue_fee=" + v_charge_issue_fee);
  // comment("v_charge_issue_fee=" + v_charge_issue_fee);
  // comment("v_see_result=" + v_see_result);

 if (v_charge_issue_fee == "Y") {
   addFee("E_ISS", "BLD_ELE", "STANDARD",1,"N");
// example: addFee("CE_LATE", "CE_CODE", "FINAL", Balance, "N");

}

var workDesc = workDescGet(capId);

//set short desc = 1st 80 of original long desc
var workDesc = workDescGet(capId);
//comment("Work Desc: " + workDesc);
var workDescString = workDesc.toString();
var workDescLength = workDescString.length();
//comment("Work Desc Len: " + workDescLength);

if (workDescLength > 80) {
//    comment("Work Desc more than 80");
    var workDescShort = workDesc.substring(0, 80);
//    comment("Work Desc Short: " + workDescShort);
    var setShortNotes = updateShortNotes(workDescShort, capId);
}
else {
    var setShortNotes = updateShortNotes(workDesc, capId);
}

workDesc = v_sub_type + " - " +   workDesc;
var setDescription = updateWorkDesc(workDesc);



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

  if(isEmpty(v_license_class_desc) == true) {
     v_license_class_desc = "NONE";
	}

  var v_license_class =  v_license_class_desc.substring(0, 2);
  if(v_license_class != "E1" && v_license_class != "E5"){
  var v_sub_type = AInfo["Sub Type"];
  var v_valid_classes = lookup("COK_BLD_ELE_SUB_TYPES", v_sub_type);
  if (v_valid_classes.search("ELEC_" + v_license_class) == -1) {
    showMessage = true;
    comment("****Contractor's License Class Is Invalid For This Sub Type****!!!! ");
 //  cancel = true;
    updateAppStatus("Error","");
}
}


//
//public ScriptResult getLicenseProf(com.accela.aa.aamain.cap.CapIDModel capID)
//getLicenseProfessional
//getRefLicenseProf 
//

//determine if parent building permit exists
var parentRecord = getParent();

if(isEmpty(parentRecord) == false) {

    var parentBLD = getParents("Building/*/*/*");
    comment("parentBLD = " + parentBLD);
}
else {
    comment("NO BUILDING PERMIT FOUND");
}

var v_parentId = getParent();
if (isEmpty(v_parentId) == false) {
showMessage = true;
var v_childId = getCapId;
var v_parentalternateId = v_parentId.getCustomID();
comment ("2 Parent Alternate Id=" + v_parentalternateId);
var v_newalternateId = v_parentalternateId + "-EL" + "01"; 
comment ("2 New Alternate Id=" + v_newalternateId);
var v_update = aa.cap.updateCapAltID(v_capId, v_newalternateId);
}