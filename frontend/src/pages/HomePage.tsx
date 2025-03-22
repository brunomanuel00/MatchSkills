import { useEffect, useState } from "react"
import { AuthResponse } from "../types/authTypes"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
    const [user, setUser] = useState<AuthResponse>()
    const navigate = useNavigate()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedMatchapp')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            console.log(user)
            setUser(user)
        } else {
            navigate('/')
        }
    }, [])
    return (
        <>
            Your home{` ${user?.email}`}
        </>
    )
}
