export const calculateRefundAmount = (
  scheduledAt: Date,
  creditsUsed: number,
): { amount: number; percentage: number } => {
  const now = new Date();
  const hoursUntilSession =
    (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilSession >= 24) {
    return { amount: creditsUsed, percentage: 100 };
  } else if (hoursUntilSession >= 12) {
    return { amount: creditsUsed * 0.5, percentage: 50 };
  } else {
    return { amount: 0, percentage: 0 };
  }
};
