import { PublicationType, PublicationsStates, StatesType } from "../types";

const start = new Date(2000, 0, 1); // Start date (e.g., January 1, 2000)
const end = new Date(); // End date (current date)

export const defaultPublication: PublicationType = {
  ".id": "",
  title: "",
  images: [],
  description: "",
  userId: "",
  type: "",
  date: new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ),
  editDate: new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ),
  price: 0,
  state: PublicationsStates.NotSold,
};
