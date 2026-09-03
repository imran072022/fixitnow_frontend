import { redirect } from "next/navigation";

import { getProfile } from "./_data/profile.server";
import { ProfileForm } from "./_components/ProfileForm";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="bg-gray-50">
      <ProfileForm profile={profile} />
    </div>
  );
}
