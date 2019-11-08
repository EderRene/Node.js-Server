
'use strict'

function _User(forname, surname, idEmployee){       //hier fehlen noch die Rechte.... darum haben wir uns noch nicht gekümmert
    this.idEmployee=idEmployee;
    this.forname=forname;
    this.surname=surname;
}

module.exports.User=_User;