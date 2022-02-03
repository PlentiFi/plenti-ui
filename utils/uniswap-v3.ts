import { ApolloClient, InMemoryCache, gql  } from '@apollo/client';

// NOTE: This supports only mainnet uniswap data fetching
export const graphClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-subgraph",
  // fetchOptions: {
  //   mode: 'no-cors'
  // },
  cache: new InMemoryCache(),
});


export async function getUniswapV3PoolOverview(poolAddress) {
  console.log()
  try {
    const { data } = await graphClient.query({
      query: gql`
      {
        pool(id: "${poolAddress.toLowerCase()}"){
          id
          createdAtTimestamp
          feeTier
          liquidity
          sqrtPrice
          token0Price
          token1Price
          tick
          volumeToken0
          volumeToken1
          volumeUSD
          totalValueLockedToken0
          totalValueLockedToken1
          totalValueLockedETH
          totalValueLockedUSD
          token0 {
              id
              name
              symbol
              decimals
              derivedETH
          }   
          token1 {
              id
              name
              symbol
              decimals
              derivedETH
          }
        }
        bundle(id: "1") {
          ethPriceUSD
        }
      }`,
    });

    return data;
  } catch (err) {
  }
}
