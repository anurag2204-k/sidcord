import { auth,currentUser  } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  const { userId } =await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  });

  if (profile) {
    return profile;
  }

  // Get user details from Clerk
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const name = user.firstName 
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : user.id;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  });

  return newProfile;
};