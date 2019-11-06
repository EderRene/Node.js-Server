'use strict'

function _Camp(idAddress, name, idLeader){
    this.idAddress=idAddress;
    this.name=name;
    this.idLeader=idLeader;

    var setIdCamp=function(idCamp){
        this.idCamp=idCamp;
    }
}

module.exports.Camp=_Camp;