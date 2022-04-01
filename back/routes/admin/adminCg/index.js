//  api/comment CRUD

const express = require('express');
const commentCon = require('./adminCgController.js')
const router = express.Router();

router.post('/view', commentCon.viewApi) // 프론트서버에서 ajax 요청시 db에서 해당 idx의 글 정보, 현재 접속한 유저 정보 전달
router.post('/write', commentCon.writeApi) // write 페이지에서 입력한 내용 db에 저장 + 해시태그, 이미지 처리
router.post('/update', commentCon.updateApi) // update 페이지에서 수정한 내용 db에 저장
router.post('/delete', commentCon.deleteApi) // delete시 삭제권한 확인 후 db에서 해당 내용 삭제
router.post('/reply', commentCon.replyApi) // 이미 좋아요 누른 사용자인지 확인 후 아니라면 like 테이블에 추가하고 board 테이블의 like 필드의 레코드 값 +1




module.exports = router;