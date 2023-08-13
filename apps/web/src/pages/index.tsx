import { useEffect } from "react";
import { persistTokenFromUri } from "@authdog/browser";

import { useSignin } from "@authdog/react";
import { DashboardButton } from "../components/DashboardButton";

export default function Home() {
  useEffect(() => {
    persistTokenFromUri();
  }, []);

  const { webLoginUri } = useSignin();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <DashboardButton href={webLoginUri} text="Access Dashboard" />
    </div>
  );
}
