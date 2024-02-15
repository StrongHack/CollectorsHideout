import Image from "next/image";
import { useEffect, useState } from "react";
import { ModalActionType, UserType } from "../../types";
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
import { UserService } from "../../services/usersService";
import toast from "react-hot-toast";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Searchbar from "../../components/searchbar";
import UserModal from "../../components/userModal";

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userId, setUserId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("show");

  const [loading, setLoading] = useState<boolean>(true);

  /**
   * fetches users
   */
  const fetchUsers = async () => {
    try {
      const users = await UserService.getUsers();

      setUsers(users);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching users");

      setUsers([]);
      setLoading(true);
    }
  };

  /**
   * Opens modal to edit user
   *
   * @param id of user to edit
   */
  const handleEdit = (id: string) => {
    setAction("edit");
    setUserId(id);

    onOpen();
  };

  /**
   * Opens modal to show a user
   *
   * @param id of user to show
   */
  const showUser = (id: string) => {
    setAction("show");
    setUserId(id);

    onOpen();
  };

  /**
   * Remove user
   *
   * @param id of user to remove
   */
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      try {
        await UserService.deleteUser(id);

        fetchUsers();
      } catch (error) {
        toast.error("Error removing user!");
      }
    }
  };

  /**
   * Renders the actions column in the users table to view details, edit and remove users
   */
  const renderActions = (userId: string) => (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details" color="primary">
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <FontAwesomeIcon
            icon={faEye}
            style={{ color: "blue" }}
            onClick={() => showUser(userId)}
          />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Remove User">
        <span className="pl-2 text-lg text-danger cursor-pointer active:opacity-50">
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "darkred" }}
            onClick={() => handleDelete(userId)}
          />
        </span>
      </Tooltip>
    </div>
  );

  useEffect(() => {
    if (loading) {
      fetchUsers();
    }
  }, []);

  return (
    <main>
      <div className="top-4 left-2 ml-[5%] pt-4 flex items-center">
        <Searchbar
          objects={users}
          filteringAttr="userPersonalName"
          setFilteredObjects={setFilteredUsers}
        />
      </div>
      <div className="text-black">
        <h1 className="pt-8 ml-[5%] font-bold text-2xl">Users List</h1>
        <Table className="w-[90%] ml-[5%]">
          <TableHeader>
            <TableColumn className="w-[20%] font-bold text-xl" align="start">
              Personal Name
            </TableColumn>
            <TableColumn className="w-[20%] font-bold text-xl" align="start">
              Username
            </TableColumn>
            <TableColumn className="w-[20%] font-bold text-xl" align="start">
              User Email
            </TableColumn>
            <TableColumn className="w-[5%] font-bold text-xl" align="center">
              Actions
            </TableColumn>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user: UserType) => (
              <TableRow key={user[".id"]}>
                <TableCell className="text-lg">
                  {user.userPersonalName}
                </TableCell>
                <TableCell className="text-lg">{user.userUsername}</TableCell>
                <TableCell className="text-lg">{user.userEmail}</TableCell>
                <TableCell className="text-lg">
                  {renderActions(user[".id"])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UserModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        updateTable={fetchUsers}
        action={action}
        id={userId}
      />
    </main>
  );
}
