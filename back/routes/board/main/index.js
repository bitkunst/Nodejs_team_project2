//  api/board/main CRUD

const express = require('express');
const mainCon = require('./mainController.js')
const router = express.Router();

router.post('/list', mainCon.listApi) // 브라우저에서 ajax로 요청하면 db에서 게시글 목록 전달
router.post('/view', mainCon.viewApi) // 프론트서버에서 ajax 요청시 db에서 해당 idx의 글 정보, 현재 접속한 유저 정보 전달
router.post('/write', mainCon.writeApi) // write 페이지에서 입력한 내용 db에 저장 + 해시태그, 이미지 처리
router.post('/update', mainCon.updateApi) // update 페이지에서 수정한 내용 db에 저장
router.post('/delete', mainCon.deleteApi) // delete시 삭제권한 확인 후 db에서 해당 내용 삭제
router.post('/like', mainCon.likeApi) // 이미 좋아요 누른 사용자인지 확인 후 아니라면 like 테이블에 추가하고 board 테이블의 like 필드의 레코드 값 +1
router.post('/scrap', mainCon.scrapApi) // 이미 스크랩한 사용자인지 확인 후 아니라면 스크랩 테이블에 추가



module.exports = router;