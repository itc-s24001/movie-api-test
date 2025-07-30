// pages/admin/reviews.js
import { useEffect, useState } from 'react'
import { db, auth } from '../../lib/firebase'
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function AdminReviews() {
    const [reviews, setReviews] = useState([])
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push('/')
                return
            }

            setUser(currentUser)

            // Firestore から管理者かどうか判定
            const userDoc = await getDocs(
                query(collection(db, "users"))
            )

            const matchedDoc = userDoc.docs.find(doc => doc.id === currentUser.uid)
            if (matchedDoc && matchedDoc.data().admin === true) {
                setIsAdmin(true)
                fetchReviews()
            } else {
                alert('管理者専用ページです')
                router.push('/')
            }
        })

        return () => unsubscribe()
    }, [])

    const fetchReviews = async () => {
        const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"))
        const snapshot = await getDocs(q)
        const fetched = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        setReviews(fetched)
    }

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "reviews", id))
        fetchReviews()
    }

    if (!isAdmin) return <div className="text-white p-6">読み込み中...</div>

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-3xl font-bold mb-6">管理者用レビュー一覧</h1>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-800 p-4 rounded shadow relative">
                        <div className="text-yellow-400 text-lg mb-1">{'⭐'.repeat(review.rating)}</div>
                        <p className="text-white">{review.text}</p>
                        <p className="text-sm text-gray-400">ユーザーID: {review.uid}</p>
                        <button
                            onClick={() => handleDelete(review.id)}
                            className="absolute top-2 right-2 text-sm text-red-400 hover:text-red-200"
                        >
                            削除
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
