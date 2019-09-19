eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

showMessage = true;
var alternateId = capId.getCustomID();
var cap1 = capId.getID1();
var cap2 = capId.getID2();
var cap3 = capId.getID3();
comment(cap1 + " " + cap2 + " " + cap3);
var dbName = "jetspeed";
var sql = "select B1_CHECKBOX_DESC, B1_CHECKLIST_COMMENT ";
sql = sql + "from accela.bchckbox ";
sql = sql + "where serv_prov_code = 'KNOXVILLE' ";
sql = sql + "and b1_per_id1 = '" + cap1 + "' ";
sql = sql + "and b1_per_id2 = '" + cap2 + "' ";
sql = sql + "and b1_per_id3 = '" + cap3 + "' ";
sql = sql + "order by b1_group_display_order, b1_display_order "
comment(sql);
var result = aa.util.select(dbName, sql, null);

if (result.getSuccess()) {
	result = result.getOutput();
	var i = 0;
	comment("Total # of records: " + result.size());

	if (i < result.size()) {
		for (i = 0; i < result.size(); i++) { 
			var fieldValue = result.get(i).get("B1_CHECKBOX_DESC") + " | " + result.get(i).get("B1_CHECKLIST_COMMENT");
			comment("Value is: " + fieldValue);		
		}
	}
}

comment("Completed");