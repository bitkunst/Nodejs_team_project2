const getAdminPage = (req, res)=>{
    res.render('./admin/admin.html')
}


module.exports = {
    getAdminPage,
}