if (wfTask == "Application Submittal" && (wfStatus == "Approved")) {
    activateTask("Open");
    deactivateTask("Application Submittal");
    updateAppStatus("Active", "Updated by PRA Script");
    var d = new Date();
    var yy = d.getFullYear().toString();
    var mm = (d.getMonth() + 1).toString();
    if (mm.length < 2) {
	mm = "0" + mm;
    }
    var dd = d.getDate().toString();
    if (dd.length < 2) {
	dd = "0" + dd;
    }
    var v_issued = mm + "/" + dd + "/" + yy;
     editFirstIssuedDate(v_issued);
//     editAppSpecific("Date of Coverage",v_issued);
    var v_yy = Number(yy) + 5;
    var v_expires =  new Date();
    v_expires = mm + "/" + dd + "/" + v_yy;
    var renewal = licEditExpInfo("Active",v_expires);
   var notificationTemplate = "COK_PERMIT_APPLICATION_APPROVED";
   //var reportName = "Parking Permit Permit";
   var reportName;
   //call function to generate permit (report) and attach to email using template
   //provide capId, template to use, and permit
   //COKGenerateReportAttachToEmail(capId, notificationTemplate, reportName, "Enforcement", "Workflow", "Contact", "grandles@knoxvilletn.gov", null,"ID");
      	}

