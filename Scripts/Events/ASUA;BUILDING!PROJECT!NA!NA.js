//ASUA:BUILDING/PROJECT/NA/NA

//test changing status and creating temp permit for ACA from that

//showMessage = true;

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

var itemCap = capId;
ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
ctm.setGroup("Building");
ctm.setType("Commercial");
ctm.setSubType("Mechanical Permit");
ctm.setCategory("NA");
var childId = aa.cap.createSimplePartialRecord(ctm, null, "INCOMPLETE EST").getOutput();
copyAddresses(itemCap, childId);
copyParcels(itemCap, childId);
copyOwner(itemCap, childId);
copyContactsByType(itemCap, childId, "Applicant");
copyContactsByType(itemCap, childId, "License Holder");
copyContactsByType(itemCap, childId, "Contact");
//copyCapWorkDesInfo(itemCap, childId);

aa.cap.copyCapWorkDesInfo(itemCap, childId);
aa.cap.copyCapDetailInfo(itemCap, childId);

copyAppName(itemCap, childId);

//can check origination of record
//var childProofCap = aa.cap.getCap(childId).getOutput();
//var initiatedProduct = childProofCap.getInitiatedProduct();
//comment("initiatedProduct: " + initiatedProduct);

addParent(itemCap);

//new function - 9.19.16 - JChalk - Accela
function copyAppName(srcCapId, targetCapId) {
    var sourceCap = aa.cap.getCap(srcCapId).getOutput();
	//logDebug("SourceCap is: " + sourceCap);
    var targetCap = aa.cap.getCap(targetCapId).getOutput();
    var appName = "";
    if (sourceCap.getSpecialText()) {
          appName = sourceCap.getSpecialText();
          var setAppNameSuccess = targetCap.setSpecialText(appName);
    }
	setNameResult = aa.cap.editCapByPK(targetCap.getCapModel());

	if (!setNameResult.getSuccess())
		{ logDebug("**WARNING: error setting cap name : " + setNameResult.getErrorMessage()) ; return false }
}


