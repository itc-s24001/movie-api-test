// pages/_app.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import '../styles/globals.css'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'

export default function MyApp({ Component, pageProps }) {
    const router = useRouter()
    const isLoginPage = router.pathname === '/'

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            signOut(auth)
        }
    }, [])

    return isLoginPage ? (
        <Component {...pageProps} />
    ) : (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}