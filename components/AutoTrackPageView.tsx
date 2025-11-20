"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { TrackEvent } from "@/lib/tracker";

export default function AutoTrackPageView() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      TrackEvent(session.user.id, "page_view",session);
    }
  }, [session]);

  return null;
}
