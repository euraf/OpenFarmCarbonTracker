import { Navigate } from "@solidjs/router";
import { NavigationMenu, NavigationMenuTrigger } from "~/components/ui/navigation-menu";

export default function Home() {
  
  return (
    <Navigate href={"/fields"} />
  );
}
