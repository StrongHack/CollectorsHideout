import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Link, useDisclosure } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { OrderType, ModalActionType } from '../../types';
import { OrdersService } from '../../services/ordersService';
import Searchbar from '../../components/searchbar';
import toast from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [orderId, setOrderId] = useState<string>("");
  const [action, setAction] = useState<ModalActionType>("create");

  const [loading, setLoading] = useState<boolean>(true);

  /**
  * Fetches orders from database
  */
  const fetchOrders = async () => {
    try {
      const orders = await OrdersService.getOrders();

      setOrders(orders);
      setLoading(false);
    } catch (error) {
      setOrders([]);
      setLoading(true);

      toast.error("Error fetching orders");
    }
  }

  /**
   * Opens modal to edit order
   * 
   * @param id of order to edit
   */
  const handleEdit = (id: string) => {
    setAction("edit");
    setOrderId(id);

    onOpen();
  }

  /**
  * Deletes order by id
  *
  * @param orderId id of the order to delete
  */
  const handleDelete = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await OrdersService.deleteOrder(orderId);

        await fetchOrders();
      } catch (error) {
        toast.error("Error deleting order");
      }
    }
  };

  /**
   * Render Actions
   * 
   * Prepares the necessary button triggers for the actions to be executed per order, such as
   *  - Deleting an order
   *  - Editing an order
   *  - Viewing an order in detail
   * 
   * @param orderId id of each order 
   */
  const renderActions = (orderId: string) => (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Details" color='primary'>
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <Link href="#">
            <FontAwesomeIcon icon={faEye} style={{ color: 'blue' }} />
          </Link>
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete order">
        <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(orderId)}>
          <FontAwesomeIcon icon={faTrash} style={{ color: 'darkred' }} />
        </span>
      </Tooltip>
    </div>
  );

  useEffect(() => {
    if (loading) {
      fetchOrders();
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!orders) return <p>No profile data</p>;

  return (
    <main className="h-screen w-screen bg-white overflow-x-hidden">
      <div className="top-4 left-2 ml-[5%] pt-4 flex items-center">
        <Searchbar objects={orders} filteringAttr='trackingNumber' setFilteredObjects={setFilteredOrders} />
      </div>
      <div className='text-black'>
        <h1 className="pt-4 pb-2 ml-[5%] font-bold text-2xl">Orders List</h1>
        <Table aria-label="Order table" className='w-[90%] ml-[5%]'>
          <TableHeader>
            <TableColumn className='w-[5%] font-bold text-xl' align="start">TrackNum</TableColumn>
            <TableColumn className='w-[10%] font-bold text-xl' align="start">User Id</TableColumn>
            <TableColumn className='w-[10%] font-bold text-xl' align="start">Status</TableColumn>
            <TableColumn className='w-[20%] font-bold text-xl' align="start">Order Date</TableColumn>
            <TableColumn className='w-[10%] font-bold text-xl' align="start">Mobile Number</TableColumn>
            <TableColumn className='w-[5%] font-bold text-xl' align="center">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order: OrderType) => (
              <TableRow key={order['.id']}>
                <TableCell className="text-lg">{order.trackingNumber}</TableCell>
                <TableCell className="text-lg">{order.userId}</TableCell>
                <TableCell className="text-lg">{order.status}</TableCell>
                <TableCell className="text-lg">{order.orderDate.toString().replace("T", " ").split("Z")}</TableCell>
                <TableCell className="text-lg">{order.mobileNumber}</TableCell>
                <TableCell className="text-lg">{renderActions(order['.id'])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main >
  )
}

