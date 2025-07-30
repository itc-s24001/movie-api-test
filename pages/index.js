import { useState } from 'react'
import { useRouter } from 'next/router'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password)
            } else {
                await createUserWithEmailAndPassword(auth, email, password)
            }
            router.push('/home')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
            {/* ▼ ロゴ画像 */}
            <img
                src="/logo.png"
                alt="Web Cinema Logo"
                className="w-80 h-80 mb-6"
            />

            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded shadow-md space-y-4 w-80">
                <h2 className="text-2xl font-bold mb-4">{isLogin ? 'ログイン' : '新規登録'}</h2>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded bg-black border border-gray-600 text-white"
                    required
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded bg-black border border-gray-600 text-white"
                    required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
                    {isLogin ? 'ログイン' : '新規登録'}
                </button>
                <p
                    className="text-sm text-center text-blue-400 cursor-pointer"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'アカウントを作成する' : 'ログインはこちら'}
                </p>
            </form>
        </div>
    )
}