export async function TrackEvent(
  userId: string,
  eventName: string,
  data: any = {}
) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventName,
        page: window.location.pathname,
        data,
      }),
    });
  } catch (err) {
    console.error("Tracking error", err);
  }
}
