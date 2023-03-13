export interface Funding {
  id: string;
  starter: string;
  brand: string;
  total_price: number;
  cur_price: number;
  deadline: Date;
  min_member: number;
  cur_member: number;
  status: number;
  created_At?: Date;
  updated_At?: Date;
}

// export enum FundingStatus {
//   PUBLIC = 'PUBLIC',
//   PRIVATE = 'PRIVATE',
// }
