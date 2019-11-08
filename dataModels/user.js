
'use strict'

function _User(forname, surname, idEmployee){       //hier fehlen noch die Rechte.... darum haben wir uns noch nicht gekümmert
    this.forname=forname;
    this.surname=surname;

    var setIdEmployee=function(idEmployee){
        this.idEmployee=idEmployee;
    }
}

module.exports.User=_User;