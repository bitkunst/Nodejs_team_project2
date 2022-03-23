//  api/board/qna CRUD

const express = require('express');
const qnaCon = require('./qnaController.js')
const router = express.Router();

router.post('/list', qnaCon.listApi) // 브라우저에서 ajax로 요청하면 db에서 게시글 목록 전달
router.post('/view', qnaCon.viewApi) // 프론트서버에서 ajax 요청시 db에서 해당 idx의 글 정보, 현재 접속한 유저 정보 전달
router.post('/write', qnaCon.writeApi) // write 페이지에서 입력한 내용 db에 저장 + 해시태그, 이미지 처리
router.post('/update', qnaCon.updateApi) // update 페이지에서 수정한 내용 db에 저장
router.post('/delete', qnaCon.deleteApi) // delete시 삭제권한 확인 후 db에서 해당 내용 삭제




module.exports = router;