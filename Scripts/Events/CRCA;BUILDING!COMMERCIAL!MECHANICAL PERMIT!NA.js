//CRCA:BUILDING/COMMERCIAL/MECHANICAL PERMIT/NA

var notificationTemplate = "COK_BLD_PERMIT_THANKS_FOR_SUBMITTAL";

//call function to generate permit (report) and attach to email using template
//provide capId, template to use, and permit

//need to determine contact email and CC information
var contactEmail = "grandles@knoxvilletn.gov";
COKGenerateReportAttachToEmail(capId, notificationTemplate, null, "Building", "general", "Applicant", contactEmail, null);