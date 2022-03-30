const {promisePool} = require('../../db.js')

const getManageUser =  async (req, res)=>{
    try {
        const sql = "SELECT * FROM user ORDER BY userid ASC"
        const [rows,] = await promisePool.query(sql)
        res.json(rows)
    } catch(err) {
        console.log(err)
    }
}

const getUserInfo = async (req, res)=>{
    try {
        const sql = 'SELECT * FROM user'
        const [rows,] = await promisePool.query(sql)
        res.json(rows)
    } catch(err) {
        console.log(err)
    }
}

const postUserPoint = async (req, res)=>{
    try{
        const {apiUserid: userid, userPoint: point} = req.body
        const sql = "UPDATE user SET point=user.point+(?) WHERE userid=?"
        const prepare = [point, userid]
        await promisePool.query(sql, prepare)
        
        const sql2 = "SELECT point FROM user WHERE userid=?"
        const prepare2 = [userid]
        const [rows,] = await promisePool.query(sql2, prepare2)
        res.json(rows)
    } catch(err) {
        console.log(err)
    }
}

const getManageCg = (req, res)=>{
    // res.render('./admin/manageCg.html')
}

const getManageBoard = (req, res)=>{
    // res.render('./admin/manageBoard.html')
}

module.exports = {
    getManageUser,
    getUserInfo,
    postUserPoint,
    getManageCg,
    getManageBoard,
}