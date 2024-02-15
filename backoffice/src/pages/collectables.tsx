import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  useDisclosure,
  Link,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { ModalActionType, CollectableType } from "../../types";
import { CollectablesService } from "../../services/collectablesService";
import CollectableModal from "../../components/collectableModal";
import Searchbar from "../../components/searchbar";
import toast from "react-hot-toast";

export default function Collectables() {
  const [collectables, setCollectables] = useState<CollectableType[]>([]);
  const [filteredCollectables, setFilteredCollectables] = useState<CollectableType[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [collectableId, setCollectableId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");

  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Fetches collectables from database
   */
  const fetchCollectables = async () => {
    try {
      const collectables = await CollectablesService.getCollectables();

      setCollectables(collectables);
      setLoading(false);
    } catch (error) {
      setCollectables([]);
      setLoading(true);

      toast.error("Error fetching collectables!");
    }
  };

  /**
   * Opens modal to show collectable
   *
   * @param collectableId of collectable to show
   */
  const handleShow = (collectableId: string) => {
    setAction("show");
    setCollectableId(collectableId);

    onOpen();
  };

  /**
   * Opens modal to create a new collectable
   */
  const handleCreate = () => {
    setAction("create");
    setCollectableId("");

    onOpen();
  };

  /**
   * Opens modal to edit collectable
   *
   * @param collectableId of collectable to edit
   */
  const handleEdit = (collectableId: string) => {
    setAction("edit");
    setCollectableId(collectableId);

    onOpen();
  };

  /**
   * Deletes collectable by id
   *
   * @param collectableId id of the collectable to delete
   */
  const handleDelete = async (collectableId: string) => {
    if (confirm("Are you sure you want to delete this collectable?")) {
      try {
        await CollectablesService.deleteCollectable(collectableId);

        fetchCollectables();
      } catch (error) {
        toast.error("Erro deleting collectable!");
      }
    }
  };

  /**
   * Render Actions
   *
   * Prepares the necessary button triggers for the actions to be executed per collectable, such as
   *  - Deleting an collectable
   *  - Editing an collectable
   *  - Viewing an collectable in detail
   *
   * @param collectableId id of each collectable
   */
  const renderActions = (collectableId: string) => (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details" color="primary">
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <Link href="#">
            <FontAwesomeIcon icon={faEye} style={{ color: "blue" }} onClick={() => handleShow(collectableId)} />
          </Link>
        </span>
      </Tooltip>
      <Tooltip content="Edit user" color="success">
        <span className="text-lg cursor-pointer active:opacity-50">
          <FontAwesomeIcon
            icon={faPencil}
            style={{ color: "green" }}
            onClick={() => handleEdit(collectableId)}
          />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete user">
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50"
          onClick={() => handleDelete(collectableId)}
        >
          <FontAwesomeIcon icon={faTrash} style={{ color: "darkred" }} />
        </span>
      </Tooltip>
    </div>
  );

  /**
   * Fetches collectables to get all collectables
   */
  useEffect(() => {
    if (loading) {
      fetchCollectables();
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!collectables) return <p>No profile data</p>;

  return (
    <>
      <main className="h-screen w-screen bg-white overflow-x-hidden">
        <div className="top-4 left-2 ml-[5%] pt-4 flex items-center">
          <Searchbar
            objects={collectables}
            filteringAttr="collectableName"
            setFilteredObjects={setFilteredCollectables}
          />
          <Tooltip content="Create collectable" color="primary">
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
          <h1 className="pt-8 ml-[5%] font-bold text-2xl">Collectable List</h1>
          <Table
            aria-label="Example table with custom cells"
            className="w-[90%] ml-[5%]"
          >
            <TableHeader>
              <TableColumn className="w-[30%]font-bold text-xl" align="start">
                Name
              </TableColumn>
              <TableColumn className="w-[15%] font-bold text-xl" align="start">
                Edition
              </TableColumn>
              <TableColumn className="w-[15%] font-bold text-xl" align="start">
                State
              </TableColumn>
              <TableColumn className="w-[10%] font-bold text-xl" align="start">
                Stock
              </TableColumn>
              <TableColumn className="w-[10%] font-bold text-xl" align="start">
                Price
              </TableColumn>
              <TableColumn className="w-[5%] font-bold text-xl" align="start">
                Actions
              </TableColumn>
            </TableHeader>
            <TableBody>
              {filteredCollectables.map((collectable) => (
                <TableRow key={collectable[".id"]}>
                  <TableCell className="w-[30%] text-lg" align="center">
                    {collectable.collectableName}
                  </TableCell>
                  <TableCell className="w-[15%] text-lg" align="center">
                    {collectable.collectableEdition}
                  </TableCell>
                  <TableCell className="w-[15%] text-lg" align="center">
                    {collectable.collectableState}
                  </TableCell>
                  <TableCell className="w-[10%] text-lg" align="center">
                    {collectable.collectableStock}
                  </TableCell>
                  <TableCell className="w-[10%] text-lg" align="center">
                    {collectable.collectablePrice} €
                  </TableCell>
                  <TableCell className="w-[5%] text-lg" align="center">
                    {renderActions(collectable[".id"])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <CollectableModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          updateTable={() => fetchCollectables()}
          action={action}
          id={collectableId}
        />
      </main>
    </>
  );
}
