// pages/search.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SearchPage() {
    const router = useRouter()
    const { query } = router.query
    const [results, setResults] = useState([])

    useEffect(() => {
        if (!query) return

        const fetchSearchResults = async () => {
            const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ja-JP`, {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
                    accept: 'application/json'
                }
            })
            const data = await res.json()
            setResults(data.results)
        }

        fetchSearchResults()
    }, [query])

    return (
        <div className="p-6 bg-black text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">「{query}」の検索結果</h1>
            {results.length === 0 ? (
                <p className="text-gray-400">結果が見つかりませんでした。</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.map(movie => (
                        <Link href={`/movie/${movie.id}`} key={movie.id}>
                            <div className="bg-gray-800 p-2 rounded hover:bg-gray-700 cursor-pointer">
                                {/*<img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="rounded" />*/}
                                <img
                                    src="/noimage.png"
                                    alt="No image"
                                    className="rounded shadow-lg w-full"
                                />
                                <p className="mt-2 font-medium truncate">{movie.title}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
