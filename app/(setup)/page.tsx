import React from "react";
import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import {InitialModal} from "@/components/modals/initial-modal";

const SetupPage = async()=> {
  const profile = await initialProfile();

  if (!profile) {
    return <div>Error: Profile not found</div>;
  }
  //there will always be a profile, because we are creating a profile if it does not exist.
  //it will not exist if the user is not signed in, but we are checking for that above.

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) return redirect(`/servers/${server.id}`);

  return <div> <InitialModal/> </div>
}

export default SetupPage;