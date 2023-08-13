"use client";
import { useEffect, useState } from "react";
import { useIdentity, useSignin, SignedIn, SignedOut } from "@authdog/react";
import { DashboardButton } from "../components/DashboardButton";
import { SignoutButton } from "../components/SignoutButton";
import { fetchGraphQL } from "../utils/graphql";

export default function Home() {
  const { webLoginUri } = useSignin();
  const { user } = useIdentity();
  const grafbaseEndpoint = "https://grafbase-auth-authdog.grafbase.app/graphql";
  const grafbaseQuery = `{helloWorld}`;
  const [grafbasePayload, setGrafbasePayload] = useState(null);

  useEffect(() => {
    const authorization = sessionStorage.getItem("adog_app.sid");
    console.log(authorization);

    setGrafbasePayload("Loading...");

    Promise.resolve(
      fetchGraphQL({
        endpoint: grafbaseEndpoint,
        query: grafbaseQuery,
        authorization,
      })
    )
      .then((response) => response.json()) // Parse the JSON response
      .then(({ data, errors }: any) => {
        setGrafbasePayload(data);

        if (errors?.length > 0) {
          setGrafbasePayload(errors?.[0]?.message);
        }

      })
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <SignedIn>
        {user && (
          <div className="text-2xl">
            <div style={{ display: "flex", alignItems: "center" }}>
              Welcome {user.displayName}
              &nbsp;
              <img
                src={user?.photos?.length > 0 ? user.photos[0].value : ""}
                width="50"
                height="50"
                style={{ borderRadius: "10px" }}
              />
            </div>
          </div>
        )}
        &nbsp;&nbsp;
        <SignoutButton />
      </SignedIn>

      <SignedOut>
        <div className="text-2xl">Unauthorized</div>
        &nbsp;&nbsp;
        <DashboardButton href={webLoginUri} text="Sign in" />
      </SignedOut>

      <div
        style={{
          background: "black",
          color: "#00FF41",
          margin: "5em",
          width: "70%",
          overflowX: "auto",
        }}
      >
        <code>
          <pre>{JSON.stringify(grafbasePayload, null, 2)}</pre>
        </code>
      </div>
    </div>
  );
}
