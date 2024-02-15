import { CollectableType } from "../types";

/** Collectable rarities enum */
export enum RaritiesType {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  VeryRare = "Very Rare",
  UltraRare = "Ultra Rare",
  OneOfAKind = "One of a Kind",
}

/** Collectable states enum */
export enum StatesType {
  New = "New",
  Mint = "Mint",
  Used = "Used",
  Damaged = "Damaged",
  Restored = "Restored",
}

/** Default Collectable */
export const defaultCollectable: CollectableType = {
  ".id": "",
  collectableName: "",
  collectableDescription: "",
  collectableEdition: "",
  collectablePrice: 0.0,
  collectableRarity: "",
  collectableState: "",
  collectableStock: 0.0,
  collectionId: "",
  collectableImages: [],
};