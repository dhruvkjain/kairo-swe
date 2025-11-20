import CompanyRecruiters from "@/components/CompanyRecruiters";

export default function CompanyDashboard({ params }: { params: { companyId: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Company Dashboard</h1>
      
      {/* Display the recruiters list */}
      <CompanyRecruiters companyId={params.companyId} />
      
    </div>
  );
}