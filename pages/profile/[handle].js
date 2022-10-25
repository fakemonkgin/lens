import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { client, getPublications, getProfile } from "../../api"

export default function Profile() {
    const [profile, setProfile] = useState()
    const [publications, setPublications] = useState([])
    const router = useRouter()
    const { handle } = router.query

    useEffect(() => {
        if(handle) {
            fetchProfile()
        }
    }, [handle])
    
    async function fetchProfile() {
        try {
            const returnedProfile = await client.query(getProfile, { handle }).toPromise();
            const profileData = returnedProfile.data.profile
            const picture = profileData.picture
            if(picture && picture.original && picture.original.url) {
                if(picture.original.url.startsWith("ipfs://")) {
                    let result = picture.original.url.substring(7, picture.original.url.length)
                    profileData.picture.original.url = `http://lens.infura-ipfs.io/ipfs/${result}`
                }
            }
            setProfile(profileData)
            const pubs = await client.query(getPublications, { id: profileData.id, limit: 50 }).toPromise()
            setPublications(pubs.data.publications.items)
        } catch (err) {
            console.log("error fetching", err)
        }
    }
    if (!profile) return null

    return (
        <div className="pt-20">
            <div className="flex flex-col items-center justify-center">
                <img 
                   className="w-64 rounded-full"
                   src={profile.picture?.original?.url}
                />
                <p className="mt-8 mb-8 text-4xl">{profile.handle}</p>
                <p className="w-1/2 mt-2 mb-2 text-xl font-bold text-center">{profile.bio}</p>
                {
                    publications.map(pub => (
                        <div key={pub.id} className="w-2/3 p-10 mb-8 rounded shadow">
                            <p>{pub.metadata.content}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}