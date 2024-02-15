import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useState, ChangeEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { defaultUser } from "../constants/users";
import { UserService } from "../services/usersService";
import { ModalProps, UserType } from "../types";

export default function UserModal(props: ModalProps) {
  const [userData, setUserData] = useState<UserType>(defaultUser);
  const [editable, setEditable] = useState<boolean>(true);

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

      setUserData({
        ...userData,
        [name]: value,
      });
    } catch (error) {
      toast.error(`Error at changing ${event.target.name} input!`);
    }
  };

  /**
   * Fetches user data
   *
   * @param id of user to fetch
   */
  const fetchUser = async (id: string) => {
    try {
      const user = await UserService.getUser(id);

      setUserData(user);
    } catch (error) {
      setUserData(defaultUser);

      toast.error(`Error fetching user!`);
    }
  };

  /**
   * Fetches user data according to action
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if ((props.action === "edit" || props.action === "show") && props.id) {
          props.action === "edit" ? setEditable(true) : setEditable(false);

          await fetchUser(props.id);
        } else {
          setEditable(true);

          setUserData({
            ...defaultUser,
          });
        }
      } catch (error) {
        toast.error("Error fetching user data!");

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
        size="md"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center text-white">
                {props.action.charAt(0).toUpperCase() + props.action.slice(1)}{" "}
                Profile
              </ModalHeader>
              <ModalBody>
                <div className="flex-1">
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="text"
                    label="Username"
                    name="userUsername"
                    value={userData.userUsername}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="text"
                    label="Personal Name"
                    name="userPersonalName"
                    value={userData.userPersonalName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    isReadOnly={!editable}
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="text"
                    label="Email"
                    name="userEmail"
                    value={userData.userEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
