/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Autocomplete,
  AutocompleteItem,
  Image,
  Textarea,
  Input,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  AuctionType,
  CollectableType,
  CollectionType,
  ModalProps,
  StatesType,
} from "../types";
import { defaultAuction } from "../constants/auctions";
import { ProposalsService } from "../services/proposalsService";
import { CollectablesService } from "../services/collectablesService";
import { DateTimeUtils } from "../utils/dateTimeUtils";
import { RaritiesType } from "../constants/collectables";
import toast from "react-hot-toast";
import { defaultProposal } from "../constants/proposals";
import { getCookie } from "../utils/cookies";
import { UploadService } from "../services/uploadService";

export default function ProposalsModal(props: ModalProps) {
  const [proposalData, setProposalData] = useState<AuctionType>(defaultProposal);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [editable, setEditable] = useState<boolean>(true);
  const [loggedUser, setLoggedUser] = useState<string>("");
  const [FilesArray, setFilesArray] = useState<File[]>([]);

  /**
   * Handles images selection
   *
   * @param event
   */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFiles = event.target.files;
      if (selectedFiles) {
        const imageArray = Array.from(selectedFiles)
          .slice(0, 4)
        setFilesArray(imageArray);
        setProposalData({
          ...proposalData,
          auctionImages: imageArray.map((file) => file.name),
        });
      }
    } catch (error) {
      setFilesArray([]);
      setProposalData({
        ...proposalData,
        auctionImages: [],
      });
    }
  };

  /**
   * Handles input change
   *
   * @param event
   */
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      const { name, value } = event.target;

      setProposalData({
        ...proposalData,
        [name]: value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles collection change
   *
   * @param selectedCollectionName
   */
  const handleCollections = (selectedCollectionName: string) => {
    setProposalData({
      ...proposalData,
      collectionName: selectedCollectionName,
    });
  };

  /**
   * Handles rarity changes
   *
   * @param event
   */
  const handleRarityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const rarityValue = event.target.value;

    setProposalData({
      ...proposalData,
      auctionProductRarity: rarityValue,
    });
  };

  /**
   * Handles state change
   *
   * @param event
   */
  const handleStateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const stateValue = event.target.value;
    setProposalData({
      ...proposalData,
      auctionProductState: stateValue,
    });
  };

  /**
   * Handles save button to create or edit proposal
   */
  const handleSave = async () => {
    try {
      await UploadService.uploadImages(FilesArray);
  
      const updatedProposalData = {
        ...proposalData,
        userId: loggedUser || "",
      };
  
      let success = false;
  
      if (props.action === "create") {
        success = await ProposalsService.createProposal(updatedProposalData);
      } else if (props.action === "edit") {
        success = await ProposalsService.createProposal(updatedProposalData);
      }
  
      if (!success) {
        console.error("Error saving images.");
      }
  
      props.onOpenChange();
      props.updateTable();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Fetches proposal
   *
   * @param id of proposal to fetch
   */
  const fetchProposal = async (id: string) => {
    try {
      const proposal = await ProposalsService.getProposal(id);

      setProposalData(proposal);
    } catch (err) {
      console.error(err);

      setProposalData(defaultProposal);
    }
  };

  /**
   * Fetches collections
   */
  const fetchCollections = async () => {
    fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}api/collections`)
      .then((res) => res.json())
      .then((data: CollectionType[]) => {
        const updatedCollections = data.map((collection: any) => ({
          collectionName: collection.collectionName,
        }));

        setCollections(updatedCollections);
      })
      .catch((error) => {
        console.error(error);
        props.onOpenChange();
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (props.action === "edit" && props.id) {
        // Fetch existing proposal
        await fetchProposal(props.id);
      } else {
        // Set proposal to default value
        setProposalData({
          ...defaultAuction,
          auctionState: "Pending",
        });
      }

      const userId = getCookie("userId");
      setLoggedUser(userId || "");

      // Fetch collectables if isLoading is true
      if (isLoading) {
        fetchCollections();
      }
    };

    fetchData();
  }, [isLoading, props.action, props.id]);

  return (
    <>
      <Modal
        backdrop="blur"
        className="bg-gray-700 border border-white shadow-xl overflow-x-hidden size-2xl"
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        placement="top-center"
        size="3xl"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center text-white">
                {props.action.charAt(0).toUpperCase() + props.action.slice(1)}{" "}
                Proposal Modal
              </ModalHeader>
              <ModalBody>
                <div className="flex text-white">
                  <div className="flex-1">
                    <Input
                      isReadOnly={!editable}
                      className="flex text-zind-700 bg-white rounded-lg"
                      autoFocus
                      type="text"
                      label="Auction Name"
                      name="auctionName"
                      value={proposalData.auctionName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1 mr-2">
                    <Input
                      isReadOnly={!editable}
                      className="flex text-zind-700 bg-white rounded-lg"
                      autoFocus
                      type="number"
                      label="Auction Minimum Bid"
                      name="auctionMinimumBid"
                      value={proposalData.auctionMinimumBid.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex-1 mr-2">
                    <Input
                      isReadOnly={!editable}
                      className="flex text-zind-700 bg-white rounded-lg"
                      autoFocus
                      type="number"
                      label="Auction Bid Increment"
                      name="auctionBidIncrement"
                      value={proposalData.auctionBidIncrement.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex-1 ">
                    <Input
                      isReadOnly={!editable}
                      className="flex text-zind-700 bg-white rounded-lg"
                      autoFocus
                      type="number"
                      label="Estimated Value"
                      name="auctionProductEstimatedValue"
                      value={proposalData.auctionProductEstimatedValue.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                  <Autocomplete
                    isDisabled={!editable}
                    defaultItems={collections}
                    label="Collection"
                    placeholder="Search a collection"
                    value={proposalData.collectionName}
                    inputValue={proposalData.collectionName}
                    onValueChange={handleCollections}
                    onInputChange={handleCollections}
                    className="flex-grow"
                  >
                    {(collection: { collectionName: any }) => (
                      <AutocompleteItem
                        className="bg-zinc-700 text-white"
                        key={collection.collectionName}
                      >
                        {collection.collectionName}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                  <Select
                    isDisabled={!editable}
                    label="Select a State"
                    name="collectableState"
                    selectedKeys={[proposalData.auctionProductState]}
                    value={proposalData.auctionProductState}
                    onChange={handleStateChange}
                  >
                    {Object.values(StatesType).map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="bg-zinc-700 text-white"
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    isDisabled={!editable}
                    label="Select a Rarity"
                    name="collectableRarity"
                    selectedKeys={[proposalData.auctionProductRarity]}
                    value={proposalData.auctionProductRarity}
                    onChange={handleRarityChange}
                  >
                    {Object.values(RaritiesType).map((rarity) => (
                      <SelectItem
                        key={rarity}
                        value={rarity}
                        className="bg-zinc-700 text-white"
                      >
                        {rarity}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="text"
                    label="Auction Edition"
                    name="auctionProductEdition"
                    value={proposalData.auctionProductEdition}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="datetime-local"
                    label="Auction Start Date"
                    name="auctionStartDate"
                    value={DateTimeUtils.convertDateTime(
                      proposalData.auctionStartDate.toString()
                    )}
                    onChange={handleInputChange}
                    placeholder="Start Date"
                  />
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="datetime-local"
                    label="Auction End Date"
                    name="auctionEndDate"
                    value={DateTimeUtils.convertDateTime(
                      proposalData.auctionEndDate.toString()
                    )}
                    onChange={handleInputChange}
                    placeholder="End Date"
                  />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                  <Textarea
                    isReadOnly={!editable}
                    label="Enter Auction description"
                    type="text"
                    className="flex text-zind-700 bg-white rounded-lg"
                    name="auctionDescription"
                    value={proposalData.auctionDescription}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="justify-between"></div>
                <div className={`flex-1 ${editable ? "" : "hidden"}`}>
                  <label className="flex justify-center p-2 border border-gray-300 rounded-md bg-white text-black">
                    Choose Files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <div className="flex  px-1 justify-between"></div>
              </ModalBody>
              <ModalFooter className={`${editable ? "" : "hidden"}`}>
                <Button
                  className="bg-teal-700 text-white hover:bg-teal-600"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
