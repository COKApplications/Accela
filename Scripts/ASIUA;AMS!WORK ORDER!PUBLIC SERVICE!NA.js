eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

var v_ChangeAssignedTo = AInfo["Change Assigned To?"];
//    showMessage = true;
 //   comment("ChangeAssignedTo=" + v_ChangeAssignedTo);
if (v_ChangeAssignedTo == "CHECKED") {
    var v_AssignToFromField = AInfo["Assign To"];
    if (isEmpty(v_AssignToFromField) == false) {
        var v_STAFF = lookup("COK_TE_SIGN_STAFF", v_AssignToFromField);
        assignCap(v_STAFF);
        editAppSpecific("Change Assigned To", null);
        editAppSpecific("Assigned To", v_STAFF);
} 
}

var v_AddWorkOrderTask = AInfo["Add Work Order Task?"];
if (v_AddWorkOrderTask  == "CHECKED") {
    editAppSpecific("Add Work Order Task?", null);
    v_WorkOrderTaskToAdd = AInfo["Work Order Task To Add"];
//    showMessage = true;
//    comment ("Work ORder Task To Add=" + v_WorkOrderTaskToAdd);
    editAppSpecific("Work Order Task To Add", null);

var cap1 = capId.getID1();
var cap2 = capId.getID2();
var cap3 = capId.getID3();
//comment(cap1 + " " + cap2 + " " + cap3);
var dbName = "jetspeed";
var i = 0;
var sql = "select count(*) count from accela.gwork_order_task where SERV_PROV_CODE = 'KNOXVILLE' and B1_PER_ID1 = '" + 
cap1 + "' and B1_PER_ID2 = '" + 
cap2 + "' and B1_PER_ID3 = '" + 
cap3 + "' and G1_TASK_CODE = '" + v_WorkOrderTaskToAdd + "'";
//comment(sql);
var result = aa.util.select(dbName, sql, null);
//comment("result=" + result);
if (result.getSuccess()) {
	result = result.getOutput();

	comment("Total # of records: " + result.size());
	
	if (i < result.size()) {
		var v_count = result.get(i).get("COUNT");
 //               comment("v_count=" + v_count);

  if (v_count == "0") {
 var parmArray = new Array();
 parmArray[0] = "XXCOK_ADD_WO_TASK";
 parmArray[1] = "KNOXVILLE";
 parmArray[2] = cap1;
 parmArray[3] = cap2;
 parmArray[4] = cap3; 
 parmArray[5] = v_WorkOrderTaskToAdd;
 sql = "insert into XXCOK.XXCOK_RUN_STORED_PROCEDURE (STORED_PROCEDURE, SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, PARAMETER1)";
 sql = sql + " VALUES (?,?,?,?,?,?)";
// comment(sql);
// comment(parmArray);
var result = aa.util.update(dbName, sql, parmArray);
//comment("insert success= " + result);
}
}
}
}

//Attach TDOT page
//
showMessage = true;
var attach_tdot = AInfo["Attach TDOT Drawing"];
    comment ("attach_tdot=" + attach_tdot);
if  (attach_tdot == "Yes") {
    var attach_tdot_drawing = AInfo["TDOT Drawing To Attach"];
    if (isEmpty(attach_tdot_drawing) == false) {
    comment ("TDOT Drawing=" + attach_tdot_drawing);
    var aaReportName = "Lot Letter";
    var aaReportParamName = "ID";
    var aaReportParamValue = capId;
    var msg = runReportAttach(aaReportName, aaReportParamName, aaReportParamValue);
    editAppSpecific("Attach TDOT Drawing", "No") ; 
    comment ("message=" + msg);    
        }
}