/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import ProfileNavbar from "../../../components/profileNavbar";
import { useDisclosure } from "@nextui-org/react";
import { UserService } from "../../../services/userService";
import { ModalActionType, UserType } from "../../../types";
import { UploadService } from "../../../services/uploadService";
import ProfileModal from "../../../components/profileModal";
import { getCookie } from "../../../utils/cookies";
import toast from "react-hot-toast";

export default function myProfile() {
  const [user, setUser] = useState<UserType | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setAction] = useState<ModalActionType>("edit");
  const [imagesPaths, setImagesPaths] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<string>();
  const [userId, setUserId] = useState<string>("");

  /**
   * Fetch user
   *
   * @returns fetch user
   */
  const fetchUser = async () => {
    try {
      const userId = getCookie("userId");

      if (userId) {
        const userData = await UserService.getUser(userId);

        setUserId(userId);
        setUser(userData);
        return userData;
      } else {
        window.location.href = "/";
        toast.error("You must be logged in to access this page.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  /**
   * Fetchs images
   *
   * @param user to fetch images
   */
  const fetchImages = async (user: UserType) => {
    try {
      if (user) {
        const images = await UploadService.getImage(user.userProfilePicture);
        setImagesPaths(images);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchImages(user);
    }
  }, [user]);

  useEffect(() => {
    if (imagesPaths) {
      setSelectedImage(imagesPaths);
    } else {
      setSelectedImage("/default.png");
    }
  }, [imagesPaths]);

  return (
    <main className="flex h-full bg-gray-200">
      {/* Profile Navbar */}
      <div className="bg-black w-[25%] h-[90%] bg-gray-200 mx-auto p-8">
        <ProfileNavbar />
        <div className="text-center">
          <button
            className="text-white px-3 py-1 rounded-lg text-lg"
            style={{ backgroundColor: "Darkred" }}
          >
            Remove Account
          </button>
        </div>
      </div>

      {/* List of publications */}
      <div className="bg-black w-[80%] h-[90%] bg-gray-200 mx-auto p-4 pb">
        <div className="w-full pr-8 flex flex-row justify-between">
          <h1 className="text-3xl text-black text-bold font-bold text-center my-4">
            My Profile
          </h1>
          <button
            className="bg-gray-700 text-white hover:bg-gray-600 rounded-md py-1 px-2 h-8 my-4"
            onClick={() => onOpen()}
          >
            Edit Profile
          </button>
        </div>
        <div className="bg-gray-100 w-full lg:w-4/5 xl:w-3/4 2xl:w-2/3 mx-auto p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-8">
              <img
                className="w-[250px] h-[250px] object-cover rounded-full border border-gray-400"
                src={`${selectedImage}`}
                alt="User image"
              />
            </div>
            <div className="text-center">
              <div className="mb-8">
                <p className="text-4xl font-bold text-gray-800">
                  {user?.userPersonalName}
                </p>
                <p className="text-lg text-gray-600">@{user?.userUsername}</p>
              </div>
              <div className="flex justify-center items-center gap-8 mb-8">
                {/* Orders Icon */}
                <div className="flex flex-col items-center">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="black"
                      className="w-9 h-9"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                      />
                    </svg>
                  </span>
                  <span className="text-xs text-gray-600">12</span>
                </div>
                {/* Publications Icon */}
                <div className="flex flex-col items-center">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="black"
                      className="w-9 h-9"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                      />
                    </svg>
                  </span>
                  <span className="text-xs text-gray-600">16</span>
                </div>
                {/* Favorites Icon */}
                <div className="flex flex-col items-center">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="black"
                      className="w-9 h-9"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </span>
                  <span className="text-xs text-gray-600">1</span>
                </div>
              </div>
              <div className="mb-8">
                <p className="text-md font-semibold text-gray-800">Email</p>
                <p className="text-sm text-gray-600">{user?.userEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProfileModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        updateTable={UserService.getUser}
        action={action}
        id={userId}
        image={`${selectedImage}`}
      />
    </main>
  );
}
