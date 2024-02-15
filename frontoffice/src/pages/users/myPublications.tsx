/* eslint-disable react-hooks/rules-of-hooks */

import { ModalActionType, PublicationType } from "../../../types";
import MyPublicationCard from "../../../components/myPublicationCard";
import { useEffect, useState } from "react";
import ProfileNavbar from "../../../components/profileNavbar";
import { useDisclosure } from "@nextui-org/react";
import PublicationModal from "../../../components/publicationModal";
import { PublicationsService } from "../../../services/publicationsService";
import { getCookie } from "../../../utils/cookies";
import toast from "react-hot-toast";

export default function myPublications() {
  const [publications, setPublications] = useState<PublicationType[]>([]);
  const [publicationId, setPublicationId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /**
   * Fetches publications
   */
  const fetchPublications = async () => {
    try {
      const userId = getCookie("userId");

      const publications = await PublicationsService.getPublications();

      const filteredPublications = publications.filter(
        (publication) => publication.userId === userId
      );

      setPublications(filteredPublications);
    } catch (error) {
      console.error(error);

      setPublications([]);
    }
  };

  /**
   * Opens modal to create a new publication
   */
  const handleCreate = () => {
    const userId = getCookie("userId");

    if (!userId) {
      window.location.href = "/";
      toast.error("You must be logged in to access this page.");
    }

    setAction("create");
    setPublicationId("");

    onOpen();
  };

  const handleEdit = async (id: string) => {
    try {
      setAction("edit");
      setPublicationId(id);
      onOpen();
      console.log(id);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching publication for editing!");
    }
  };

  useEffect(() => {
    const userId = getCookie("userId");

    if (!userId) {
      window.location.href = "/";
      toast.error("You must be logged in to access this page.");
    }

    fetchPublications();
  }, []);

  return (
    <main className="flex h-full min-h-screen bg-gray-200">
      {/* Profile Navbar */}
      <div className="bg-black w-[25%] h-[90%] bg-gray-200 mx-auto p-4">
        <ProfileNavbar />
      </div>

      {/* List of publications */}
      <div className="bg-black w-[80%] bg-gray-200 mx-auto p-4">
        <div className="w-full pr-8 flex flex-row justify-between">
          <h1 className="text-3xl text-black text-bold font-bold text-center my-1">
            My Publications
          </h1>
          <button
            className="bg-gray-700 text-white hover:bg-gray-600 rounded-md py-1 px-2"
            onClick={() => handleCreate()}
          >
            Create Publication
          </button>
        </div>
        <div className="flex flex-wrap justify-start pl-4">
          {publications.map((publication) => (
            <div
              key={publication[".id"]}
              className=" bg-gray-200 p-4 mb-4 mr-4"
            >
              <div className="mx-auto">
                <MyPublicationCard
                  onChange={fetchPublications}
                  publication={publication}
                  edit={handleEdit}
                  updateTable={fetchPublications}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <PublicationModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        updateTable={fetchPublications}
        action={action}
        id={publicationId}
      />
    </main>
  );
}
