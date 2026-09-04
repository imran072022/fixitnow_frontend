"use client";

import { TechnicianProfile } from "../../_types/technicians";
import { TechnicianProfileHeader } from "./TechnicianProfileHeader";
import { TechnicianServices } from "./TechnicianServices";
import { TechnicianReviews } from "./TechnicianReviews";
import { TechnicianAvailability } from "./TechnicianAvailability";

type TechnicianProfilePageProps = {
  profile: TechnicianProfile;
};

export function TechnicianProfilePage({ profile }: TechnicianProfilePageProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <TechnicianProfileHeader profile={profile} />

        {/* Two-column layout: Main content + sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - Services and Reviews */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Services Section */}
            <TechnicianServices services={profile.services} />
            {/* Reviews Section */}
            <TechnicianReviews bookings={profile.bookings} />
          </div>

          {/* Right column - Availability sidebar */}
          <div className="lg:col-span-1">
            <TechnicianAvailability slots={profile.availabilitySlots} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnicianProfilePage;
