import { ChangeEvent, useEffect, useState } from "react";
import { PublicationType, ModalProps, PublicationTypes } from "../types";
import { defaultPublication } from "../constants/publications";
import { PublicationsService } from "../services/publicationsService";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { UploadService } from "../services/uploadService";
import { get } from "http";
import { getCookie } from "../utils/cookies";
import toast from "react-hot-toast";

export default function CreatePublicationModal(props: ModalProps) {
  const [publicationData, setPublicationData] =
    useState<PublicationType>(defaultPublication);
  const [FilesArray, setFilesArray] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(true);
  const [loggedUser, setLoggedUser] = useState<string>("");

  /**
   * Handles selection of images
   *
   * @param event
   */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFiles = event.target.files;
      if (selectedFiles) {
        const imageArray = Array.from(selectedFiles).slice(0, 4);
        setFilesArray(imageArray);
        setPublicationData({
          ...publicationData,
          images: imageArray.map((file) => file.name),
        });
      }
    } catch (error) {
      setFilesArray([]);
      setPublicationData({
        ...publicationData,
        images: [],
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

      setPublicationData({
        ...publicationData,
        [name]: value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles type change
   *
   * @param event
   */
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      const typeValue = event.target.value;

      setPublicationData({
        ...publicationData,
        type: typeValue,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Fetchs publication
   *
   * @param id of publication to fetch
   */
  const fetchPublication = async (id: string) => {
    try {
      const publication = await PublicationsService.getPublication(id);

      setPublicationData(publication);
    } catch (error) {
      setPublicationData(defaultPublication);

      toast.error(`Error fetching auction!`);
    }
  };

  const handleSubmit = async () => {
    try {
      await UploadService.uploadImages(FilesArray);
  
      const updatedPublicationData = {
        ...publicationData,
        userId: loggedUser || "",
      };
  
      let success = false;
  
      if (props.action === "create") {
        success = await PublicationsService.createPublication(updatedPublicationData);
      } else if (props.action === "edit") {
        success = await PublicationsService.updatePublication(updatedPublicationData);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (props.action === "edit" && props.id) {
          props.action === "edit" ? setEditable(true) : setEditable(false);

          await fetchPublication(props.id);
        } else {
          setEditable(true);

          setPublicationData(defaultPublication);
        }
      } catch (error) {
        toast.error("Error fetching auction!");

        props.onOpenChange();
      }
    };
    const userId = getCookie("userId");
    setLoggedUser(userId || "");
    fetchData();
  }, [props.action, props.id]);

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        size="2xl"
        className="bg-gray-700 border border-white shadow-xl overflow-x-hidden size-2xl"
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center text-white">
                {props.action === "create"
                  ? "Create Publication"
                  : "Update Publication"}
              </ModalHeader>
              <ModalBody>
                <div className="flex text-white">
                  <div className="flex-1 mr-2">
                    <Input
                      className="flex text-zind-700 bg-white rounded-lg"
                      autoFocus
                      type="text"
                      label="Publication Title"
                      name="title"
                      value={publicationData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      className="flex text-zind-700 bg-white rounded-lg"
                      autoFocus
                      type="number"
                      label="Publication Price"
                      name="price"
                      value={publicationData.price.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                  <Select
                    label="Select a Type"
                    name="type"
                    selectedKeys={[publicationData.type]}
                    value={publicationData.type}
                    onChange={handleTypeChange}
                  >
                    {Object.values(PublicationTypes).map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="bg-zinc-700 text-white"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                  <Textarea
                    label="Enter Publication description"
                    type="text"
                    className="flex text-zind-700 bg-white rounded-lg"
                    name="description"
                    value={publicationData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="justify-between"></div>
                <div className="flex-1">
                  <label className="flex justify-center text-black p-2 border border-gray-300 rounded-md bg-white">
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
              <ModalFooter>
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
    </>
  );
}
