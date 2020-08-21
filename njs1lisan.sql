-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 21 Ağu 2020, 12:50:06
-- Sunucu sürümü: 5.7.31
-- PHP Sürümü: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `njs1lisan`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `asw_categories`
--

DROP TABLE IF EXISTS `asw_categories`;
CREATE TABLE IF NOT EXISTS `asw_categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(30) NOT NULL,
  `category_seflink` varchar(60) NOT NULL,
  `category_description` varchar(1000) DEFAULT NULL,
  `category_count` smallint(6) NOT NULL DEFAULT '0',
  `category_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `asw_comments`
--

DROP TABLE IF EXISTS `asw_comments`;
CREATE TABLE IF NOT EXISTS `asw_comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_post` int(11) NOT NULL,
  `comment_author` varchar(150) NOT NULL,
  `comment_content` text NOT NULL,
  `comment_datas` text,
  `comment_parent` int(11) NOT NULL DEFAULT '0',
  `comment_status` tinyint(4) NOT NULL DEFAULT '1',
  `comment_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `asw_contacts`
--

DROP TABLE IF EXISTS `asw_contacts`;
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

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `asw_media`
--

DROP TABLE IF EXISTS `asw_media`;
CREATE TABLE IF NOT EXISTS `asw_media` (
  `media_id` int(11) NOT NULL AUTO_INCREMENT,
  `media_title` varchar(100) NOT NULL,
  `media_seflink` varchar(100) NOT NULL,
  `media_description` varchar(512) DEFAULT NULL,
  `media_file` varchar(100) NOT NULL,
  `media_type` varchar(40) NOT NULL,
  `media_tags` varchar(255) DEFAULT NULL,
  `media_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`media_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `asw_posts`
--

DROP TABLE IF EXISTS `asw_posts`;
CREATE TABLE IF NOT EXISTS `asw_posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_type` varchar(15) DEFAULT 'post',
  `post_title` varchar(100) NOT NULL,
  `post_seflink` varchar(100) NOT NULL,
  `post_description` text,
  `post_content` text,
  `post_cover` varchar(255) DEFAULT NULL,
  `post_tags` varchar(255) DEFAULT NULL,
  `post_user` int(11) NOT NULL,
  `post_status` enum('publish','draft','trash') NOT NULL DEFAULT 'publish',
  `post_order` int(11) DEFAULT '0',
  `post_parent` int(11) DEFAULT '0',
  `post_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_more` text,
  PRIMARY KEY (`post_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `asw_post_category`
--

DROP TABLE IF EXISTS `asw_post_category`;
CREATE TABLE IF NOT EXISTS `asw_post_category` (
  `post_category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`post_category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `asw_users`
--

DROP TABLE IF EXISTS `asw_users`;
CREATE TABLE IF NOT EXISTS `asw_users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_username` varchar(25) NOT NULL,
  `user_password` varchar(40) NOT NULL,
  `user_email` varchar(60) NOT NULL,
  `user_fullname` varchar(60) DEFAULT NULL,
  `user_status` tinyint(1) NOT NULL DEFAULT '1',
  `user_level` tinyint(4) NOT NULL DEFAULT '1',
  `user_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_lastlogin` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_more` text,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
