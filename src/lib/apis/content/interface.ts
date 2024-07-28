export interface IContent {
  advisor: string;
  subject: string;
}
[];

export interface IDelivered {
  id: string;
  advisor: string;
  subject: string;
  is_delivered: true;
  delivered_at: string;
}
