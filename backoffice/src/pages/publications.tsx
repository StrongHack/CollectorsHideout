import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { PublicationsService } from "../../services/publicationsService";
import { ModalActionType, PublicationType } from "../../types";
import Searchbar from "../../components/searchbar";
import PublicationModal from "../../components/publicationModal";
import toast from "react-hot-toast";

export default function Publications() {
  const [publications, setPublications] = useState<PublicationType[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<
    PublicationType[]
  >([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [publicationId, setPublicationId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");

  const [loading, setLoading] = useState<boolean>(true);

  const fetchPublications = async () => {
    try {
      const publications = await PublicationsService.getPublications();

      setPublications(publications);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching categories");

      setPublications([]);
      setLoading(true);
    }
  };

  /**
   * Opens modal to show a publication
   *
   * @param id of publication to edit
   */
  const showPublication = (id: string) => {
    setAction("show");
    setPublicationId(id);

    onOpen();
  };

  /**
   * Opens modal to create a new publication
   */
  const handleCreate = () => {
    setAction("create");
    setPublicationId("");

    onOpen();
  };

  /**
   * Opens modal to edit publication
   *
   * @param id of publication to edit
   */
  const handleEdit = (id: string) => {
    setAction("edit");
    setPublicationId(id);

    onOpen();
  };

  /**
   * Deletes a publication
   *
   * @param id of publication to delete
   */
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      try {
        await PublicationsService.deletePublication(id);

        fetchPublications();
      } catch (error) {
        toast.error("Error deleting publication!");
      }
    }
  };

  /**
   * Renders the actions column in the publications table to view details, edit and delete publications
   */
  const renderActions = (publicationId: string) => (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details" color="primary">
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <FontAwesomeIcon
            icon={faEye}
            style={{ color: "blue" }}
            onClick={() => showPublication(publicationId)}
          />
        </span>
      </Tooltip>
      <Tooltip content="Edit Publication" color="success">
        <span className="text-lg cursor-pointer active:opacity-50">
          <FontAwesomeIcon
            icon={faPencil}
            style={{ color: "green" }}
            onClick={() => handleEdit(publicationId)}
          />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete Publication">
        <span className="text-lg text-danger cursor-pointer active:opacity-50">
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "darkred" }}
            onClick={() => handleDelete(publicationId)}
          />
        </span>
      </Tooltip>
    </div>
  );

  /**
   * Fetches publications to get all publications
   */
  useEffect(() => {
    if (loading) {
      fetchPublications();
    }
  }, []);

  return (
    <main>
      <div className="top-4 left-2 ml-[5%] pt-4 flex items-center">
        <Searchbar
          objects={publications}
          filteringAttr="title"
          setFilteredObjects={setFilteredPublications}
        />
        <Tooltip content="Create proposal" color="primary">
          <svg
            onClick={() => handleCreate()}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Tooltip>
      </div>
      <div className="text-black">
        <h1 className="pt-8 ml-[5%] font-bold text-2xl">Publications List</h1>
        <Table className="w-[90%] ml-[5%]">
          <TableHeader>
            <TableColumn className="w-[20%] font-bold text-xl" align="start">
              Title
            </TableColumn>
            <TableColumn className="w-[20%] font-bold text-xl" align="start">
              Publication Creator
            </TableColumn>
            <TableColumn className="w-[20%] font-bold text-xl" align="start">
              Create Date
            </TableColumn>
            <TableColumn className="w-[5%] font-bold text-xl" align="start">
              Type
            </TableColumn>
            <TableColumn className="w-[5%] font-bold text-xl" align="center">
              Actions
            </TableColumn>
          </TableHeader>
          <TableBody>
            {filteredPublications.map((publication: PublicationType) => (
              <TableRow key={publication[".id"]}>
                <TableCell className="text-lg">{publication.title}</TableCell>
                <TableCell className="text-lg">{publication.userId}</TableCell>
                <TableCell className="text-lg">
                  {
                    new Date(publication.date)
                      .toISOString()
                      .replace("T", " ")
                      .split(".")[0]
                  }
                </TableCell>
                <TableCell className="text-lg">{publication.type}</TableCell>
                <TableCell className="text-lg">
                  {renderActions(publication[".id"])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
