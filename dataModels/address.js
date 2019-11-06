'use strict'

function _Address(addressLine1, addressLine2, postCode, city, country){
    this.addressLine1=addressLine1;
    this.addressLine2=addressLine2;
    this.postCode=postCode;
    this.city=city;
    this.country=country;

    var setIdAddress=function(idAddress){
        this.idAddress=idAddress;
    }
}

module.exports.Address=_Address;