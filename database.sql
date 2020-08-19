CREATE TABLE IF NOT EXISTS asw_users (
  user_id int(11) NOT NULL AUTO_INCREMENT,
  user_username varchar(25) NOT NULL,
  user_password varchar(40) NOT NULL,
  user_email varchar(60) NOT NULL,
  user_fullname varchar(60) DEFAULT NULL,
  user_status tinyint(1) NOT NULL DEFAULT 1,
  user_level tinyint(4) NOT NULL DEFAULT 1,
  user_create timestamp NOT NULL DEFAULT current_timestamp(),
  user_update timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  user_lastlogin timestamp NULL DEFAULT current_timestamp(),
  user_more text DEFAULT NULL,
  PRIMARY KEY (user_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS asw_categories (
  category_id int(11) NOT NULL AUTO_INCREMENT,
  category_name varchar(30) NOT NULL,
  category_seflink varchar(60) NOT NULL,
  category_description varchar(1000) DEFAULT NULL,
  category_count smallint(6) NOT NULL DEFAULT 0,
  category_create timestamp NOT NULL DEFAULT current_timestamp(),
  category_update timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (category_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS asw_media (
  media_id int(11) NOT NULL AUTO_INCREMENT,
  media_title varchar(100) NOT NULL,
  media_seflink varchar(100) NOT NULL,
  media_description varchar(512) DEFAULT NULL,
  media_file varchar(100) NOT NULL,
  media_type varchar(40) NOT NULL,
  media_tags varchar(255) DEFAULT NULL,
  media_create timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (media_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS asw_posts (
  post_id int(11) NOT NULL AUTO_INCREMENT,
  post_type varchar(15) DEFAULT 'post',
  post_title varchar(100) NOT NULL,
  post_seflink varchar(100) NOT NULL,
  post_description text DEFAULT NULL,
  post_content text DEFAULT NULL,
  post_cover varchar(255) DEFAULT NULL,
  post_tags varchar(255) DEFAULT NULL,
  post_user int(11) NOT NULL,
  post_status enum('publish','draft','trash') NOT NULL DEFAULT 'publish',
  post_order int(11) DEFAULT 0,
  post_parent int(11) DEFAULT 0,
  post_create timestamp NOT NULL DEFAULT current_timestamp(),
  post_update timestamp NOT NULL DEFAULT current_timestamp(),
  post_more text DEFAULT NULL,
  PRIMARY KEY (post_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS asw_post_category (
  post_category_id int(11) NOT NULL AUTO_INCREMENT,
  category_id int(11) NOT NULL,
  post_id int(11) NOT NULL,
  PRIMARY KEY (post_category_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `asw_contacts` (
  `contact_id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_title` varchar(255) NOT NULL,
  `contact_author` varchar(100) NOT NULL,
  `contact_content` text NOT NULL,
  `contact_datas` text,
  `contact_parent` int(11) NOT NULL DEFAULT '0',
  `contact_type` varchar(15) NOT NULL DEFAULT 'standart',
  `contact_status` tinyint(1) NOT NULL DEFAULT '0',
  `contact_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contact_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`contact_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
