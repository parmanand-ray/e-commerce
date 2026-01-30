import { Button } from "@/components/ui/button";
import { WEBSITE_REGISTER } from "@/routes/websiteRoutes";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Button>
        <Link href={WEBSITE_REGISTER}>Go to Register</Link>
      </Button>
    </div>
  );
}
