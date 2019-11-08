'use strict'

function Employee(id_Employee, forname, surname, dateOfBirth, id_Adress, svn, uid, bankAccountNumber, email, phoneNumber){
    this.id_Employee=id_Employee;
    this.forname=forname;
    this.surname=surname;
    this.dateOfBirth=dateOfBirth;
    this.id_Adress=id_Adress;
    this.svn=svn;
    this.uid=uid;
    this.bankAccountNumber=bankAccountNumber;
    this.email=email;
    this.phoneNumber=phoneNumber;
}

module.exports=Employee;