import StudentTicketView from "@/app/components/StudentTicketView";

const AllTicketsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Ticket Status Board</h1>
      <StudentTicketView />
    </div>
  );
};

export default AllTicketsPage;
