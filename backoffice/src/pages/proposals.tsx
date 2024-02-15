import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faX } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { ProposalsService } from "../../services/proposalsService";
import ProposalsModal from "../../components/proposalsModal";
import { AuctionType, ModalActionType } from "../../types";
import Searchbar from "../../components/searchbar";
import toast from "react-hot-toast";

export default function Proposals() {
  const [proposals, setProposals] = useState<AuctionType[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<AuctionType[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [proposalId, setProposalId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");

  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Fetches proposals from database
   */
  const fetchProposals = async () => {
    try {
      const proposals = await ProposalsService.getProposals();

      setProposals(proposals);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching proposals!");

      setProposals([]);
      setLoading(true);
    }
  };

  /**
   * Opens modal to show a proposal
   *
   * @param id of proposal to edit
   */
  const showProposal = (id: string) => {
    setAction("show");
    setProposalId(id);

    onOpen();
  };

  /**
   * Opens modal to create a proposal
   */
  const createProposal = () => {
    setAction("create");
    setProposalId("");

    onOpen();
  };

  /**
   * Opens modal to edit a proposal
   *
   * @param id of proposal to edit
   */
  const editProposal = (id: string) => {
    setAction("edit");
    setProposalId(id);

    onOpen();
  };

  /**
   * Sets proposal state to accepted
   *
   * @param index of proposal to update
   * @param id to updated proposal in database
   */
  const acceptProposal = async (index: number) => {
    try {
      if (index !== -1) {
        const updatedProposals = [...proposals];

        updatedProposals[index] = {
          ...updatedProposals[index],
          auctionState: "Accepted", // Update the state property, replace with your actual property name
        };

        // Update the state with the new array
        setProposals(updatedProposals);

        await ProposalsService.updateProposal(updatedProposals[index]);
      }

      fetchProposals();
    } catch (error) {
      toast.error("Error accepting proposal!");
    }
  };

  /**
   * Sets proposal state to rejected
   *
   * @param index of proposal to reject
   */
  const refuseProposal = (index: number) => {
    try {
      if (index !== -1) {
        const updatedProposals = [...proposals];

        updatedProposals[index] = {
          ...updatedProposals[index],
          auctionState: "Rejected",
        };

        // Update the state with the new array
        setProposals(updatedProposals);

        ProposalsService.updateProposal(updatedProposals[index]);
      }
    } catch (error) {
      toast.error("Error refusing proposal!");
    }
  };

  /**
   * Deletes proposal from database
   *
   * @param id of proposal to delete
   */
  const deleteProposal = async (id: string) => {
    if (
      confirm("If you delete this proposal, you won't be able to access the proposal again. Are you sure you want to delete it?")
    ) {
      try {
        await ProposalsService.deleteProposal(id);

        fetchProposals();
      } catch (error) {
        toast.error("Error deleting proposal");
      }
    }
  };

  /**
   * Renders proposal actions
   *
   * @param index of proposal to render actions
   * @param id to add function to manage proposal
   * @returns proposal actions
   */
  const renderActions = (index: number, id: string) => (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details" color="primary">
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <Link href="#">
            <FontAwesomeIcon
              onClick={() => showProposal(id)}
              icon={faEye}
              style={{ color: "blue" }}
            />
          </Link>
        </span>
      </Tooltip>
      <Tooltip content="Edit proposal" color="success">
        <span
          onClick={() => editProposal(id)}
          className="text-lg cursor-pointer active:opacity-50"
        >
          <Link>
            <FontAwesomeIcon
              onClick={() => editProposal(id)}
              icon={faPencil}
              style={{ color: "green" }}
            />
          </Link>
        </span>
      </Tooltip>
      <Tooltip color="success" content="Accept proposal">
        <span className="text-lg text-white cursor-pointer active:opacity-50">
          <Link href="#">
            <FontAwesomeIcon
              onClick={() => acceptProposal(index)}
              icon={faCheck}
              style={{ color: "green" }}
            />
          </Link>
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Refuse proposal">
        <span className="text-lg text-danger cursor-pointer active:opacity-50">
          <Link href="#">
            <FontAwesomeIcon
              onClick={() => refuseProposal(index)}
              icon={faX}
              style={{ color: "red" }}
            />
          </Link>
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete proposal">
        <span className="text-lg text-danger cursor-pointer active:opacity-50">
          <Link href="#">
            <FontAwesomeIcon
              onClick={() => deleteProposal(id)}
              icon={faTrash}
              style={{ color: "darkred" }}
            />
          </Link>
        </span>
      </Tooltip>
    </div>
  );

  useEffect(() => {
    if (loading) {
      fetchProposals();
    }
  }, []);

  return (
    <main className="h-screen w-screen bg-white overflow-x-hidden">
      <div className="top-4 left-2 ml-[5%] pt-4 flex items-center">
        <Searchbar
          objects={proposals}
          filteringAttr="auctionName"
          setFilteredObjects={setFilteredProposals}
        />
        <Tooltip content="Create proposal" color="primary">
          <svg
            onClick={() => createProposal()}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Tooltip>
      </div>
      <div className="text-black">
        <h1 className="pt-4 pb-2 ml-[5%] font-bold text-2xl">Proposal List</h1>
        <Table
          aria-label="Example table with custom cells"
          className="w-[90%] ml-[5%]"
        >
          <TableHeader>
            <TableColumn className="w-[15%] font-bold text-xl" align="center">
              Name
            </TableColumn>
            <TableColumn className="w-[20%] font-bold text-xl" align="center">
              Collection Name
            </TableColumn>
            <TableColumn className="w-[5%] font-bold text-xl" align="center">
              Min Bid
            </TableColumn>
            <TableColumn className="w-[5%] font-bold text-xl" align="center">
              High Bid
            </TableColumn>
            <TableColumn className="w-[20%] font-bold text-xl" align="center">
              Start Date
            </TableColumn>
            <TableColumn className="w-[20%] font-bold text-xl" align="center">
              End Date
            </TableColumn>
            <TableColumn className="w-[10%] font-bold text-xl" align="center">
              State
            </TableColumn>
            <TableColumn className="w-[5%] font-bold text-xl" align="center">
              Actions
            </TableColumn>
          </TableHeader>
          <TableBody>
            {filteredProposals.map((proposal: AuctionType, index: number) => (
              <TableRow key={proposal[".id"]}>
                <TableCell className="text-lg">
                  {proposal.auctionName}
                </TableCell>
                <TableCell className="text-lg">
                  {proposal.collectionName}
                </TableCell>
                <TableCell className="text-lg">
                  {proposal.auctionMinimumBid} €
                </TableCell>
                <TableCell className="text-lg">
                  {proposal.auctionHighestBid} €
                </TableCell>
                <TableCell className="text-lg">
                  {proposal.auctionStartDate
                    .toString()
                    .replace("T", " ")
                    .split("Z")}
                </TableCell>
                <TableCell className="text-lg">
                  {proposal.auctionEndDate
                    .toString()
                    .replace("T", " ")
                    .split("Z")}
                </TableCell>
                <TableCell className="text-lg">
                  {proposal.auctionState}
                </TableCell>
                <TableCell className="text-lg">
                  {renderActions(index, proposal[".id"])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ProposalsModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        updateTable={fetchProposals}
        action={action}
        id={proposalId}
      />
    </main>
  );
}
