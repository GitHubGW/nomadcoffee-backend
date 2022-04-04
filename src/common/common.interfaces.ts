import { User } from ".prisma/client";

export interface CommonResult {
  ok: boolean;
  message: string;
  id?: number;
}

export interface SeeFollowResult {
  ok: boolean;
  message: string;
  users?: User[];
  totalPages?: number;
  totalFollow?: number;
}
