import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const sidebarRef = useRef(null)
    const [search, setSearch] = useState('')
    const router = useRouter()

    const handleSearch = (e) => {
        e.preventDefault()
        if (!search.trim()) return
        router.push(`/search?query=${encodeURIComponent(search)}`)
        setSidebarOpen(false)
    }

    const handleLogout = async () => {
        await signOut(auth)
        router.push('/login')
    }

    // 外部クリックでメニューを閉じる
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setSidebarOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [sidebarOpen])

    const closeSidebarAndNavigate = (href) => {
        setSidebarOpen(false)
        router.push(href)
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* ヘッダー */}
<<<<<<< HEAD
            <header className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
                <button onClick={() => setSidebarOpen(true)} className="text-white text-2xl mr-4">
                    &#9776;
                </button>

=======
            <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-700 flex items-center justify-between p-4">
                {/* ▼ 左側：三本線メニュー */}
                <button onClick={() => setSidebarOpen(true)} className="text-white text-2xl">
                    &#9776;
                </button>

                {/* ▼ 右側：検索バー */}
>>>>>>> 279dc46 (弾幕コメントとヘッダーを固定)
                <form onSubmit={handleSearch} className="ml-auto">
                    <input
                        type="text"
                        placeholder="タイトル検索 🔍"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 p-2 rounded bg-gray-800 text-white border border-gray-600"
                    />
                </form>
            </header>


            {/* サイドメニュー */}
            <aside
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-64 bg-gray-800 transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out z-40 flex flex-col`}
            >
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-white text-2xl absolute top-4 right-4"
                >
                    ✕
                </button>

                <div className="flex-1 p-6 space-y-4 overflow-y-auto mt-12">
                    <h2 className="text-xl font-bold">メニュー</h2>
                    <button onClick={() => closeSidebarAndNavigate('/')} className="block hover:text-blue-400 text-left w-full">ホーム</button>
                    <button onClick={() => closeSidebarAndNavigate('/admin/reviews')} className="block hover:text-blue-400 text-left w-full">管理者レビュー一覧</button>
                    <button onClick={() => closeSidebarAndNavigate('/profile')} className="block hover:text-blue-400 text-left w-full">マイページ</button>
                    <button onClick={() => closeSidebarAndNavigate('/settings')} className="block hover:text-blue-400 text-left w-full">設定</button>

                    <hr className="border-gray-600" />

                    <h2 className="text-xl font-bold">ジャンル</h2>
                    <ul className="space-y-1 text-sm">
                        {[
                            { name: 'アクション', id: 28 },
                            { name: 'コメディ', id: 35 },
                            { name: 'ドラマ', id: 18 },
                            { name: 'ロマンス', id: 10749 },
                            { name: 'ホラー', id: 27 },
                            { name: 'アニメ', id: 16 },
                            { name: 'ドキュメンタリー', id: 99 },
                        ].map(({ name, id }) => (
                            <li key={id}>
                                <button
                                    onClick={() => closeSidebarAndNavigate(`/?genre=${id}&name=${name}`)}
                                    className="block hover:text-blue-400 text-left w-full"
                                >
                                    {name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <hr className="border-gray-600" />
                    <div className="text-sm text-gray-400">※ フィルターや絞り込み機能は今後追加予定</div>
                </div>

                {/* ログアウト */}
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left text-red-400 hover:text-red-200"
                    >
                        ログアウト
                    </button>
                </div>
            </aside>

            {/* メイン */}
            <main className="pt-[80px] px-4 md:px-6">{children}</main>
        </div>
    )
}
