import { Unavailability } from "./Unavailabilty";

export interface User {
  id: string;
  username: string;
  accessToken: string;
  refresh_token: string;
  role: string;
  unavailability: Unavailability[] | null;
}