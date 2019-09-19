 
var v_nonmeteredspace = AInfo["Non-Metered Space"];
if (v_nonmeteredspace == "CHECKED") {
    var v_nbrnonmeteredspaces  = AInfo["Number of Non-Metered Spaces"];
    if (isEmpty(v_nbrnonmeteredspaces) == true) {
    showMessage = true;
    comment("****Number of Non-Metered Spaces Is Missing!!!! ");
    cancel = true;
    }
    if (v_nbrnonmeteredspaces < "1") {
    showMessage = true;
    comment("****Number of Non-Metered Spaces Is Missing!!!! ");
    cancel = true;
} 
}

var v_meterremoval = AInfo["Meter Removal"];
if (v_meterremoval == "CHECKED") {
    var v_nbrmeterremovals  = AInfo["Number of Meter Removals"];
    if (isEmpty(v_nbrmeterremovals ) == true) {
    showMessage = true;
    comment("****Number of Meter Removals Is Missing!!!! ");
    cancel = true;
} 
    if (v_nbrmeterremovals < "1") {
    showMessage = true;
    comment("****Number of Meter Removals Is Missing!!!! ");
    cancel = true;
} 

}