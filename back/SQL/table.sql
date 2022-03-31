CREATE TABLE user (
    userid VARCHAR(50) NOT NULL PRIMARY KEY,
    userpw VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(100) NULL,
    gender CHAR(1) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NULL DEFAULT '전화번호 없음',
    email VARCHAR(50) NOT NULL,
    bio TEXT NULL,
    point INT NOT NULL DEFAULT 0
);

CREATE TABLE category (
    idx VARCHAR(6) NOT NULL PRIMARY KEY,
    board_name VARCHAR(50) NOT NULL,
    main VARCHAR(50) NOT NULL,
    m_url VARCHAR(50) NOT NULL,
    m_key VARCHAR(3) NOT NULL,
    sub VARCHAR(50) NULL,
    s_url VARCHAR(50) NULL,
    s_key VARCHAR(3) NULL
);


CREATE TABLE board (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    view INT NOT NULL DEFAULT 0,
    likes INT NULL,
    b_userid VARCHAR(50) NOT NULL,
    parent INT NULL,
    active CHAR(1) NOT NULL DEFAULT 1,
    cg_idx VARCHAR(6) NOT NULL,
    board_name VARCHAR(50) NOT NULL
);

CREATE TABLE hashtag (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hstg VARCHAR(50) NOT NULL,
    bid INT NOT NULL
);


CREATE TABLE comment (
    cid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    comment TEXT NOT NULL,
    c_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    bid INT NOT NULL,
    c_userid VARCHAR(50) NOT NULL,
    parent INT NULL
);


CREATE TABLE scrap (
    sid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    s_userid VARCHAR(50) NOT NULL,
    bid INT NOT NULL
);

CREATE TABLE likes (
    lid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    l_userid VARCHAR(50) NOT NULL,
    bid INT NOT NULL
);

CREATE TABLE img (
    iid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bid INT NOT NULL,
    img TEXT NOT NULL,
    seq INT NOT NULL
);

CREATE TABLE chatroom (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    room VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE chat (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    room VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- sample data --
INSERT INTO user VALUES ('admin', 'admin', '관리자', '관리자', '주소없음', 'm', '01012341234', '0212341234', 'email@google.com', '안녕하세요 관리자입니다.', 0);

INSERT INTO board (title, content, b_userid, cg_idx, board_name) VALUES ('test', '테스트용 입니다.', 'bitkunst', '001001', 'movie');

INSERT INTO comment (comment, bid, c_userid) VALUES ('테스트 댓글', 1, 'bitkunst');

INSERT INTO category (idx, main, m_url, m_key) VALUES ('001001', '공지사항', 'notice', '001');


