import { random, range, uniqueId } from 'lodash';

export const SupportedRegions = ['FL', 'WA', 'DC'];

export enum PaymentStatus {
  UNDER_REVIEW,
  PAID,
  VOID,
}

export const PaymentStatusDisplays: Record<PaymentStatus, string> = {
  [PaymentStatus.UNDER_REVIEW]: 'Under Review',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.VOID]: 'Void',
};

export const PaymentStatusValues = Object.keys(PaymentStatusDisplays).map(
  Number
) as PaymentStatus[];

export interface Deal {
  id: string;
  address: string;
  closePrice: number;
  paymentStatus: PaymentStatus;
}

export interface GetDealListRequest {
  region: string;
}

export interface GetDealListResponse {
  list: Deal[];
  totalCount: number;
}

export async function getDealList(request: GetDealListRequest): Promise<GetDealListResponse> {
  await new Promise((resolve) => setTimeout(resolve, random(500, 1500)));
  return {
    list: range(20).map((i) => ({
      id: uniqueId(),
      address: `${random(1, 100)} ${random(3, 9)}th St, ${request.region}`,
      closePrice: random(10000, 50000),
      paymentStatus: PaymentStatusValues[random(0, PaymentStatusValues.length - 1)],
    })),
    totalCount: random(20, 100),
  };
}
