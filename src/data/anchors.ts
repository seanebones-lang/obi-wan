export type AnchorZone = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  icon: "stadium" | "festival" | "airport" | "downtown" | "neighborhood";
  defaultCategories: string[];
};

export const anchors: AnchorZone[] = [
  {
    id: "stadium",
    nameKey: "anchors.stadium.name",
    descriptionKey: "anchors.stadium.description",
    lat: 32.7473,
    lng: -97.0945,
    radiusMeters: 2500,
    icon: "stadium",
    defaultCategories: ["parking", "restaurant", "bar"],
  },
  {
    id: "fan-festival",
    nameKey: "anchors.fanFestival.name",
    descriptionKey: "anchors.fanFestival.description",
    lat: 32.7767,
    lng: -96.759,
    radiusMeters: 1500,
    icon: "festival",
    defaultCategories: ["restaurant", "bar", "cafe"],
  },
  {
    id: "dfw-airport",
    nameKey: "anchors.dfwAirport.name",
    descriptionKey: "anchors.dfwAirport.description",
    lat: 32.8998,
    lng: -97.0403,
    radiusMeters: 3000,
    icon: "airport",
    defaultCategories: ["restaurant", "lodging"],
  },
  {
    id: "love-field",
    nameKey: "anchors.loveField.name",
    descriptionKey: "anchors.loveField.description",
    lat: 32.8471,
    lng: -96.8518,
    radiusMeters: 2000,
    icon: "airport",
    defaultCategories: ["restaurant", "lodging"],
  },
  {
    id: "downtown-dallas",
    nameKey: "anchors.downtownDallas.name",
    descriptionKey: "anchors.downtownDallas.description",
    lat: 32.7767,
    lng: -96.797,
    radiusMeters: 2000,
    icon: "downtown",
    defaultCategories: ["restaurant", "bar", "lodging"],
  },
  {
    id: "deep-ellum",
    nameKey: "anchors.deepEllum.name",
    descriptionKey: "anchors.deepEllum.description",
    lat: 32.7834,
    lng: -96.7817,
    radiusMeters: 1200,
    icon: "neighborhood",
    defaultCategories: ["bar", "restaurant"],
  },
  {
    id: "uptown",
    nameKey: "anchors.uptown.name",
    descriptionKey: "anchors.uptown.description",
    lat: 32.8024,
    lng: -96.8005,
    radiusMeters: 1500,
    icon: "neighborhood",
    defaultCategories: ["restaurant", "bar"],
  },
  {
    id: "fort-worth-stockyards",
    nameKey: "anchors.stockyards.name",
    descriptionKey: "anchors.stockyards.description",
    lat: 32.7884,
    lng: -97.3473,
    radiusMeters: 1500,
    icon: "neighborhood",
    defaultCategories: ["restaurant", "bar"],
  },
  {
    id: "victory-station",
    nameKey: "anchors.victoryStation.name",
    descriptionKey: "anchors.victoryStation.description",
    lat: 32.7907,
    lng: -96.8104,
    radiusMeters: 1000,
    icon: "downtown",
    defaultCategories: ["restaurant", "bar"],
  },
];

export function getAnchor(id: string): AnchorZone | undefined {
  return anchors.find((a) => a.id === id);
}

export const categoryTypes: Record<
  string,
  { includedTypes: string[]; labelKey: string; icon: string }
> = {
  restaurant: {
    includedTypes: ["restaurant"],
    labelKey: "categories.restaurant",
    icon: "utensils",
  },
  bar: {
    includedTypes: ["bar"],
    labelKey: "categories.bar",
    icon: "beer",
  },
  cafe: {
    includedTypes: ["cafe", "coffee_shop"],
    labelKey: "categories.cafe",
    icon: "coffee",
  },
  parking: {
    includedTypes: ["parking"],
    labelKey: "categories.parking",
    icon: "parking",
  },
  lodging: {
    includedTypes: ["lodging", "hotel"],
    labelKey: "categories.lodging",
    icon: "bed",
  },
  pharmacy: {
    includedTypes: ["pharmacy", "drugstore"],
    labelKey: "categories.pharmacy",
    icon: "pill",
  },
  atm: {
    includedTypes: ["atm"],
    labelKey: "categories.atm",
    icon: "banknote",
  },
  convenience: {
    includedTypes: ["convenience_store", "supermarket"],
    labelKey: "categories.convenience",
    icon: "shopping-bag",
  },
};
