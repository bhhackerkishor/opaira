import { redirect } from "next/navigation";

interface PageProps {
  params: {
    username: string;
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { username } = params;
console.log(params,username)

  // Fetch redirect details from API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/redirects/${username}`, {
    cache: "no-store", // always fetch fresh
  }); 


  const data = await res.json();

  const targetUrl = data.GoodOne;
if(targetUrl !='undefined'){
 redirect(targetUrl);
}
  
}
