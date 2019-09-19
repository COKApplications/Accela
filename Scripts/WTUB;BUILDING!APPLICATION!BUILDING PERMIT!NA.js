if((wfTask == "Check For Existing Project") && (wfStatus == "Project Exists")) {
   showMessage = true;
    var capId = getCapId;
      var parentRecord = getParent();
       if(isEmpty(parentRecord) == false) {
        showMessage = true;
       comment ("****This Application Is Already Assigned To A Project Number");
       cancel = true;
   }   

 //  var v_project = AInfo["Connect This Application To This Existing Project Number"], capId; 
 //  var dbname = "jetspeed";
 //  var v_COUNT = "0";
 //  var sql = "select count(*) COUNT from ACCELA.B1PERMIT where B1_ALT_ID = '";
  // sql = sql + v_project + "'";
 //  var result = aa.util.select(dbname, sql, null);
 //  comment("sql = " + sql);
 //  if (result.getSuccess()) { 
 //  result = result.getOutput();
 //    if (i < result.size()) {
 //    v_COUNT = result.get(i).get("COUNT");
  //   comment("count=" + v_COUNT);
  //     }}
  //    if (v_COUNT == "0") {
  //      comment ("****Project Number Is Invalid");
  //     cancel = true;
   //    }
}
