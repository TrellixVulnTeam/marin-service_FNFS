'use strict';
var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var bcSdk = require('../src/blockchain/blockchain_sdk');
var user = 'dhananjay.p';
var affiliation = 'marine';

function BD() {
    var connection = mysql.createConnection({
        user: 'root',
        password: 'rpqb123',
        host: 'localhost',
        database: 'marine_db'
    });
    return connection;
}
var objBD = BD();

//exports is used here so that registerUser can be exposed for router and blockchainSdk file as well Mysql.
exports.registerUser = (uid, fname, lname, phone, email, usertype, password) =>
    new Promise((resolve, reject) => {
        const newUser = ({
            uid: uid,
            fname: fname,
            lname: lname,
            phone: phone,
            email: email,
            usertype: usertype,
            password: password
        });
        objBD.connect()
        objBD.query('INSERT INTO user_detail SET ?', newUser)

        bcSdk.UserRegisteration({ user: user, UserDetails: newUser })

        .then(() => resolve({ "status": true, "message": "Registration Successfull" }))

        .catch(err => {

            if (err.code == 409) {

                reject({ status: 409, message: 'User Already Registered !' });

            } else {
                conslole.log("error occurred" + err);

                reject({ status: 500, message: 'Internal Server Error !' });
            }
        });
    });