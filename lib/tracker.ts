import { useSession } from "next-auth/react";
export async function trackEvent(eventName: string, data: any = {}) {
    const {data:session} = useSession();
    const userId = session?.user?.id;
    
    console.log()
  
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        eventName,
        page: window.location.pathname,
        data: {
            ...data,
            name: session?.user?.name,
            email: session?.user?.email,
          }
      }),
    });
  }
  