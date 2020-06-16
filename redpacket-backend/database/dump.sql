# ************************************************************
# SQL dump
# MySQL Version: 5.7.26
# Database: redpacket
# Generation Time: 2019-05-05 09:44:01 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE SCHEMA IF NOT EXISTS `redpacket`;

USE `redpacket`;

# Dump of table senders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `senders`;

CREATE TABLE `senders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `red_packet_id` char(36) NOT NULL,
  `password` char(20) NOT NULL,
  `contract_address` varchar(128) NOT NULL,
  `contract_program` varchar(128) NOT NULL,
  `witness_program` varchar(128) NOT NULL,
  `address` varchar(128) DEFAULT NULL,
  `address_name` varchar(128) DEFAULT NULL,
  `amount` bigint(20) unsigned DEFAULT '0',
  `tx_id` char(64) DEFAULT NULL,
  `is_confirmed` tinyint(1) DEFAULT '0',
  `is_handled` tinyint(1) DEFAULT '0',
  `red_packet_type` tinyint(2) DEFAULT '0',
  `note` varchar(1024) DEFAULT NULL,
  `is_expired` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `red_packet_id` (`red_packet_id`),
  UNIQUE KEY `tx_id` (`tx_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `senders` WRITE;
UNLOCK TABLES;


# Dump of table receivers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `receivers`;

CREATE TABLE `receivers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `utxo_id` char(64) NOT NULL,
  `is_spend` tinyint(1) DEFAULT '0',
  `address` varchar(128) DEFAULT NULL,
  `amount` bigint(20) unsigned DEFAULT '0',
  `tx_id` char(64) DEFAULT NULL,
  `is_confirmed` tinyint(1) DEFAULT '0',
  `is_expired` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utxo_id` (`utxo_id`),
  CONSTRAINT `receivers_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `senders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `receivers` WRITE;
UNLOCK TABLES;

