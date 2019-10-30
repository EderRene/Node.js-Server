'use strict'

function _Employee(forname, surname, dateOfBirth, idAdress, svn, uid, bankAccountNumber, email, phoneNumber){
    this.forname=forname;
    this.surname=surname;
    this.dateOfBirth=dateOfBirth;
    this.idAdress=idAdress;
    this.svn=svn;
    this.uid=uid;
    this.bankAccountNumber=bankAccountNumber;
    this.email=email;
    this.phoneNumber=phoneNumber;

    var setIdEmployee=function(idEmployee){
        this.idEmployee=idEmployee;
    }
}

module.exports.Employee=_Employee;