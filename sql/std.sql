-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 08, 2020 at 06:13 PM
-- Server version: 5.7.25
-- PHP Version: 7.3.1


-- --------------------------------------------------------

--
-- Table structure for table `allstudent`
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
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `codeId` text,
  `user` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `allstudent`
--

INSERT INTO `allstudent` (`stdId`, `fname`, `lname`, `nname`, `gender`, `birthday`, `salary`, `stdCode`, `stdRoom`, `schoolname`, `region`, `district`, `province`, `create_time`, `codeId`, `user`) VALUES
(38, 'test', 'test', 'test', 'male', 'Tue Oct 17 2017 00:00:00 GMT+0700 (Indochina Time)', 'มากกว่า 30,000 บาท/เดือน', 'test', 'test', 'test', 'test', 'test', 'กาญจนบุรี', '2020-05-08 14:17:16.036570', '2020582135ZYgzMes9Ub', 'warawat'),
(39, 'test', 'test', 'test', 'female', 'Wed Aug 16 2017 00:00:00 GMT+0700 (Indochina Time)', 'มากกว่า 30,000 บาท/เดือน', 'test', 'test', 'test', 'test', 'test', 'กาญจนบุรี', '2020-05-08 14:18:32.943065', '20205821942xRG3ZjOx5q', 'warawat');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allstudent`
--
ALTER TABLE `allstudent`
  ADD PRIMARY KEY (`stdId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allstudent`
--
ALTER TABLE `allstudent`
  MODIFY `stdId` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
