import { g, auth, config } from "@grafbase/sdk";

const authdog = auth.OpenIDConnect({
  issuer: "https://id.auth.dog",
  groupsClaim: "groups",
});

g.query("helloWorld", {
  args: {},
  returns: g.string(),
  resolver: "hello-world",
});

const authParams = {
  providers: [authdog],
  rules: (rules: any) => {
    // cdab03cd-a442-4564-8c6c-307ce90a2f74 -> Grafbase granted group
    rules.groups(["cdab03cd-a442-4564-8c6c-307ce90a2f74"]);
  },
};

export default config({
  schema: g,
  // @ts-ignore
  auth: authParams,
  cache: {
    rules: [
      {
        types: ["Query"],
        maxAge: 60,
        staleWhileRevalidate: 60,
        scopes: [
          {
            claim: "sub",
          },
        ],
      },
    ],
  },
});
