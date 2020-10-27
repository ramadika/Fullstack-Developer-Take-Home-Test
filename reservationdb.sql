-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2020 at 09:56 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reservationdb`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `EventAdd` (IN `_EventID` INT, IN `_EventName` VARCHAR(45), IN `_StartDate` DATE, IN `_EndDate` DATE, IN `_LocationID` INT)  BEGIN
	IF _EventID IS NULL THEN
		INSERT INTO event(EventName, StartDate, EndDate, LocationID)
        VALUES (_EventName, _StartDate, _EndDate, _LocationID);
        
        SET _EventID = LAST_INSERT_ID();
	ELSE
		UPDATE event
        SET 
        EventName = _EventName,
        StartDate = _StartDate,
        EndDate = _EndDate,
        LocationID = _LocationID
        WHERE EventID = _EventID;
	END IF;
    
    SELECT _EventID as 'EventID';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `LocationAdd` (IN `_LocationID` INT, IN `_LocationName` VARCHAR(45), IN `_EventID` VARCHAR(45))  BEGIN
	IF _LocationID IS NULL THEN
		INSERT INTO location(LocationName, EventID)
        VALUES (_LocationName, _EventID);
        
        SET _LocationID = LAST_INSERT_ID();
	ELSE
		IF _EventID IS NULL THEN
			UPDATE location
			SET 
			LocationName = _LocationName,
			EventID = EventID
			WHERE LocationID = _LocationID;
        ELSE
			UPDATE location
			SET 
			LocationName = _LocationName,
			EventID = CONCAT(EventID,'-',_EventID)
			WHERE LocationID = _LocationID;
        END IF;
	END IF;
    
    SELECT _LocationID as 'LocationID';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `TicketAdd` (IN `_TicketID` INT, IN `_TicketQuota` INT, IN `_TicketPrice` INT, IN `_EventID` INT, IN `_TicketType` VARCHAR(45))  BEGIN
	SET _EventID := (SELECT EventID FROM event WHERE EventID = _EventID);
    IF _EventID IS NULL THEN
		SELECT _TicketID as 'TicketID';
	ELSE 
		IF _TicketID IS NULL THEN
			INSERT INTO ticket (TicketId, TicketQuota, TicketPrice, EventID, TicketType) 
			VALUES (_TicketID, _TicketQuota, _TicketPrice, _EventID, _TicketType);
			
			SET _TicketID = LAST_INSERT_ID();
		ELSE
			UPDATE ticket
			SET
			TicketQuota = _TicketQuota,
			TicketPrice = _TicketPrice,
			EventID = _EventID,
			TicketType = _TicketType
			WHERE TicketID = _TicketID;
		END IF;
	END IF;
    
    SELECT _TicketID as 'TicketID', _EventID as 'EventID';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `TransactionAdd` (IN `_TransactionID` BINARY, IN `_CustomerID` INT, IN `_TicketID` INT, IN `_TicQuantity` INT, IN `_EventID` INT)  BEGIN
	DECLARE _TicketQuota INT;
	DECLARE TicketQuota_ INT;
	SET _TicketQuota := (SELECT TicketQuota FROM ticket WHERE TicketID = _TicketID);
    IF _TicketQuota < 1 THEN
		SELECT _TransactionID as 'TransactionID';
    ElSE
		SET _TransactionID = UNHEX(REPLACE(UUID(),'-',''));
		INSERT INTO transaction (TransactionID, CustomerID, TicketID, TicQuantity, EventID)
		VALUES (_TransactionID, _CustomerID, _TicketID, _TicQuantity, _EventID);
            
        SET TicketQuota_ = _TicketQuota - _TicQuantity;
        UPDATE ticket 
        SET 
        TicketQuota = TicketQuota_
        WHERE TicketID = _TicketID;
    END IF;
    
    SELECT _TransactionID as 'TransactionID';
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CustomerID` int(11) NOT NULL,
  `CustomerName` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CustomerID`, `CustomerName`) VALUES
(1, 'Anthony'),
(2, 'Mike'),
(3, 'David'),
(4, 'Andromeda');

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `EventID` int(11) NOT NULL,
  `EventName` varchar(45) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `LocationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`EventID`, `EventName`, `StartDate`, `EndDate`, `LocationID`) VALUES
(1, 'The Next', '2020-10-12', '2020-10-13', 4),
(2, 'Gain Power', '2020-10-05', '2020-10-12', 1),
(3, 'Eat Champ', '2020-09-01', '2020-09-12', 3),
(4, 'YourJourney', '2020-10-05', '2020-10-12', 4);

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `LocationID` int(11) NOT NULL,
  `LocationName` varchar(45) DEFAULT NULL,
  `EventID` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`LocationID`, `LocationName`, `EventID`) VALUES
(1, 'Mall', '2'),
(2, 'Atrium', '1'),
(3, 'Museum', '3'),
(4, 'Warehouse', '1-4');

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `TicketID` int(11) NOT NULL,
  `TicketQuota` int(11) DEFAULT NULL,
  `TicketPrice` int(11) DEFAULT NULL,
  `EventID` int(11) NOT NULL,
  `TicketType` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`TicketID`, `TicketQuota`, `TicketPrice`, `EventID`, `TicketType`) VALUES
(1, 5, 30000, 1, 'Gold'),
(2, 5, 10000, 1, 'Silver'),
(3, -1, 5000, 2, 'Bronze'),
(13, 10, 150000, 2, 'Premium'),
(14, 4, 300000, 1, 'Exclusive'),
(16, 3, 345000, 1, 'Wow');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `TransactionID` binary(16) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `TicketID` int(11) NOT NULL,
  `TicQuantity` int(11) DEFAULT NULL,
  `EventID` int(11) NOT NULL,
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`TransactionID`, `CustomerID`, `TicketID`, `TicQuantity`, `EventID`, `ID`) VALUES
(0x97000000000000000000000000000000, 2, 1, 1, 1, 1),
(0x97000000000000000000000000000000, 2, 2, 3, 1, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomerID`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`EventID`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`LocationID`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`TicketID`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `CustomerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `EventID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `LocationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
