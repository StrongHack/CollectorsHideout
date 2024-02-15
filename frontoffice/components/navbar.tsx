/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import {
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Badge,
  useDisclosure,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";

import { UserService } from "../services/userService";
import { CollectableType, LineType } from "../types";
import { CollectablesService } from "../services/collectablesService";
import Image from "next/image";
import { UploadService } from "../services/uploadService";
import toast from "react-hot-toast";
import { getCookie, setCookie } from "../utils/cookies";
import AuthenticationModal from "./authenticationModal";
import { menuItems } from "../constants/navbar";

export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [cartItems, setCartItems] = useState<LineType[]>([]);
  const [collectableInfo, setCollectableInfo] = useState<CollectableType[]>([]);
  const [imagesPaths, setImagesPaths] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /**
   * Handles click on cart
   */
  const handleCart = async () => {
    if (!getCookie("userId")) {
      return toast.error("You must login to access your cart!");
    }

    await fetchCartItems();

    setIsVisible(!isVisible);
  };

  /**
   * Fetch the cart items for the user
   */
  const fetchCartItems = async () => {
    try {
      const userId = getCookie("userId");

      if (!userId) {
        return toast.error("You must login to access your cart!");
      }

      const cartResponse = await UserService.getCartProducts(userId);
      setCartItems(cartResponse);

      // Fetch details for each collectable in the cart
      const collectablesDetails = await Promise.all(
        cartResponse.map((item: { collectableId: string }) =>
          CollectablesService.getCollectable(item.collectableId)
        )
      );
      setCollectableInfo(collectablesDetails);
    } catch (error) {
      console.error("Error fetching cart items or collectable data:", error);
    }
  };

  /**
   * Logs out user
   */
  const logout = () => {
    setCookie("userId", "");

    setUserEmail("");
    setUserName("");
    setIsLoggedIn(false);

    toast.success("Logged out successfully!");

    // Redirect to the homepage
    window.location.href = "/";
  };

  /**
   * Handles collectable removal
   *
   * @param collectableId of collectable to remove
   * @param userId if of user to remove collectable
   */
  const handleRemoveCollectable = async (collectableId: string) => {
    try {
      const userId = getCookie("userId");

      if (!userId) {
        return "You need to login to access remove collectable from cart!";
      }

      const response = await UserService.removeFromCart(userId, collectableId);
      setCartItems(response.updatedCartItems);

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing collectable from cart:", error);
      toast.error("Error removing collectable from cart");
    }
  };

  useEffect(() => {
    if (getCookie("userId")) {
      setIsLoggedIn(true);
    }

    if (!userName) {
      const user = UserService.getUser(getCookie("userId")!)
        .then((user) => {
          setUserName(user.userUsername);
          setUserEmail(user.userEmail);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (collectableInfo && collectableInfo.length > 0) {
      const imagePaths = collectableInfo.map((collectable) => {
        return collectable.collectableImages.length > 0
          ? collectable.collectableImages[0]
          : "";
      });

      UploadService.getImages(imagePaths).then((images) => {
        setImagesPaths(images);
      });
    } else {
      setImagesPaths(["/default.png"]);
    }
  }, [collectableInfo]);

  return (
    <Navbar className="bg-nav-bg" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand className="rounded-none">
          <Logo />
          <Link href="/" className="font-bold text-white ml-4">
            Collectors Hideout
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link
              color="foreground"
              href={item.href}
              className="md:font-bold text-white"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenu className="">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-black text-2xl text-bold"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      <NavbarContent className="flex justify-end items-center space-x-6">
        <NavbarItem className="flex items-end ml-auto">
          <Link href="#">
            <FontAwesomeIcon icon={faBell} style={{ color: "white" }} />
          </Link>
        </NavbarItem>
        <Dropdown
          placement="bottom-end"
          className="bg-gray-700 border border-white shadow-xl rounded-md"
        >
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name="Jason Hughes"
              size="sm"
              src="/images/usertemplate.png"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions">
            <DropdownItem isDisabled>
              <p className="font-semibold">
                {!isLoggedIn ? "Welcome back" : `Logged in as ${userName}`}
              </p>
              <p
                className={`font-semibold ${isLoggedIn ? "" : "hidden"}`}
              >{`${userEmail}`}</p>
            </DropdownItem>
            <DropdownItem
              color="default"
              href="/users/profile"
              className={`text-white ${isLoggedIn ? "" : "hidden"}`}
            >
              My Profile
            </DropdownItem>
            <DropdownItem
              key="delete"
              color="default"
              onClick={isLoggedIn ? logout : onOpenChange}
            >
              {isLoggedIn ? (
                <span className="text-danger">Log Out</span>
              ) : (
                <span className="text-success">Log In</span>
              )}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
          <div className="dropdown relative">
            <div
              onClick={handleCart}
              className="dropdown-trigger cursor-pointer"
            >
              <FontAwesomeIcon icon={faShoppingBasket} className="text-white" />
            </div>
            {isVisible && (
              <div className="dropdown-menu absolute right-0 bg-gray-700 shadow-xl mt-2 w-96 z-10 border border-white rounded-md overflow-hidden">
                {collectableInfo.length === 0 ? (
                  <div className="dropdown-item p-2 text-white">
                    No items in cart
                  </div>
                ) : (
                  <div>
                    {collectableInfo.map((collectables, index) => (
                      <div
                        key={collectables[".id"]}
                        className="flex justify-between items-center border-b border-gray-100 hover:bg-teal-900"
                      >
                        <Link
                          href={`/collectableDetails/${collectables[".id"]}`}
                        >
                          <Link className="flex items-center p-5 py-3 cursor-pointer text-white hover:text-white w-full">
                            <div className="shrink-0">
                              <Image
                                src={imagesPaths[index] || "/default.png"}
                                alt={collectables.collectableName}
                                width={100}
                                height={100}
                                className="h-24 w-24 rounded-md object-cover object-center"
                              />
                            </div>
                            <div className="flex flex-col flex-grow px-4">
                              <div className="font-bold truncate">
                                {collectables.collectableName.slice(0, 10)}
                              </div>
                              <div className="text-gray-200 truncate">
                                {collectables.collectableDescription.slice(
                                  0,
                                  10
                                )}
                              </div>
                              {cartItems && cartItems[index] && (
                                <div className="text-gray-200">
                                  Qt: {cartItems[index].quantity}
                                </div>
                              )}
                            </div>
                          </Link>
                        </Link>
                        <div className="text-right px-2 font-medium truncate">
                          Price:{" "}
                          {collectables.collectablePrice &&
                          cartItems?.[index]?.quantity
                            ? collectables.collectablePrice *
                              cartItems[index].quantity
                            : 0}
                          €
                        </div>
                        <div
                          onClick={() =>
                            handleRemoveCollectable(collectables[".id"])
                          }
                          className="absolute top-0 right-0 mt-2 mr-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="darkRed"
                            className="w-5 h-5 bg-white rounded-full hover:bg-gray-200 cursor-pointer p-1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end border-t border-gray-100 p-2 pr-3">
                      <div className="text-lg font-bold text-white truncate">
                        Total:{" "}
                        {collectableInfo.reduce((total, item, index) => {
                          return (
                            total +
                            (item.collectablePrice || 0) *
                              (cartItems?.[index]?.quantity || 0)
                          );
                        }, 0)}
                        €
                      </div>
                    </div>
                    <div className="text-center p-4">
                      <Link href="/shoppingCart/page">
                        <button className="text-base bg-teal-700 text-white border border-white hover:bg-teal-700 hover:text-teal-100 px-4 py-2 rounded font-bold cursor-pointer hover:scale-110 transition duration-200 ease-in-out">
                          Show Cart
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </NavbarItem>
      </NavbarContent>
      <AuthenticationModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        onLogin={() => setIsLoggedIn(true)}
      />
    </Navbar>
  );
}
