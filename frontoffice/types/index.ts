import { ReactElement, RefObject } from "react";

/* Sidenav types */
export interface SidenavProps {
  children?: React.ReactNode;
}

/* Search Table Type */
export type SearchContainerType = "table" | "container";

export interface SearchBarProps {
  objects?: any[]; //Array with all elements
  filteringAttr?: string; //Name of attribute to filter elements
  setFilteredObjects?: Function; //Function to set filtered elements
}

/** Modal Props */
export type ModalActionType = "create" | "edit";

export interface ModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  updateTable: Function;
  action: ModalActionType;
  id?: string;
  image?: string;
}

export interface AuthenticationModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onLogin: () => void;
}

/** Auctions types */
export type AuctionStateType = "Accepted" | "Rejected" | "Pending";

export interface AuctionCardProps {
  auction: AuctionType;
}

export const siteConfig = {
  name: "Collectors Hideout",
  description: "Auction and sell your collectables",
  footer: [
    { name: "Home", href: "/" },
    { name: "About", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Shipping & Return Policy", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "FAQ", href: "#" },
  ],
};

/** Auctions types */
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
  auctionHighestBid: number;
  auctionBidIncrement: number;
  auctionStartDate: Date;
  auctionEndDate: Date;
  auctionState: AuctionStateType;
  userId: string;
  bids: BidType[];
};

export type AuctionBidCardProps = {
  auction: AuctionType;
  onChange: Function;
};

/** Collection Types */
export type CollectionType = {
  collectionName: string;
};

/** Proposal Types */
export interface ProposalCardProps {
  proposal: AuctionType;
  onChange: Function;
}

/** Bids types */
export type BidType = {
  bidAmount: number;
  bidTime: Date;
  bidderId: string;
  bidStatus: string;
};

export interface BidLogicProps {
  bids: BidType[] | undefined;
  auction: AuctionType | null;
  updateBid: Function;
}

/** Collectables Types */
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

export interface CollectableCardProps {
  collectable: CollectableType;
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

export interface PublicationCardProps {
  publication: PublicationType;
  onChange: Function;
  edit: Function;
  updateTable: Function;
}

/** Collections Types */
export type OrderType = {
  ".id": string;
  trackingNumber: number;
  userId: string;
  total: number;
  iva: number;
  status: string;
  orderDate: Date;
  mobileNumber: number;
  nif: number;
  billingAddress: string;
  shippingAddress: string;
  lines: LineType[];
};

/** User Types */
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

/** Line Types */
export type LineType = {
  collectableId: string;
  quantity: number;
  discount: number;
};

export type CartItemsProps = {
  cartProducts: LineType[];
  collectables: CollectableType[];
};

export enum BidStatus {
  HighestBid = "Highest Bid",
  WinningBid = "Winning Bid",
  Outbidded = "Outbidded",
}

// Collectable states enum
export enum StatesType {
  New = "New",
  Mint = "Mint",
  Used = "Used",
  Damaged = "Damaged",
  Restored = "Restored",
}

//Publications types
export enum PublicationTypes {
  Sale = "Sale",
  Display = "Display",
}

/** Publications states enum */
export enum PublicationsStates {
  Sold = "Sold",
  NotSold = "Not Sold",
}

//ProfileNavbar types
export type ProfileNavbarRouteType = {
  section: string;
  route: string;
  icon: ReactElement;
};

export type HomePageProps = {
  collectables: CollectableType[];
  auctions: AuctionType[];
};

export type CheckoutProps = {
  lineItems: any[];
};

export type LineCardProps = {
  line: LineType;
};

export type OrderCardProps = {
  order: OrderType;
  onChange: Function;
};
