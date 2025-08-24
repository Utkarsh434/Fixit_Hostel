import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreateTicketForm from "@/app/components/CreateTicketForm";
import WardenDashboard from "@/app/components/WardenDashboard";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userRole = session.user?.role;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600 mb-8">
        Welcome, {session.user?.name}.
      </p>

      {userRole === 'STUDENT' && <CreateTicketForm />}
      {userRole === 'WARDEN' && <WardenDashboard />}
      {/* We can add a view for TECHNICIAN later */}
    </div>
  );
};

export default DashboardPage;
