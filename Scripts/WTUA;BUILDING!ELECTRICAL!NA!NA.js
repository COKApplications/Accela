// Enter your script here...
  v_myexpire = dateAddMonths (null,12);
  showMessage = true;
  comment ("myexpire=" + v_myexpire);

if (wfTask == "Application Submittal" && (wfStatus == "Application Approved")) {
    activateTask("Permit Issuance");
    deactivateTask("Application Submittal");
    updateAppStatus("Approved", "Updated by PRA Script");

}
   
if (wfTask == "Permit Issuance" && (wfStatus == "Open")) {
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
    editAppSpecific("Issued",v_issued);

    var v_yy = Number(yy) + 1;
    var v_expires =  new Date();
    v_expires = mm + "/" + dd + "/" + v_yy;

    editAppSpecific("Expires",v_expires);
      	}

if (wfTask == "Permit Issuance" && (wfStatus == "Open")) {
    v_subtype = AInfo["Electrical Permit Sub Type"];
    v_capid = getCapId;
   if (v_subtype == "New Construction Single Family") {
  scheduleInspectDate("Electrical Final", nextWorkDay(dateAdd(null, -1)), v_AsgnStaff , "", "Scheduled by Script.");
 --   createPendingInspection("BLD-ELE","Electrical Final",v_capid); 
 --  createPendingInspection("BLD-ELE","Electrical Slab",v_capid);
 --  createPendingInspection("BLD-ELE","Electrical Ditch",v_capid);
 --  createPendingInspection("BLD-ELE","Electrical Wall Rough-In",v_capid);
  -- createPendingInspection("BLD-ELE","Electrical Ceiling Rough-In",v_capid);
 --  createPendingInspection("BLD-ELE","Electrical Progress",v_capid);
 --  createPendingInspection("BLD-ELE","Electrical Notify Utility OK to Conn",v_capid);
 }
 }