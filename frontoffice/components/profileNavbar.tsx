import Link from "next/link";
import { profileNavbarRoute } from "../constants/profileNavbar";
import { ProfileNavbarRouteType, UserType } from "../types";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookies";
import { UserService } from "../services/userService";

export default function ProfileNavbar() {
    const [username, setUsername] = useState("Username");

    useEffect(() => {
        const fetchUsername = () => {
            try {
                const userId = getCookie("userId");

                if (userId) {
                    UserService.getUser(userId).then((user) => {
                        setUsername(user.userUsername)
                    })
                } else {
                    setUsername("Username");
                }
            } catch (err) {
                setUsername(username);
            }
        }

        fetchUsername();
    })

    return (
        <div className="w-[100%] mx-auto h-[90%] bg-white text-black m-4 border-1 border-gray-200 rounded-lg px-4 py-2 flex flex-col">
            {/** Categories filter */}
            <label className="block my-2 mx-2 text-3xl font-bold flex flex-col">Hi {username}</label>
            {profileNavbarRoute.map((route: ProfileNavbarRouteType) => (
                <div key={route.section} className="mt-2 w-full">
                    <div id={route.section} className="flex flex-col my-1 w-full">
                        <Link href={route.route} className="flex space-x-1">
                            <div className="w-[85%] flex items-center">
                                <span className="text-lg justify-start">{route.icon}</span>
                                <span className="ml-2 text-3xl font-bold hover:text-orange-600">{route.section}</span>
                            </div>
                            <div className="w-[15%]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 justify-end">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                    <Divider className="bg-black mt-2 mb-2 opacity-[70%] w-full h-0.5 rounded-3xl" />
                </div>
            ))}

        </div>
    );
}
