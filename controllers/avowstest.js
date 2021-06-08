const connection = require("../config/avowstest")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = {
    login: (req, res) => {
        connection.query(`
        SELECT
        *
        FROM user
        WHERE email_user = '${req.body.EMAIL}' AND status_user = 'ACTIVE'`,(error,result,field)=> {
            if (error){
                res.status(400).send({
                    error
                });
            }
            else{
                if(result.length >= 1){
                    let valid = bcrypt.compareSync(req.body.PASS, result[0].pass_user);
                    if(valid){
                        let exptoken = "2 days";
                        let user = {
                            apiuser: `${result[0].nama_user}`
                        }
                        let dataUSer = {
                            nama_user:`${result[0].nama_user}`,
                            email_user:`${result[0].email_user}`
                        }
                        jwt.sign({user},'anbya@armyAli' ,{expiresIn:exptoken},(err,access_token) => {
                            res.status(200).send({
                                "status":"00",
                                "access_token":`${access_token}`,
                                "token_type":"bearer",
                                "expires_in":exptoken,
                                "dataUSer":dataUSer
                            });
                        });
                    }
                    else{
                      res.status(200).send({
                        "status":"02",
                        "pesan":`password tidak sesuai.`
                      });
                    }
                } else {
                    res.status(200).send({
                        "status":"01",
                        "pesan":`user tidak ditemukan atau sudah tidak aktif.`
                    });
                }
            }
        });
    },
    getToken: (req, res) => {
        let email = Buffer.from(req.body.EMAIL, 'base64').toString('ascii');
        connection.query(`
        SELECT
        *
        FROM user
        WHERE email_user = '${email}' AND status_user = 'ACTIVE'`,(error,result,field)=> {
            if (error){
                res.status(400).send({
                    error
                });
            }
            else{
                if(result.length >= 1){
                    let exptoken = "2 days";
                    let user = {
                        apiuser: `${result[0].nama_user}`
                    }
                    let dataUSer = {
                        nama_user:`${result[0].nama_user}`,
                        email_user:`${result[0].email_user}`
                    }
                    jwt.sign({user},'anbya@armyAli' ,{expiresIn:exptoken},(err,access_token) => {
                        res.status(200).send({
                            "status":"00",
                            "access_token":`${access_token}`,
                            "token_type":"bearer",
                            "expires_in":exptoken,
                            "dataUSer":dataUSer
                        });
                    });
                } else {
                    res.status(200).send({
                        "status":"01",
                        "pesan":`user tidak ditemukan atau sudah tidak aktif.`
                    });
                }
            }
        });
    },
    getSales:(req,res) =>{
        let filter = req.body.ITEMFILTER.length > 0 ? `WHERE x.id_item IN(${req.body.ITEMFILTER})` : ``
        let query = `
        SELECT
        *,
        (
            SELECT nama_item FROM item WHERE id_item = x.id_item
        ) AS nama_item
        FROM sales AS x ${filter}`
        connection.query(query,(error,result,field)=> {
            if (error){
                console.log('error di sini',query);
                res.status(400).send({
                    error
                });
            }
            else{
                res.status(200).send({
                    result
                });
            }
        });
    },
    items:(req,res) =>{
        connection.query(`
        SELECT
        *
        FROM item `,(error,result,field)=> {
            if (error){
                res.status(400).send({
                    error
                });
            }
            else{
                res.status(200).send({
                    result
                });
            }
        });
    },
    User:(req,res) =>{
        connection.query(`
        SELECT
        *
        FROM user
        WHERE email_user = '${req.body.EMAIL}'`,(error,result,field)=> {
            if (error){
                res.status(400).send({
                    error
                });
            }
            else{
                if(result.length >= 1){
                    const valid = bcrypt.compareSync(req.body.PASS, result[0].pass_user);
                    if(valid){
                      res.status(200).send({
                        "status":"00",
                        "dataUSer":result
                      });
                    }
                    else{
                      res.status(200).send({
                        "status":"02",
                        "pesan":`password tidak sesuai.`
                      });
                    }
                } else {
                  res.status(200).send({
                    "status":"01",
                    "pesan":`user tidak ditemukan.`
                  });
                }
            }
        });
    },
    addUser:(req,res) =>{
        connection.query(`
        SELECT
        *
        FROM user
        WHERE email_user = '${req.body.EMAIL}'`,(errorx,resultx,fieldx)=> {
            if (errorx){
                res.status(400).send({
                    errorx
                });
            }
            else{
                if(resultx.length >= 1){
                    res.status(200).send({
                      "status":"01",
                      "pesan":`email sudah terdaftar.`
                    });
                } else {
                    bcrypt.genSalt(10, function(err,salt){
                        bcrypt.hash(req.body.PASS, salt, async function (err, hash){
                            if(!err){
                                connection.query(`INSERT INTO user values("","${req.body.FULLNAME}","${hash}","${req.body.EMAIL}")`,(error,result,field)=> {
                                    if (error){
                                        res.status(400).send({
                                            error
                                        });
                                    }
                                    else{
                                        connection.query(`
                                        SELECT
                                        *
                                        FROM user
                                        WHERE id_user = '${result.insertId}'`,(error1,result1,field1)=> {
                                            if (error1){
                                                res.status(400).send({
                                                    error1
                                                });
                                            }
                                            else{
                                                res.status(200).send({
                                                "status":`00`,
                                                "dataUSer":result1
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        })
                    });
                }
            }
        });
    },
    addOrder:(req,res) =>{
        let userData = JSON.parse(req.body.USER)
        connection.query(`INSERT INTO order_h values("","${req.body.TANGGAL}","OPEN","${userData.id_user}")`,(error,result,field)=> {
            if (error){
                res.status(400).send({
                    error
                });
            }
            else{
                let idOrderH = result.insertId
                connection.query(`INSERT INTO order_d values("","${req.body.ITEM.id_item}","${req.body.QTY}","${idOrderH}")`,(error1,result1,field1)=> {
                    if (error1){
                        res.status(400).send({
                            error1
                        });
                    }
                    else{
                        res.status(200).send({
                        "status":`00`,
                        "dataUSer":result1
                        });
                    }
                });
            }
        });
    },
    getOrder:(req,res) =>{
        let userData = JSON.parse(req.body.USER)
        connection.query(`
        SELECT
        *,
        (SELECT nama_user FROM user WHERE id_user = x.id_user) AS namaUSer
        FROM order_h as x
        WHERE x.id_user = '${userData.id_user}'`,(error,result,field)=> {
            if (error){
                res.status(400).send({
                    error
                });
            }
            else{
                connection.query(`
                SELECT
                *,
                (SELECT nama_item FROM item WHERE id_item = x.id_item) AS namaItem
                FROM order_d AS x LEFT JOIN order_h AS y ON x.id_order_h = y.id_order_h
                WHERE y.id_user = '${userData.id_user}'`,(error1,result1,field1)=> {
                    if (error1){
                        res.status(400).send({
                            error1
                        });
                    }
                    else{
                        for(let i = 0;i<result.length;i++){
                            let orderD = result1.filter(function(data) {
                                return data.id_order_h == result[i].id_order_h ;
                            });
                            result[i]={...result[i],detailOrder:orderD[0]}
                        }
                        console.log(result);
                        res.status(200).send({
                            "order":result
                        });
                    }
                });
            }
        });
    },
};