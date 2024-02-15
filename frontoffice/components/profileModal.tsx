/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  ModalFooter,
} from "@nextui-org/react";
import { UserService } from "../services/userService";
import { ModalProps, UserType } from "../types";
import { defaultUser } from "../constants/users";
import toast from "react-hot-toast";
import { UploadService } from "../services/uploadService";

export default function ProfileModal(props: ModalProps) {
  const [userData, setUserData] = useState<UserType>(defaultUser);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imagesPaths, setImagesPaths] = useState<string>();
  const [file, setFile] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<string>();
  const [previewImage, setPreviewImage] = useState("");

  /**
   * Handles the selection of a profile image
   *
   * @param event The event triggered by file input change
   */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      // Ensure that files are selected
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      // Get the first selected file
      const selectedFile = event.target.files[0];

      setFile(selectedFile);

      const fileURL = URL.createObjectURL(selectedFile);

      setPreviewImage(fileURL);

      setUserData({
        ...userData,
        userProfilePicture: fileURL,
      });
    } catch (error) {
      console.error(error);

      // Reset userProfilePicture in userData in case of error
      setUserData({
        ...userData,
        userProfilePicture: "",
      });
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      const { name, value } = event.target;

      // Check if the input change is for password or confirm password fields
      if (name === "userPassword") {
        setUserPassword(value);
      } else if (name === "confirmPassword") {
        setConfirmPassword(value);
      } else {
        // For other inputs, update userData normally
        setUserData({
          ...userData,
          [name]: value,
        });
      }
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }
  };

  /**
   * Handles save button click
   */
  const handleSave = async () => {
    const updatedUserData = { ...userData };

    // Check if passwords are provided and match
    if (userPassword !== "" || confirmPassword !== "") {
      if (userPassword !== confirmPassword) {
        return toast.error("Passwords do not match!");
      } else {
        updatedUserData.userPassword = userPassword;
      }
    }

    try {
      // Check if a new image was selected
      if (file) {
        await UploadService.uploadImage(file);
        updatedUserData.userProfilePicture = file.name;
      }

      // Update user data
      await UserService.updateUser(updatedUserData);

      toast.success("Profile updated successfully!");

      // Resets auction data, updates table, and closes modal
      props.onOpenChange();
      props.updateTable();
    } catch (error) {
      console.error("Error in saving data: ", error);
      toast.error("Error saving data! Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (props.id) {
        await fetchUser(props.id);
      }

      try {
        UploadService.getImage(userData.userProfilePicture).then((image) => {
          setImagesPaths(image);
        });
      } catch (error) {
        setImagesPaths("");
      }

      // Reset password fields every time the modal is opened
      setUserPassword("");
      setConfirmPassword("");
      setLoading(false);
    };
    fetchData();
  }, [props.id, props.action]);

  useEffect(() => {
    if (imagesPaths) {
      setSelectedImage(imagesPaths);
    } else {
      setSelectedImage("/default.png");
    }
  }, [imagesPaths]);

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
                <div className="flex flex-col justify-center items-center gap-4">
                  <img
                    className="w-[200px] h-[200px] object-cover rounded-full border border-gray-400"
                    src={previewImage || selectedImage}
                  />

                  <label className="text-white cursor-pointer hover:text-teal-600 pb-1">
                    Upload new image
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <Input
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
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="text"
                    label="Email"
                    name="userEmail"
                    value={userData.userEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="password"
                    label="Password"
                    name="userPassword"
                    value={userPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Input
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="password"
                    label="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setConfirmPassword(event.target.value)
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
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
