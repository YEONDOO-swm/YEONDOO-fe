import React from 'react'
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import ReactGA from "react-ga4"

const RouteChangeTracker = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(() => {
        ReactGA.initialize('G-Q44DBL2GVC')
        setInitialized(true)
    }, [])

    useEffect(() => {
        if (initialized) {
            ReactGA.set({ page: location.pathname})
            ReactGA.send("pageview")
        }
    }, [initialized, location])
}

export default RouteChangeTracker