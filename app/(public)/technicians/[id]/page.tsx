import TechnicianProfilePage from "../../_components/_TechnicianProfile/TechnicianProfile";
import { getTechnicianProfile } from "../../_data/technicians";

interface TechnicianProfileRouteProps {
  params: Promise<{ id: string }>;
}

const TechnicianProfileRoute = async ({
  params,
}: TechnicianProfileRouteProps) => {
  const { id } = await params;
  const response = await getTechnicianProfile(id);

  return <TechnicianProfilePage profile={response.data} />;
};

export default TechnicianProfileRoute;
