/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { ModalActionType, AuctionType, UserType } from "../../../types";
import MyProposalCard from "../../../components/proposalCard";
import { ProposalsService } from "../../../services/proposalsService";
import { useEffect, useState } from "react";
import ProfileNavbar from "../../../components/profileNavbar";
import { useDisclosure } from "@nextui-org/react";
import ProposalsModal from "../../../components/proposalsModal";
import { AuctionsService } from "../../../services/auctionService";
import toast from "react-hot-toast";
import { getCookie } from "../../../utils/cookies";
import { UserService } from "../../../services/userService";

export default function myProposals() {
  const [proposals, setProposals] = useState<AuctionType[]>([]);
  const [proposalId, setProposalId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  /**
   * Fetches proposals
   */
  const fetchProposals = async () => {
      const userId = getCookie("userId");

      const proposals = await AuctionsService.getAllAuctions();

      const filteredProposals = proposals.filter(
        (proposal) => proposal.userId === userId
      );

      setProposals(filteredProposals);
  };

  /**
   * Opens modal to create a new publication
   */
  const handleCreate = () => {
    const userId = getCookie("userId");

    if (!userId) {
      window.location.href = "/";
      toast.error("You must be logged in to access this page.");
    }

    setAction("create");
    setProposalId("");

    onOpen();
  };

  useEffect(() => {
    try {
      const userId = getCookie("userId");

      if (!userId) {
        window.location.href = "/";
        toast.error("You must be logged in to access this page.");
      } else {
        UserService.getUser(userId).then((user: UserType) => {
          fetchProposals();
        });
      }
    } catch (error) {
      console.error(error);

      setProposals([]);
      toast.error("Error fetching proposals. Try refreshing the page.");
    }

    fetchProposals();
  }, []);

  return (
    <main className="flex h-full bg-gray-200 ">
      {/* Profile Navbar */}
      <div className="bg-black w-[25%] h-[90%] bg-gray-200 mx-auto p-4">
        <ProfileNavbar />
      </div>

      {/* List of proposals */}
      <div className="bg-black w-[80%] bg-gray-200 mx-auto p-4">
        <div className="w-full pr-8 flex flex-row justify-between">
          <h1 className="text-3xl text-black text-bold font-bold text-center my-1">
            My Proposals
          </h1>
          <button
            className="bg-gray-700 text-white hover:bg-gray-600 rounded-md py-1 px-2"
            onClick={() => handleCreate()}
          >
            Create Proposal
          </button>
        </div>
        <div className="flex flex-wrap justify-start pl-4">
          {proposals.map((proposal) => (
            <div key={proposal[".id"]} className=" bg-gray-200 p-4 mb-4 mr-4">
              <div className="mx-auto">
                <MyProposalCard onChange={fetchProposals} proposal={proposal} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProposalsModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        updateTable={ProposalsService.getProposal}
        action={action}
        id={proposalId}
      />
    </main>
  );
}
