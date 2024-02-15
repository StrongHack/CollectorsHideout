import { ProposalCardProps } from "../types";
import { Image, Link } from "@nextui-org/react";
import { formatDate } from "../constants/global";
import { useEffect, useState } from "react";
import { UploadService } from "../services/uploadService";
import { ProposalsService } from "../services/proposalsService";

export default function MyProposalCard(props: ProposalCardProps) {
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    try {
      if (
        props.proposal.auctionImages &&
        props.proposal.auctionImages.length > 0
      ) {
        UploadService.getImages(props.proposal.auctionImages).then((images) => {
          setImagesPaths(images);
          setSelectedImage(images[0]);
        });
      } else {
        setSelectedImage("/default.png");
      }
    } catch (error) {
      setImagesPaths([]);
      setSelectedImage("/default.png");
    }
  }, [props.proposal, props.proposal.auctionImages]);

  const handleCancel = async (proposalId: string) => {
    if (confirm("Are you sure you want to delete this Proposal?")) {
      try {
        const success = await ProposalsService.deleteProposal(proposalId);

        if (!success) {
          throw new Error("Error cancelling Proposal");
        }
      } catch (error) {
        console.error(error);
      }
    }
    props.onChange();
  };

  return (
    <div
      key={props.proposal[".id"]}
      className="w-[300px] h-[450px] mx-1 bg-white rounded-lg shadow-md"
    >
      {/* Image */}
      <div className="w-full h-[290px] overflow-hidden">
      {selectedImage && (
      <Image
        alt="Proposal image"
        src={selectedImage}
        className="w-[300px] h-[290px] object-cover object-center p-2"
      />
      )}
      </div>

      {/* Proposal Information */}
      <div className="w-full h-[100px] px-3 overflow-hidden">
        {/* Proposal Name and Description */}
        <div className="text-black text-lg font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.proposal.auctionName}
        </div>
        <div className="text-black text-md mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {props.proposal.auctionDescription}
        </div>

        <p className="text-gray-700 text-lg">
          <strong>State:</strong> {props.proposal.auctionState}
        </p>
      </div>
      <div className="flex justify-between items-center mt-4 pl-1 pr-1">
        <Link href={`/proposalDetails/${props.proposal[".id"]}`}>
          <div className="bg-gray-700 text-white hover:bg-gray-600 mx-auto mb-2 py-2 px-14 rounded text-center">
            View
          </div>
          <div className="mx-1"></div>
        </Link>
        <button
          className="w-[60%] mx-auto mb-2 hover:bg-orange-600 text-white px-2 py-2 rounded"
          style={{ backgroundColor: "Darkred" }}
          onClick={() => handleCancel(props.proposal[".id"])}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
