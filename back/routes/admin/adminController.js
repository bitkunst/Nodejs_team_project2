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

const getManageBoard = async (req, res)=>{
    try {
        const sql1 = `SELECT idx, 
                            title, 
                            nickname, 
                            DATE_FORMAT(date, '%Y-%m-%d') AS date,
                            active
                     FROM board AS b
                     LEFT JOIN user AS u
                     ON b.b_userid = u.userid
                     ORDER BY idx DESC`
        const [rows1,] = await promisePool.query(sql1)

        const sql2 = `SELECT idx, 
                             title, 
                             nickname, 
                             DATE_FORMAT(date, '%Y-%m-%d') AS date,
                             likes
                      FROM board AS b
                      LEFT JOIN user AS u
                      ON b.b_userid = u.userid
                      ORDER BY likes DESC`
        const [rows2,] = await promisePool.query(sql2)
        const sql3 = `SELECT idx, 
                             title, 
                             nickname, 
                             DATE_FORMAT(date, '%Y-%m-%d') AS date,
                             view
                      FROM board AS b
                      LEFT JOIN user AS u
                      ON b.b_userid = u.userid
                      ORDER BY view DESC`
        const [rows3,] = await promisePool.query(sql3)
        const result = {
            board: rows1,
            likes: rows2,
            view: rows3
        }
        res.json(result)
    } catch(err) {
        console.log(err)
    }
}

const postManageBoard = async (req, res)=>{
    try {
        const {selected: active, boardIdx: idx} = req.body
        const sql = 'UPDATE board SET active=? WHERE idx=?'
        const prepare = [active, idx]
        await promisePool.query(sql, prepare)

        const sql2 = `SELECT idx, 
                            title, 
                            nickname, 
                            DATE_FORMAT(date, '%Y-%m-%d') AS date,
                            active 
                     FROM board AS b
                     LEFT JOIN user AS u
                     ON b.b_userid = u.userid
                     ORDER BY idx DESC`
        const [rows,] = await promisePool.query(sql2)
        console.log(rows)
        res.json(rows)
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    getManageUser,
    getUserInfo,
    postUserPoint,
    getManageCg,
    getManageBoard,
    postManageBoard
}