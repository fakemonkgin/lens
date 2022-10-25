import { useEffect, useState } from  "react"
import { client, exploreProfiles } from "../api"
import Link from "next/link"

export default function Home() {
   const [profiles, setProfiles] = useState([])
   
   useEffect(() => {
     fetchProfiles()
   }, [])

   async function fetchProfiles() {
     try {
       const response = await client.query(exploreProfiles).toPromise()
       console.log(response)
       const profileData = await Promise.all(response.data.exploreProfiles.items.map(async profile => {
         let picture  = profile.picture
         if (picture && picture.original && picture.original.url) {
           if (picture.original.url.startsWith('ipfs://')) {
             let result = picture.original.url.substring(7, picture.original.url.length)
             profile.picture.original.url = `http://lens.infura-ipfs.io/ipfs/${result}`
           }
         }
         return profile
       }))
      
       setProfiles(profileData)
     } catch (err) {
       console.log( {err} )
     }
   }

   return (
     <div className="pt-20">
       <div className="flex flex-col items-center justify-center ">
        <h1 className="mb-6 text-5xl font-bold">
          Hello, lens
        </h1>
        {
          profiles.map(profile => (
            <div key={profile.id} className="flex flex-col items-center w-2/3 p-6 mb-8 rounded-lg shadow-md">
            <img className="w-48" src={profile?.picture?.original?.url || "https://picsu,.photos/200"} />
            <p className="mt-6 text-xl text-center">{profile.name}</p>
            <p className="mt-2 text-base text-center text-gray-400">{profile.bio}</p>
            <Link href={`/profile/${profile.handle}`}>
              <p> {profile.handle} </p>
            </Link>
          <p>{profile.stats.totalFollowers} followers</p>
            </div>
          ))
        }
       </div>
     </div>
   )
}
