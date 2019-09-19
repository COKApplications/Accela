//set addresses as not primary - then set first as primary
addrs = aa.address.getAddressByCapId(capId).getOutput(); 
for (thisAddr in addrs) {
	addrs[thisAddr].setPrimaryFlag("N"); 
	aa.address.editAddress(addrs[thisAddr]);
}

var nbrOfAddrs = addrs.length;
//showMessage = true;
//comment(nbrOfAddrs);
if (nbrOfAddrs != 0) {
	addrs[0].setPrimaryFlag("Y"); 
	aa.address.editAddress(addrs[0]);
}