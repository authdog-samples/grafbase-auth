interface ISendGraphQLQuery {
  endpoint: string;
  query: string;
  authorization: string;
}

export const fetchGraphQL = async ({
  endpoint,
  query,
  authorization,
}: ISendGraphQLQuery) => {
  return await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorization}`,
    },
    body: JSON.stringify({ query }),
  });
};
