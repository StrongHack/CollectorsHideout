import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Link, useDisclosure } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { AuctionType, ModalActionType } from '../../types';
import { AuctionsService } from '../../services/auctionService';
import Searchbar from '../../components/searchbar';
import { DateTimeUtils } from '../../utils/dateTimeUtils';
import AuctionModal from '../../components/auctionModal';
import toast from 'react-hot-toast';

export default function Auctions() {
  const [auctions, setAuctions] = useState<AuctionType[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<AuctionType[]>([]);
  const [countdownTimers, setCountdownTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [auctionId, setAuctionId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");

  const [loading, setLoading] = useState<boolean>(true);

  /**
  * Fetches auctions from database
  */
  const fetchAuctions = async () => {
    try {
      const auctions = await AuctionsService.getAuctions();

      setAuctions(auctions);
      setLoading(false);
    } catch (error) {
      setAuctions([]);
      setLoading(true);

      toast.error("Error fetching auctions!");
    }
  }

  /**
   * Opens modal to show auction
   * 
   * @param id of auction to edit
   */
  const handleShow = (id: string) => {
    setAction("show");
    setAuctionId(id);

    onOpen();
  }

  /**
   * Opens modal to create an auction
   */
  const handleCreate = () => {
    setAction("create");
    setAuctionId("");

    onOpen();
  };

  /**
   * Opens modal to edit auction
   * 
   * @param id of auction to edit
   */
  const handleEdit = (id: string) => {
    setAction("edit");
    setAuctionId(id);

    onOpen();
  }

  /**
  * Deletes auction by id
  *
  * @param auctionId id of the auction to delete
  */
  const handleDelete = async (auctionId: string) => {
    if (confirm("Are you sure you want to delete this auction?")) {
      try {
        await AuctionsService.deleteAuction(auctionId);

        await fetchAuctions();
      } catch (error) {
        toast.error("Error deleting auctions!");
      }
    }
  };

  /**
   *
   * Verifies if the auction will start soon, is active or has ended
   *
   * @param startDate start date of the auction
   * @param endDate end date of the auction
   * @returns the remaining time of the auction
   */
  const formatRemainingTime = (date: string) => {
    try {
      const seconds = DateTimeUtils.calculateTimeRemaining(date);
      const endedStyle = seconds <= 0 ? 'text-red-600 font-bold' : 'text-black';
      const activeStyle = seconds > 0 ? 'text-green-600 font-bold' : 'text-black';

      if (seconds <= 0) {
        return <span className={endedStyle}>Auction Ended</span>;
      }

      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      if (days > 0) {
        return (
          <span className={activeStyle}>
            {days} {days === 1 ? 'day' : 'days'}
          </span>
        );
      } else {
        return (
          <span className={activeStyle}>
            {hours}:{minutes < 10 ? '0' : ''}{minutes}:{remainingSeconds < 10 ? '0' : ''}{remainingSeconds}
          </span>
        );
      }
    } catch (error) {
      return (
        <span className="text-green-600 font-bold' : 'text-black">
          0 remaining seconds
        </span>
      );
    }
  };

  /**
   * Updates the countdown timer for an auction
   *
   * @param date End date of the auction
   * @param auctionId ID of the auction
   */
  const updateCountdownTimer = (date: string, auctionId: string) => {
    const auctionsBackup = auctions;

    try {
      const seconds = DateTimeUtils.calculateTimeRemaining(date);

      if (seconds > 0) {
        const timerId = setInterval(() => {
          setCountdownTimers(prevTimers => ({ ...prevTimers, [auctionId]: timerId }));
          setAuctions(prevAuctions => {
            const updatedAuctions = prevAuctions.map(auction => {
              if (auction['.id'] === auctionId) {
                return { ...auction, remainingTime: formatRemainingTime(auction.auctionEndDate.toString()) };
              }
              return auction;
            });
            return updatedAuctions;
          });
        }, 1000);
      }
    } catch (error) {
      setAuctions(auctionsBackup);
    }
  }

  /**
   * Render Actions
   * 
   * Prepares the necessary button triggers for the actions to be executed per auction, such as
   *  - Deleting an auction
   *  - Editing an auction
   *  - Viewing an auction in detail
   * 
   * @param auctionId id of each auction 
   */
  const renderActions = (auctionId: string) => (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details" color='primary'>
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <Link href="#">
            <FontAwesomeIcon icon={faEye} style={{ color: 'blue' }} onClick={() => handleShow(auctionId)} />
          </Link>
        </span>
      </Tooltip>
      <Tooltip content="Edit auction" color='success'>
        <span className="text-lg cursor-pointer active:opacity-50">
          <FontAwesomeIcon icon={faPencil} style={{ color: 'green' }} onClick={() => handleEdit(auctionId)} />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete auction">
        <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(auctionId)}>
          <FontAwesomeIcon icon={faTrash} style={{ color: 'darkred' }} />
        </span>
      </Tooltip>
    </div>
  );

  // Updates timers
  useEffect(() => {
    auctions.forEach(auction => {
      if (!countdownTimers[auction['.id']]) {
        const timerId = setInterval(() => {
          updateCountdownTimer(auction.auctionEndDate.toString(), auction['.id']);
        }, 1000); // Update every second

        setCountdownTimers(prevTimers => ({
          ...prevTimers,
          [auction['.id']]: timerId,
        }));
      }
    });

    // Cleanup: clear timers when the component unmounts
    return () => {
      Object.values(countdownTimers).forEach(timerId => clearInterval(timerId));
    };
  }, [auctions, countdownTimers]);


  useEffect(() => {
    if (loading) {
      fetchAuctions();
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!auctions) return <p>No auctions data</p>;

  return (
    <main className="h-screen w-screen bg-white overflow-x-hidden">
      <div className="top-4 left-2 ml-[5%] pt-4 flex items-center">
        <Searchbar objects={auctions} filteringAttr='auctionName' setFilteredObjects={setFilteredAuctions} />
        <Tooltip content="Create auction" color="primary">
          <svg onClick={() => handleCreate()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Tooltip>
      </div>
      <div className='text-black'>
        <h1 className="pt-4 pb-2 ml-[5%] font-bold text-2xl">Auctions List</h1>
        <Table aria-label="Example table with custom cells" className='w-[90%] ml-[5%]'>
          <TableHeader>
            <TableColumn className='w-[20%] font-bold text-xl' align="start">Name</TableColumn>
            <TableColumn className='w-[20%] font-bold text-xl' align="start">Collection Name</TableColumn>
            <TableColumn className='w-[10%] font-bold text-xl' align="start">Minimum Bid</TableColumn>
            <TableColumn className='w-[10%] font-bold text-xl' align="start">Highest Bid</TableColumn>
            <TableColumn className='w-[20%] font-bold text-xl' align="start">Start Date</TableColumn>
            <TableColumn className='w-[20%] font-bold text-xl' align="start">End Date</TableColumn>
            <TableColumn className='w-[15%] font-bold text-xl' align="start">Time to End</TableColumn>
            <TableColumn className='w-[5%] font-bold text-xl' align="center">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredAuctions.map((auction: AuctionType) => (
              <TableRow key={auction['.id']}>
                <TableCell className="text-lg">{auction.auctionName}</TableCell>
                <TableCell className="text-lg">{auction.collectionName}</TableCell>
                <TableCell className="text-lg">{auction.auctionMinimumBid} €</TableCell>
                <TableCell className="text-lg">{auction.auctionHighestBid} €</TableCell>
                <TableCell className="text-lg">{auction.auctionStartDate.toString().replace("T", " ").split("Z")}</TableCell>
                <TableCell className="text-lg">{auction.auctionEndDate.toString().replace("T", " ").split("Z")}</TableCell>
                <TableCell className="text-lg">{formatRemainingTime(auction.auctionEndDate.toString())}</TableCell>
                <TableCell className="text-lg">{renderActions(auction['.id'])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AuctionModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} updateTable={fetchAuctions} action={action} id={auctionId} />
    </main >
  )
}