import DashboardCalendar from "@/app/components/dashboard/DashboardCalendar";
import UpcomingDeadlines from "@/app/components/dashboard/UpcomingDeadlines";

type Deadline = {
  name: string;
  company: string;
  time: string;
  avatar: string;
};

export default function DashboardRightSidebar({
  deadlines,
}: {
  deadlines: Deadline[];
}) {
  return (
    <aside className="space-y-6">
      <DashboardCalendar />
      <UpcomingDeadlines deadlines={deadlines} />
    </aside>
  );
}
