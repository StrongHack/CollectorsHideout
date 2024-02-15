/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { ModalActionType, PublicationType } from "../../types";
import { Divider, Link, Tooltip, useDisclosure } from "@nextui-org/react";
import PublicationModal from "../../components/publicationModal";
import { PublicationsService } from "../../services/publicationsService";
import PublicationCard from "../../components/publicationCard";
import ProfileNavbar from "../../components/profileNavbar";
import PublicationsFilter from "../../components/publicationFilter";
import toast from "react-hot-toast";
import { getCookie } from "../../utils/cookies";

export default function Publications() {
  const [publications, setPublications] = useState<PublicationType[]>([]);
  const [types] = useState<string[]>([]);

  const [publicationId, setPublicationId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");
  const [loading, setLoading] = useState<boolean>(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchPublications = async () => {
    try {
      const publications = await PublicationsService.getPublications();

      setPublications(publications);
    } catch (error) {
      setPublications([]);
    }

    setLoading(false);
  };

  /**
   * Opens modal to create a new publication
   */
  const handleCreate = () => {
    const userId = getCookie("userId");

    if (!userId) {
      return toast.error("You must be logged in to create a publication.");
    }

    setAction("create");
    setPublicationId("");

    onOpen();
  };

  useEffect(() => {
    const fetchData = () => {
      if (loading) {
        fetchPublications();
      }
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData(); // Fetch every 600000 milliseconds (10 minutes)
    }, 20000);

    return () => {
      // Cleanup function to clear the interval when the component unmounts
      clearInterval(intervalId);
    };
  }, []); // Include 'loading' in the dependency array if it's used inside the effect

  if (loading) {
    return <div className="min-h-screen bg-white"></div>;
  }

  if (!publications || publications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <img
            src="/images/refresh.png"
            alt="Refresh Icon"
            className="mx-auto mb-"
          />
          <Link href="/" className="text-blue-500 underline block mb-4">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex h-full min-h-screen bg-gray-200">
        {/* Profile Navbar */}
        <div className="bg-black w-[25%] min-w-[350px] h-[90%] bg-gray-200 mx-auto p-4">
          <PublicationsFilter />
        </div>

        {/* List of publications */}
        <div className="bg-black w-[80%] bg-gray-200 mx-auto p-4">
          <div className="bg-black w-full bg-gray-200">
            <div className="w-full pr-8 flex flex-row justify-between">
              <h1 className="text-3xl text-black text-bold font-bold text-center my-1">
                Publications
              </h1>
              <button
                className="bg-gray-700 text-white hover:bg-teal-600 rounded-md py-1 px-2"
                onClick={() => handleCreate()}
              >
                Create Publication
              </button>
            </div>
            <div className="w-full ml-0 mt-2 flex flex-wrap overflow-x-hidden overflow-y-auto justify-start">
              {publications.map((publication: PublicationType) => (
                <div className="mr-3 mt-2">
                  <PublicationCard
                    publication={publication}
                    onChange={fetchPublications}
                    edit={() => {}}
                    updateTable={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <PublicationModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          updateTable={PublicationsService.getPublication}
          action={action}
          id={publicationId}
        />
      </main>
    </>
  );
}
