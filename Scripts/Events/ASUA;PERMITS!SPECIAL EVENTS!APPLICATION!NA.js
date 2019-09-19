var myAltId = capId.getCustomID();
var dbName = "jetspeed";
var sql;
var v_eventname = AInfo["Event Name"];
sql = "update accela.b1permit set B1_SPECIAL_TEXT = '"; 
sql = sql + v_eventname + "' where b1_alt_id = '";
sql = sql + myAltId + "'";
showMessage=true;
comment("update sql =" + sql);
var updateresult = aa.util.update(dbName, sql, null);
comment("update success= " + updateresult);

//var parmArray = new Array();
//parmArray[0] = "XXCOK_PS_UPDATE_SCHEDULE";
//parmArray[1] = "KNOXVILLE";
//parmArray[2] = "0";
//parmArray[3] = "0";
//parmArray[4] = "0"; 
//parmArray[5] = v_activeSchedule;
//sql = "insert into XXCOK.XXCOK_RUN_STORED_PROCEDURE (STORED_PROCEDURE, SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, PARAMETER1)";
//sql = sql + " VALUES (?,?,?,?,?,?)";
//var dbName = "jetspeed";
// comment(sql);
// comment(parmArray);
// var result = aa.util.update(dbName, sql, parmArray);
//comment("insert success= " + result);
// } 