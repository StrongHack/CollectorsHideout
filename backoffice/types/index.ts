/* Sidenav types */
export interface SidenavProps {
  children?: React.ReactNode;
}

/* Search Table types */
export interface SearchBarProps {
  objects: any[]; //Array with all elements
  filteringAttr: string; //Name of attribute to filter elements
  setFilteredObjects: Function; //Function to set filtered elements
}

/** Modal Props */
export type ModalActionType = "show" | "create" | "edit";

export interface ModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  updateTable: Function;
  action: ModalActionType;
  id?: string;
}

/** Auctions types */
export type AuctionStateType = "Accepted" | "Rejected" | "Pending";

export type AuctionType = {
  ".id": string;
  auctionName: string;
  auctionImages: string[];
  auctionProductEstimatedValue: number;
  collectionName: string;
  auctionProductState: string;
  auctionProductEdition: string;
  auctionProductRarity: string;
  auctionDescription: string;
  auctionMinimumBid: number;
  auctionBidIncrement: number;
  auctionHighestBid: number;
  auctionStartDate: Date;
  auctionEndDate: Date;
  auctionState: AuctionStateType;
  userId: string;
  bids: BidType[];
};

// Bids types
export type BidType = {
  bidAmount: number;
  bidTime: Date;
  bidderId: string;
  bidStatus: string;
};

/** Collectables Types */
export enum StatesType {
  New = "New",
  Mint = "Mint",
  Used = "Used",
  Damaged = "Damaged",
  Restored = "Restored",
}

export enum RaritiesType {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  VeryRare = "Very Rare",
  UltraRare = "Ultra Rare",
  OneOfAKind = "One of a Kind",
}

export type CollectableType = {
  ".id": string;
  collectableName: string;
  collectableDescription: string;
  collectablePrice: number;
  collectionId: string;
  collectableState: string;
  collectableEdition: string;
  collectableStock: number;
  collectableRarity: string;
  collectableImages: string[];
};

/**
 * Collection Categories enum
 */
export enum CategoryType {
  Plushies = "Plushies",
  DieCast = "DieCast",
  BuildingSets = "Building Sets",
  ActionFigures = "Action Figures",
  Cards = "Cards",
  Others = "Others",
}

/** Collection Types */
export type CollectionType = {
  ".id": string;
  collectionName: string;
  collectionDescription: string;
  collectionCategory: string;
};

//Publications enum types
export enum PublicationTypes {
  Sale = "Sale",
  Display = "Display",
}

/** Publications states enum */
export enum PublicationsStates {
  Sold = "Sold",
  NotSold = "Not Sold",
}

/** Publication Types */
export type PublicationType = {
  ".id": string;
  title: string;
  images: string[];
  description: string;
  userId: string;
  type: string;
  date: Date;
  editDate: Date;
  price: number;
  state: string;
};

/** Order Types */
export type OrderType = {
  ".id": string;
  lines: string[];
  trackingNumber: number;
  total: number;
  userId: string;
  iva: number;
  status: string;
  orderDate: Date;
  mobileNumber: number;
  nif: number;
  billingAddress: string;
  shippingAddress: string;
};

/** User Types */
export type LineType = {
  collectableId: string;
  quantity: number;
  discount: number;
};

export type UserType = {
  ".id": string;
  userPersonalName: string;
  userUsername: string;
  userEmail: string;
  userPassword: string;
  userProfilePicture: string;
  userAuctionsIds: string[];
  userOrdersIds: string[];
  userCollectablesIds: string[];
  userPublicationsIds: string[];
  cartProducts: LineType[];
};
