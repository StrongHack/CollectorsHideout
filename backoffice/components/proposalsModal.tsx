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
  Textarea,
  Input,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  AuctionType,
  CollectionType,
  ModalProps,
  RaritiesType,
  StatesType,
} from "../types";
import { defaultProposal } from "../constants/proposals";
import { ProposalsService } from "../services/proposalsService";
import { DateTimeUtils } from "../utils/dateTimeUtils";
import { UploadService } from "../services/uploadService";
import toast from "react-hot-toast";
import { CollectionsService } from "../services/collectionsService";

export default function ProposalsModal(props: ModalProps) {
  const [proposalData, setProposalData] =
    useState<AuctionType>(defaultProposal);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [FilesArray, setFilesArray] = useState<File[]>([]);

  const [editable, setEditable] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(true);

  /**
   * Handles images selection
   *
   * @param event select image event
   */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFiles = event.target.files;

      if (selectedFiles) {
        if (Array.from(selectedFiles).length > 4) {
          toast.error(
            "Auction permits a maximum of 4 images. Only the first 4 files will be selected!"
          );
        }

        const imageArray = Array.from(selectedFiles).slice(0, 4);

        setFilesArray(imageArray);
        setProposalData({
          ...proposalData,
          auctionImages: imageArray.map((file) => file.name),
        });
      }
    } catch (error) {
      setProposalData({
        ...proposalData,
        auctionImages: [],
      });

      toast.error("Error adding images to auction proposal!");
    }
  };

  /**
   * Handles input change
   *
   * @param event change event
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
      toast.error(`Error changing ${event.target.name} input!`);
    }
  };

  /**
   * Handles collection change
   *
   * @param selectedCollectionName
   */
  const handleCollections = (selectedCollectionName: string) => {
    try {
      setProposalData({
        ...proposalData,
        collectionName: selectedCollectionName,
      });
    } catch (error) {
      toast.error("Error selecting collection!");
    }
  };

  /**
   * Handles rarity changes
   *
   * @param event
   */
  const handleRarityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      const rarityValue = event.target.value;

      setProposalData({
        ...proposalData,
        auctionProductRarity: rarityValue,
      });
    } catch (error) {
      toast.error("Error chaning rarity change!");
    }
  };

  /**
   * Handles state change
   *
   * @param event
   */
  const handleStateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      const stateValue = event.target.value;

      setProposalData({
        ...proposalData,
        auctionProductState: stateValue,
      });
    } catch (error) {
      toast.error("Error choosing collectables to associate to proposal!");
    }
  };

  /**
   * Handles save button to create or edit proposal
   */
  const handleSave = async () => {
    try {
      if (proposalData.auctionImages.length === 0) {
        const userConfirmed = confirm(
          `No images were selected. Are you sure you want to create a new proposal without images?`
        );

        if (!userConfirmed) {
          return;
        }
      }

      await UploadService.uploadImages(FilesArray);

      if (props.action === "create") {
        const success = await ProposalsService.createProposal(proposalData);

        //Returns to avoid closing modal
        if (!success) {
          return;
        }

        setProposalData(defaultProposal);
      } else if (props.action === "edit") {
        const success = await ProposalsService.updateProposal(proposalData);

        //Returns to avoid closing modal
        if (!success) {
          return;
        }
      }

      //Updates table and closes modal
      props.updateTable();
      props.onOpenChange();
    } catch (error) {
      toast.error(`Error at ${props.action} auction proposal.`);
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
    } catch (error) {
      setProposalData(defaultProposal);

      toast.error(`Error fetching auction proposal.`);
    }
  };

  /**
   * Fetches collections
   */
  const fetchCollections = async () => {
    try {
      const collections = await CollectionsService.getCollections();

      setCollections(collections);
      setLoading(false);
    } catch (error) {
      toast.error(`There was an error fetching collections.`);

      props.onOpenChange();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if ((props.action === "edit" || props.action === "show") && props.id) {
          props.action === "edit" ? setEditable(true) : setEditable(false);

          await fetchProposal(props.id);
        } else {
          setEditable(true);

          setProposalData(defaultProposal);
        }
      } catch (error) {
        toast.error("Error fetching proposal data");
      }

      if (isLoading) {
        fetchCollections();
      }
    };

    fetchData();
  }, [props.action, props.id]);

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
                  <label className="flex justify-center p-2 border border-gray-300 rounded-md bg-white">
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
                <div className="flex py-2 px-1 justify-between"></div>
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
