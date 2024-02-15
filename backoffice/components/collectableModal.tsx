import React, { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { UploadService } from "../services/uploadService";
import {
  ModalProps,
  CollectionType,
  CollectableType,
  StatesType,
  RaritiesType,
} from "../types";
import { CollectablesService } from "../services/collectablesService";
import { defaultCollectable } from "../constants/collectables";
import toast from "react-hot-toast";
import { CollectionsService } from "../services/collectionsService";

/**
 * Modal to create collectables
 */
export default function CreateCollectableModal(props: ModalProps) {
  const [collectableData, setCollectableData] = useState<CollectableType>(defaultCollectable);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [FilesArray, setFilesArray] = useState<File[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(true);

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

      setCollectableData({
        ...collectableData,
        [name]: value,
      });
    } catch (error) {
      toast.error(`Error changing ${event.target.name} input!`)
    }
  };

  /**
   * Handles collection change
   *
   * @param selectedCollectionName selected collection for collectable
   */
  const handleCollections = (selectedCollectionName: string) => {
    try {
      setCollectableData({
        ...collectableData,
        collectionId: selectedCollectionName,
      });
    } catch (error) {
      toast.error("Error associating collection to collectable!")
    }
  };

  /**
   * Handles rarity changes
   *
   * @param event change event
   */
  const handleRarityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      const rarityValue = event.target.value;

      setCollectableData({
        ...collectableData,
        collectableRarity: rarityValue,
      });
    } catch (error) {
      toast.error("Error changing rarity of collectable!");
    }
  };

  /**
   * Handles state change
   *
   * @param event change event
   */
  const handleStateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      const stateValue = event.target.value;

      setCollectableData({
        ...collectableData,
        collectableState: stateValue,
      });
    } catch (error) {
      toast.error("Error changing state of collectable!");
    }
  };

  /**
   * Handles images
   *
   * @param event change event
   */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFiles = event.target.files;

      if (selectedFiles) {
        if (Array.from(selectedFiles).length > 4) {
          toast.error("Auction permits a maximum of 4 images. Only the first 4 files will be selected!")
        }

        const imageArray = Array.from(selectedFiles).slice(0, 4);

        setFilesArray(imageArray);
        setCollectableData({
          ...collectableData,
          collectableImages: imageArray.map((file) => file.name),
        });
      }
    } catch (error) {
      setCollectableData({
        ...collectableData,
        collectableImages: [],
      });

      toast.error("Error adding images to collectable!")
    }
  };

  /**
   * Fetches to associate a new Colelctable image to collectable
   */
  const handleSubmit = async () => {
    try {
      if (collectableData.collectableImages.length === 0) {
        const userConfirmed = confirm(`No images were selected. Are you sure you want to create a new collectable without images?`);

        if (!userConfirmed) {
          return;
        }
      }

      await UploadService.uploadImages(FilesArray);

      if (props.action === "create") {
        const success = await CollectablesService.createCollectable(collectableData);

        //Returns to avoid closing modal
        if (!success) {
          return;
        }

        setCollectableData(defaultCollectable);
      } else if (props.action === "edit") {
        const success = await CollectablesService.updateCollectable(collectableData);

        //Returns to avoid closing modal
        if (!success) {
          return;
        }
      }

      //Updates table and closes modal
      props.onOpenChange();
      props.updateTable();
    } catch (error) {
      toast.error(`Error at ${props.action} collectable!`);
    }
  };

  /**
   * Fetchs collectable
   *
   * @param id of collectable to fetch
   */
  const fetchCollectable = async (id: string) => {
    try {
      const collectable = await CollectablesService.getCollectable(id);

      setCollectableData(collectable);
    } catch (error) {
      setCollectableData(defaultCollectable)

      toast.error(`Error fetching collectable!`);
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
      toast.error("Error fetching collections!");

      setCollections([]);
      props.onOpenChange();
    }
  }

  /**
   * Fetches collections data to associate to collectables
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if ((props.action === "edit" || props.action === "show") && props.id) {
          props.action === "edit" ? setEditable(true) : setEditable(false);

          await fetchCollectable(props.id);
        } else {
          setEditable(true);

          setCollectableData({
            ...defaultCollectable,
          });
        }

        if (loading) {
          fetchCollections();
        }
      } catch (error) {
        toast.error("Error fetching collectable data!");

        props.onOpenChange();
      }
    };

    fetchData();
  }, [props.action, props.id]);

  return (
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
              Collectable Modal
            </ModalHeader>
            <ModalBody>
              <div className="flex text-white">
                <div className="flex-1 mr-2">
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="text"
                    label="Collectable Name"
                    name="collectableName"
                    value={collectableData.collectableName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="number"
                    label="Collectable Price"
                    name="collectablePrice"
                    value={collectableData.collectablePrice.toString()}
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
                    label="Collectable Stock"
                    name="collectableStock"
                    value={collectableData.collectableStock.toString()}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="text"
                    label="Collectable Edition"
                    name="collectableEdition"
                    value={collectableData.collectableEdition}
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
                  value={collectableData.collectionId}
                  inputValue={collectableData.collectionId}
                  onValueChange={handleCollections}
                  onInputChange={handleCollections}
                  className="flex-grow"
                >
                  {(collection: { collectionName: any; }) => (
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
                  selectedKeys={[collectableData.collectableState]}
                  value={collectableData.collectableState}
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
                  selectedKeys={[collectableData.collectableRarity]}
                  value={collectableData.collectableRarity}
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
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                <Textarea
                  isReadOnly={!editable}
                  label="Enter Collectable description"
                  type="text"
                  className="flex text-zind-700 bg-white rounded-lg"
                  name="collectableDescription"
                  value={collectableData.collectableDescription}
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
              <Button className="bg-teal-700 text-white hover:bg-teal-600" onClick={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
