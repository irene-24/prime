import { BOOKING_RULES } from '@/constants/booking.constants';

export const calculateCreditCost = (duration: number): number => {
  return (
    (duration / BOOKING_RULES.BASE_MINUTES) * BOOKING_RULES.CREDITS_PER_UNIT
  );
};
