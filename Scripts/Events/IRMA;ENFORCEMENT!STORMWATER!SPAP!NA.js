if(inspResult == "Completed") {
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
    var v_inspected_date = mm + "/" + dd + "/" + yy;
    editAppSpecific("Last City Inspection",inspResultDate);
}
