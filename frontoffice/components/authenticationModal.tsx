import React, { ChangeEvent, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  Input,
  Link,
  user,
} from "@nextui-org/react";
import { AuthenticationModalProps, UserType } from "../types";
import { EyeSlashFilledIcon } from "./eyeSlashFilledIcon";
import { EyeFilledIcon } from "./eyeFilledIcon";
import { defaultUser } from "../constants/users";
import { UserService } from "../services/userService";
import { setCookie } from "../utils/cookies";
import toast from "react-hot-toast";

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const [userData, setUserData] = useState<UserType>(defaultUser);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLogging, setLogging] = useState<boolean>(true);

  const toggleVisibility = () => setIsVisible(!isVisible);

  /**
   * Handles input change
   *
   * @param event change event
   */
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const { name, value } = event.target;

      setUserData({
        ...userData,
        [name]: value,
      })
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Register user with user data
   */
  const register = async () => {
    try {
      const success = await UserService.createUser(userData);
      
      success ? toast.success("Registration successful!") : toast.error("Registration failed. Please try again.");

    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Tries to authenticate user
   */
  const authenticate = async () => {
    const userId = await UserService.authenticateUser(userData.userEmail, userData.userPassword);

    try {
      if (userId !== "") {
        toast.success("Authenticated successfully!")

        setCookie('userId', userId);

        props.onOpenChange();
        props.onLogin();

        setUserData(defaultUser);

      } else {
        toast.error("Invalid email or password!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Modal
        backdrop="blur"
        className="bg-gray-200 border border-white shadow-xl overflow-x-hidden size-2xl"
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        placement="top-center"
        size="sm"
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                <div className="flex flex-col mt-4">
                  <text className="text-3xl text-black font-bold mx-auto">{isLogging ? "Welcome Back" : "Sign Up"}</text>
                  <text className="text-sm text-black mx-auto">{isLogging ? "Enter your credentials to login" : "Create your account"}</text>
                </div>
                <div className="flex-1 mr-2 mt-4 rounded-2xl">
                  <Input
                    className="flex text-zind-700 bg-white rounded-lg"
                    autoFocus
                    type="text"
                    label="Email Address"
                    name="userEmail"
                    value={userData.userEmail}
                    onChange={handleInputChange}
                  />
                </div>
                {!isLogging &&
                  <>
                    <div className="flex-1 mr-2">
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
                    <div className="flex-1 mr-2">
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
                  </>
                }
                <div className="flex text-white">
                  <div className="flex-1 mr-2">
                    <Input
                      className="flex text-zind-700 bg-white rounded-lg"
                      autoFocus
                      endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                          {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                      label="Password"
                      name="userPassword"
                      value={userData.userPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button
                  className="bg-teal-700 w-full mx-auto text-white rounded-3xl hover:bg-teal-600"
                  onClick={isLogging ? () => authenticate() : () => register()}
                >
                  {isLogging ? "Log In" : "Sign Up"}
                </Button>
                {isLogging &&
                  <div className="flex mt-8 cursor-pointer">
                    <Link className="font-bold mx-auto text-teal-900 hover:text-teal-800">Forgot password?</Link>
                  </div>
                }
                <div className="flex text-black mt-8">
                  <text className="mx-auto cursor-pointer">{isLogging ? "Dont have an account?" : "Already have an account?"} <Link
                    className="mx-auto cursor-pointer text-teal-900 hover:text-teal-800"
                    onClick={() => setLogging(!isLogging)}
                  >
                    {isLogging ? "Sign Up" : "Login"}
                  </Link>
                  </text>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}