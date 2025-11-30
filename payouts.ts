import { MOCK_PAYOUT_WEEKS } from "@/admin/mockData";

export async function getWeeklyPayouts() {
  // Simulate an API fetch delay
  return new Promise<{ weeks: typeof MOCK_PAYOUT_WEEKS }>((resolve) => {
    setTimeout(() => {
      resolve({ weeks: MOCK_PAYOUT_WEEKS });
    }, 200);
  });
}
