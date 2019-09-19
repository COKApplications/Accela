if (balanceDue <= 0) {
if (true) {
updateAppStatus("Completed", "Updated by Script.");
var parentLicenseCAPID = getParentLicenseCapID(capId)
updateAppStatus("Active","Updated by script.", parentLicenseCAPID);
aa.runScript("PAYMENTRECEIVEAFTER4RENEW");
}
}