//showMessage = true;

var notificationTemplate = "COK_BLD_MESSAGE_INSP_RESULT";

//call function to generate permit (report) and attach to email using template
//provide capId, template to use, and permit

//need to determine contact email and CC information
var contactEmail = "grandles@knoxvilletn.gov";
COKGenerateReportAttachToEmail(capId, notificationTemplate, null, "Building", "inspection", "Applicant", contactEmail, null);

//comment("Completed");