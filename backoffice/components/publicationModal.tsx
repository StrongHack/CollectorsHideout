import { ChangeEvent, useEffect, useState } from "react";
import {
  PublicationType,
  ModalProps,
  PublicationTypes,
  UserType,
} from "../types";
import { defaultPublication } from "../constants/publications";
import { PublicationsService } from "../services/publicationsService";
import {
  Autocomplete,
  AutocompleteItem,
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
import toast from "react-hot-toast";
import collections from "@/pages/collections";
import { UserService } from "../services/usersService";

export default function CreatePublicationModal(props: ModalProps) {
  const [publicationData, setPublicationData] =
    useState<PublicationType>(defaultPublication);
  const [FilesArray, setFilesArray] = useState<File[]>([]);
  const [editable, setEditable] = useState<boolean>(true);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Handles selection of images
   *
   * @param event change event
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
        setPublicationData({
          ...publicationData,
          images: imageArray.map((file) => file.name),
        });
      }
    } catch (error) {
      setPublicationData({
        ...publicationData,
        images: [],
      });

      toast.error("Error adding images to auction!");
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
      toast.error(`Error at changing ${event.target.name} input!`);
    }
  };

  /**
   * Handles type change
   *
   * @param event change event
   */
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      const typeValue = event.target.value;

      setPublicationData({
        ...publicationData,
        type: typeValue,
      });
    } catch (error) {
      toast.error("Error changing publication type!");
    }
  };

  /**
   * Handles save button
   */
  const handleSubmit = async () => {
    try {
      if (publicationData.images.length === 0) {
        const userConfirmed = confirm(
          `No images were selected. Are you sure you want to create a new auction without images?`
        );

        if (!userConfirmed) {
          return;
        }
      }

      await UploadService.uploadImages(FilesArray);

      if (props.action === "create") {
        const success = await PublicationsService.createPublication(
          publicationData
        );

        //Returns to avoid closing modal
        if (!success) {
          return;
        }

        setPublicationData(defaultPublication);
      } else if (props.action === "edit") {
        const success = await PublicationsService.updatePublication(
          publicationData
        );

        //Returns to avoid closing modal
        if (!success) {
          return;
        }
      }

      //Sets auction data to default, updates table and closes modal
      props.onOpenChange();
      props.updateTable();
    } catch (error) {
      toast.error(`Error at ${props.action} publication!`);
    }
  };

  /**
   * Fetches publication
   *
   * @param id of publication to fetchs
   */
  const fetchPublication = async (id: string) => {
    try {
      const publication = await PublicationsService.getPublication(id);

      setPublicationData(publication);
    } catch (error) {
      setPublicationData(defaultPublication);

      toast.error(`Error fetching publication!`);
    }
  };

  /**
   * Fetches publication data according to action
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if ((props.action === "edit" || props.action === "show") && props.id) {
          props.action === "edit" ? setEditable(true) : setEditable(false);

          await fetchPublication(props.id);
        } else {
          setEditable(true);

          setPublicationData({
            ...defaultPublication,
          });
        }

        if (loading) {
          fetchUsers();
        }
      } catch (error) {
        toast.error("Error fetching publication data!");

        props.onOpenChange();
      }
    };

    fetchData();
  }, [props.action, props.id]);

  const fetchUsers = async () => {
    try {
      const users = await UserService.getUsers();

      setUsers(users);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching Users!");

      setUsers([]);
      props.onOpenChange();
    }
  };

  /**
   *  Handles user change
   *
   * @param selectedUserName selected user name for publication
   */
  const handleUsers = (selectedUserName: string) => {
    try {
      setPublicationData({
        ...publicationData,
        userId: selectedUserName,
      });
    } catch (error) {
      toast.error("Error associating user to publication!");
    }
  };

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
                      isReadOnly={!editable}
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
                      isReadOnly={!editable}
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
                    isDisabled={!editable}
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
                  <Autocomplete
                    isDisabled={!editable}
                    defaultItems={users}
                    label="User"
                    placeholder="Search a user"
                    value={publicationData.userId}
                    inputValue={publicationData.userId}
                    onValueChange={handleUsers}
                    onInputChange={handleUsers}
                    className="flex-grow"
                  >
                    {(user: { userUsername: any }) => (
                      <AutocompleteItem
                        className="bg-zinc-700 text-white"
                        key={user.userUsername}
                      >
                        {user.userUsername}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                  <Textarea
                    isReadOnly={!editable}
                    label="Enter Publication description"
                    type="text"
                    className="flex text-zind-700 bg-white rounded-lg"
                    name="description"
                    value={publicationData.description}
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
              <ModalFooter>
                <Button
                  className={`${
                    editable ? "" : "hidden"
                  } bg-teal-700 text-white hover:bg-teal-600`}
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
