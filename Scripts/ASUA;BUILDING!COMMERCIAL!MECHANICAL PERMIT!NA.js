showMessage = true;

var notificationTemplate = "COK_BLD_MESSAGE_PERMIT_ATTACHED";
var reportName = "Electrical Permit";

//call function to generate permit (report) and attach to email using template
//provide capId, template to use, and permit
COKGenerateReportAttachToEmail(capId, notificationTemplate, reportName, "Building", "general", "Contact", "grandles@knoxvilletn.gov", null,"permitid");

comment("Completed");