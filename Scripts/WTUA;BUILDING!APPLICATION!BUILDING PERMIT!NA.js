eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

if((wfTask == "Permit Issuance") && (wfStatus == "Approved" || wfStatus == "Create Permit")) {
    var v_permit = AInfo["Select Permit Type To Create"];
    var v_record_type = lookup("COK_BLD_APPL_PERMITS", v_permit);
    childId = createChild(v_record_type);
    copyOwner(capId, childId);
    copyGisObjectsToChild(childId);
    childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
    editAppSpecific("Council District", childCouncilDistrict, childId);
  }
  
if((wfTask == "Check For Existing Project") && (wfStatus == "Project Exists")) {
   var v_COUNT = "0";
   var v_project = AInfo["Connect This Application To This Existing Project Number"];
   var dbname = "jetspeed";
   var sql = "select count(*) COUNT from ACCELA.B1PERMIT where B1_ALT_ID = '";
   sql = sql + v_project + "'";
   showMessage = true;
   comment("sql = " + sql);
   var result = aa.util.select(dbname, sql, null);
   if (result.getSuccess()) { 
     result = result.getOutput();
     if (i < result.size()) {
     v_COUNT = result.get(i).get("COUNT");
     comment("count = " + v_COUNT);
       }}
      if (v_COUNT == "1") {
       var parentRecord = getParent();
       if(isEmpty(parentRecord)) {
         addParent(aa.cap.getCapID(v_project).getOutput());
       showMessage = true;
        comment("This Application Is Now Related To Project Number " + v_project);
   }
}
    else {
    showMessage = true;
    comment("**This Application Cannot Be Related - Project Number Is Invalid** " + v_project);
    }
       
}

