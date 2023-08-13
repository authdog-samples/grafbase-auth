import { g, auth, config } from '@grafbase/sdk'

const authdog = auth.OpenIDConnect({
  issuer: "https://id.auth.dog",
  groupsClaim: 'groups'
});


g.query("helloWorld", {
  args: {},
  returns: g.string(),
  resolver: "hello-world",
});

export default config({
  schema: g,
  auth: {
    providers: [authdog],
    rules: (rules) => {
      // 75637d51-b57a-46d5-ab78-ac75980aad86 -> admin group
      // 75637d51-b57a-46d5-ab78-ac75980aad87 -> unknwon group
      rules.groups(['75637d51-b57a-46d5-ab78-ac75980aad87']);
    },
  },
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
})
