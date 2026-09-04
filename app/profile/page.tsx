import { redirect } from "next/navigation";

import { getProfile } from "./_data/profile.server";
import { ProfileForm } from "./_components/ProfileForm";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto ">
      <ProfileForm profile={profile} />
    </div>
  );
}
