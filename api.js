import { createClient } from "urql"

const APIURL = "https://api.lens.dev"

export const client = new createClient({
    url: APIURL
})

export const exploreProfiles = `
query ExploreProfiles {
    exploreProfiles(request: { sortCriteria: MOST_FOLLOWERS }) {
        items {
            id
            name
            bio
            handle
            picture {
              ... on MediaSet {
                original {
                    url
                }
              }
            }
            stats {
              totalFollowers
            }
        }
    }
}
`
