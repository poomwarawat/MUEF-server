-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 08, 2020 at 10:41 AM
-- Server version: 5.7.25
-- PHP Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `muef`
--

-- --------------------------------------------------------

--
-- Table structure for table `student101`
--

CREATE TABLE `allstudent` (
  `stdId` int(255) NOT NULL,
  `fname` text,
  `lname` text,
  `nname` text,
  `gender` text,
  `birthday` text,
  `salary` text,
  `stdCode` text,
  `stdRoom` text,
  `schoolname` text,
  `region` text,
  `district` text,
  `province` text,
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `student101`
--
ALTER TABLE `allstudent`
  ADD PRIMARY KEY (`stdId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `student101`
--
ALTER TABLE `allstudent`
  MODIFY `stdId` int(255) NOT NULL AUTO_INCREMENT;
