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
import { defaultAuction } from "../constants/auctions";
import { AuctionsService } from "../services/auctionService";
import { DateTimeUtils } from "../utils/dateTimeUtils";
import { UploadService } from "../services/uploadService";
import toast from "react-hot-toast";
import { CollectionsService } from "../services/collectionsService";

export default function AuctionModal(props: ModalProps) {
  const [auctionData, setAuctionData] = useState<AuctionType>(defaultAuction);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [FilesArray, setFilesArray] = useState<File[]>([]);

  const [editable, setEditable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Handles selection of images
   *
   * @param event
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
        setAuctionData({
          ...auctionData,
          auctionImages: imageArray.map((file) => file.name),
        });
      }
    } catch (error) {
      setAuctionData({
        ...auctionData,
        auctionImages: [],
      });

      toast.error("Error adding images to auction!");
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

      setAuctionData({
        ...auctionData,
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
      setAuctionData({
        ...auctionData,
        collectionName: selectedCollectionName,
      });
    } catch (error) {
      toast.error("Error associating collectable to auction.");
    }
  };

  /**
   * Handles save button
   */
  const handleSave = async () => {
    try {
      if (auctionData.auctionImages.length === 0) {
        const userConfirmed = confirm(
          `No images were selected. Are you sure you want to create a new auction without images?`
        );

        if (!userConfirmed) {
          return;
        }
      }

      await UploadService.uploadImages(FilesArray);

      if (props.action === "create") {
        const success = await AuctionsService.createAuction(auctionData);

        //Returns to avoid closing modal
        if (!success) {
          return;
        }

        setAuctionData(defaultAuction);
      } else if (props.action === "edit") {
        const success = await AuctionsService.updateAuction(auctionData);

        //Returns to avoid closing modal
        if (!success) {
          return;
        }
      }

      //Updates table and closes modal
      props.onOpenChange();
      props.updateTable();
    } catch (error) {
      toast.error(`Error at ${props.action} auction!`);
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

      setAuctionData({
        ...auctionData,
        auctionProductRarity: rarityValue,
      });
    } catch (error) {
      toast.error("Error changing rarity!");
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
      setAuctionData({
        ...auctionData,
        auctionProductState: stateValue,
      });
    } catch (error) {
      toast.error("Error changing state!");
    }
  };

  /**
   * Fetchs auction
   *
   * @param id of auction to fetch
   */
  const fetchAuction = async (id: string) => {
    try {
      const auction = await AuctionsService.getAuction(id);

      setAuctionData(auction);
    } catch (error) {
      setAuctionData(defaultAuction);

      toast.error(`Error fetching auction!`);
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
      toast.error(`Error fetching collectables! Modal will close now.`);

      setCollections([]);
      props.onOpenChange();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if ((props.action === "edit" || props.action === "show") && props.id) {
          props.action === "edit" ? setEditable(true) : setEditable(false);

          await fetchAuction(props.id);
        } else {
          setEditable(true);

          setAuctionData(defaultAuction);
        }

        if (loading) {
          fetchCollections();
        }
      } catch (error) {
        toast.error("Error fetching auction!");

        props.onOpenChange();
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
                Auction Modal
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
                      value={auctionData.auctionName}
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
                      value={auctionData.auctionMinimumBid.toString()}
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
                      value={auctionData.auctionBidIncrement.toString()}
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
                      value={auctionData.auctionProductEstimatedValue.toString()}
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
                    value={auctionData.collectionName}
                    inputValue={auctionData.collectionName}
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
                    selectedKeys={[auctionData.auctionProductState]}
                    value={auctionData.auctionProductState}
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
                    selectedKeys={[auctionData.auctionProductRarity]}
                    value={auctionData.auctionProductRarity}
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
                    value={auctionData.auctionProductEdition}
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
                      auctionData.auctionStartDate.toString()
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
                      auctionData.auctionEndDate.toString()
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
                    value={auctionData.auctionDescription}
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
