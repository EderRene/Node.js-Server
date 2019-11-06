'use strict'

function _Employee(forname, surname, dateOfBirth, id_Adress, svn, uid, bankAccountNumber, email, phoneNumber){
    this.forname=forname;
    this.surname=surname;
    this.dateOfBirth=dateOfBirth;
    this.id_Adress=id_Adress;
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