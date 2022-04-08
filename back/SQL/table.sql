CREATE TABLE user (
    userid VARCHAR(50) NOT NULL PRIMARY KEY,
    userpw VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    address VARCHAR(100) NULL,
    gender CHAR(1) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NULL DEFAULT '전화번호 없음',
    email VARCHAR(50) NOT NULL,
    bio TEXT NULL,
    point INT NOT NULL DEFAULT 0,
    uImg TEXT NULL
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
    board_name VARCHAR(50) NOT NULL,
    seq INT NULL
);

CREATE TABLE hashtag (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hstg TEXT NOT NULL,
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

-- DEFAULT CATEGORY --
INSERT INTO category (idx, board_name, main, m_url, m_key)
VALUES (100, 'notice', '공지사항', 'notice', '100');
INSERT INTO category (idx, board_name, main, m_url, m_key)
VALUES (201, 'qna', '질문', 'question', '201');
INSERT INTO category (idx, board_name, main, m_url, m_key)
VALUES (202, 'qna', '답변', 'answer', '202');
INSERT INTO category (idx, board_name, main, m_url, m_key)
VALUES (301, 'main', '영화', 'movie', '301');