//  api/board/notice CRUD

const express = require('express');
const noticeCon = require('./noticeController.js')
const router = express.Router();

router.post('/list', noticeCon.listApi) // 브라우저에서 ajax로 요청하면 db에서 게시글 목록 전달
router.post('/view', noticeCon.viewApi) // 프론트서버에서 ajax 요청시 db에서 해당 idx의 글 정보, 현재 접속한 유저 정보 전달
router.post('/write', noticeCon.writeApi) // write 페이지에서 입력한 내용 db에 저장 + 해시태그, 이미지 처리
router.post('/update', noticeCon.updateApi) // update 페이지에서 수정한 내용 db에 저장
router.post('/delete', noticeCon.deleteApi) // delete시 삭제권한 확인 후 db에서 해당 내용 삭제




module.exports = router;