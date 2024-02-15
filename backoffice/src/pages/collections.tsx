import { useEffect, useState } from "react";
import { CollectionType, ModalActionType } from "../../types";
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { CollectionsService } from "../../services/collectionsService";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Searchbar from "../../components/searchbar";
import CollectionModal from "../../components/collectionModal";

export default function Collections() {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<
    CollectionType[]
  >([]);
  const [collectionId, setCollectionId] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setAction] = useState<ModalActionType>("create");
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Fetches collections from database
   */
  const fetchCollections = async () => {
    const collections = await CollectionsService.getCollections();

    setCollections(collections);
    setLoading(false);
  };

  /**
   * Opens modal to show collection
   *
   * @param collectionId of collection to show
   */
  const handleShow = (collectionId: string) => {
    setAction("show");
    setCollectionId(collectionId);

    onOpen();
  };

  /**
   * Opens modal to create a new collection
   */
  const handleCreate = () => {
    setAction("create");
    setCollectionId("");

    onOpen();
  };

  /**
   * Opens modal to edit collection
   *
   * @param collectionId of collection to edit
   */
  const handleEdit = (collectionId: string) => {
    setAction("edit");
    setCollectionId(collectionId);

    onOpen();
  };

  /**
   * Deletes collection by id
   *
   * @param collectionId id of the collection to delete
   */
  const handleDelete = async (collectionId: string) => {
    if (confirm("Are you sure you want to delete this collectable?")) {
      await CollectionsService.deleteCollection(collectionId);

      fetchCollections();
    }
  };

  /**
   * Render Actions
   *
   * Prepares the necessary button triggers for the actions to be executed per collection, such as
   *  - Deleting an collection
   *  - Editing an collection
   *  - Viewing an collection in detail
   *
   * @param collectionId id of each collectable
   */
  const renderActions = (collectionId: string) => (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details" color="primary">
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <Link href="#">
            <FontAwesomeIcon
              icon={faEye}
              style={{ color: "blue" }}
              onClick={() => handleShow(collectionId)}
            />
          </Link>
        </span>
      </Tooltip>
      <Tooltip content="Edit user" color="success">
        <span className="text-lg cursor-pointer active:opacity-50">
          <FontAwesomeIcon
            icon={faPencil}
            style={{ color: "green" }}
            onClick={() => handleEdit(collectionId)}
          />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete user">
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50"
          onClick={() => handleDelete(collectionId)}
        >
          <FontAwesomeIcon icon={faTrash} style={{ color: "darkred" }} />
        </span>
      </Tooltip>
    </div>
  );

  /**
   * Fetches collections to get all collections
   */
  useEffect(() => {
    if (loading) {
      fetchCollections();
    }
  }, [loading, collections]);

  if (loading) return <p>Loading...</p>;
  if (!collections) return <p>No profile data</p>;

  return (
    <>
      <main className="h-screen w-screen bg-white overflow-x-hidden">
        <div className="top-4 left-2 ml-[5%] pt-4 flex items-center">
          <Searchbar
            objects={collections}
            filteringAttr="collectionName"
            setFilteredObjects={setFilteredCollections}
          />
          <Tooltip content="Create Collection" color="primary">
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
          <h1 className="pt-8 ml-[5%] font-bold text-2xl">Collection List</h1>
          <Table
            aria-label="Example table with custom cells"
            className="w-[90%] ml-[5%]"
          >
            <TableHeader>
              <TableColumn className="w-[30%]font-bold text-xl" align="start">
                Name
              </TableColumn>
              <TableColumn className="w-[15%] font-bold text-xl" align="start">
                Category
              </TableColumn>
              <TableColumn className="w-[5%] font-bold text-xl" align="start">
                Actions
              </TableColumn>
            </TableHeader>
            <TableBody>
              {filteredCollections.map((collectable) => (
                <TableRow key={collectable[".id"]}>
                  <TableCell className="w-[30%] text-lg" align="center">
                    {collectable.collectionName}
                  </TableCell>
                  <TableCell className="w-[15%] text-lg" align="center">
                    {collectable.collectionCategory}
                  </TableCell>
                  <TableCell className="w-[5%] text-lg" align="center">
                    {renderActions(collectable[".id"])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <CollectionModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          updateTable={() => fetchCollections()}
          action={action}
          id={collectionId}
        />
      </main>
    </>
  );
}