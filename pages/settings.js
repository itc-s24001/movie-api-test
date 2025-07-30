// pages/settings.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../lib/firebase'
import {
    updatePassword,
    onAuthStateChanged,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth'

export default function SettingsPage() {
    const [user, setUser] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                setEmail(currentUser.email)
            } else {
                router.push('/')
            }
        })
        return () => unsubscribe()
    }, [])

    const handleUpdatePassword = async () => {
        setError('')
        setSuccess('')

        if (!password || !newPassword) {
            setError('現在のパスワードと新しいパスワードを入力してください')
            return
        }

        try {
            const credential = EmailAuthProvider.credential(email, password)
            await reauthenticateWithCredential(user, credential)
            await updatePassword(user, newPassword)
            setPassword('')
            setNewPassword('')
            setSuccess('パスワードを更新しました')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10 bg-gray-800 p-6 rounded shadow text-white">
            <h1 className="text-2xl font-bold mb-4">パスワード変更</h1>

            <div className="mb-4">
                <label className="block mb-1">登録済みメールアドレス</label>
                <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full p-2 rounded bg-gray-700 text-gray-300"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">現在のパスワード（認証用）</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">新しいパスワード</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700"
                />
            </div>

            {error && <p className="text-red-400 mb-2">{error}</p>}
            {success && <p className="text-green-400 mb-2">{success}</p>}

            <button
                onClick={handleUpdatePassword}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
            >
                パスワードを更新する
            </button>
        </div>
    )
}
