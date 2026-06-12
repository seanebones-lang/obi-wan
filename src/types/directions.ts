export type DirectionStep = {
  instruction: string;
  distance: string;
  duration: string;
  travelMode: string;
};

export type DirectionLeg = {
  distance: string;
  duration: string;
  steps: DirectionStep[];
  departureTime?: string;
  arrivalTime?: string;
};

export type DirectionsResult = {
  summary: string;
  legs: DirectionLeg[];
  googleMapsUrl: string;
};
