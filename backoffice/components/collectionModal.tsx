import { ChangeEvent, useEffect, useState } from "react";
import { CategoryType, CollectionType, ModalProps, RaritiesType, StatesType } from "../types";
import { defaultCollection } from "../constants/collections";
import { CollectionsService } from "../services/collectionsService";
import collections from "@/pages/collections";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Textarea,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function CreateCollectionModal(props: ModalProps) {
  const [collectionData, setCollectionData] =
    useState<CollectionType>(defaultCollection);
  const [loading, setLoading] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(true);

  /**
   * Handles input change
   *
   * @param event
   */
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setCollectionData({
      ...collectionData,
      [name]: value,
    });
  };

  /**
   *  Handles category change
   *
   * @param event
   */
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoryValue = event.target.value;

    setCollectionData({
      ...collectionData,
      collectionCategory: categoryValue,
    });
  };

  /**
   * Submits collection data to database
   */
  const handleSubmit = async () => {
    try {
      if (props.action === "create") {
        await CollectionsService.createCollection(collectionData);
      } else if (props.action === "edit") {
        await CollectionsService.updateCollection(collectionData);
      }
      props.onOpenChange();
      props.updateTable();
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error at ${props.action} collection: ${error.message}`);
      } else {
        alert(`Error at ${props.action} collection!`);
      }
    }
  };

  /**
   *
   * Fetches collection data
   *
   * @param id  of collection to fetch
   */
  const fetchCollection = async (id: string) => {
    try {
      const collection = await CollectionsService.getCollection(id);
      setCollectionData(collection);
    } catch (error) {
      setCollectionData(defaultCollection);
      if (error instanceof Error) {
        alert(`Error at fetching collection: ${error.message}`);
      } else {
        alert(`Error at fetching collection!`);
      }
    }
  };

  /**
   * Fetches collection data
   */
  useEffect(() => {
    const fetchData = async () => {
      if ((props.action === "edit" || props.action === "show") && props.id) {
        props.action === "edit" ? setEditable(true) : setEditable(false);

        await fetchCollection(props.id);
      } else {
        setEditable(true);

        setCollectionData({
          ...defaultCollection,
        });
      }
    };

    fetchData();
  }, [loading, props.action, props.id]);

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
              Collection Modal
            </ModalHeader>
            <ModalBody>
              <div className="flex text-white">
                <div className="flex-1 mr-2">
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="text"
                    label="Collection Name"
                    name="collectionName"
                    value={collectionData.collectionName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                <Select
                  isDisabled={!editable}
                  label="Select a Category"
                  name="collectionCategory"
                  selectedKeys={[collectionData.collectionCategory]}
                  value={collectionData.collectionCategory}
                  onChange={handleCategoryChange}
                >
                  {Object.values(CategoryType).map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="bg-zinc-700 text-white"
                    >
                      {category}
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
                  name="collectionDescription"
                  value={collectionData.collectionDescription}
                  onChange={handleInputChange}
                />
              </div>
            </ModalBody>
            <ModalFooter className={`${editable ? "" : "hidden"}`}>
              <Button
                className="bg-teal-700 text-white hover:bg-teal-600"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
