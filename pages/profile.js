"use client";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

const ProfilePage = () => {
    const [groupedComments, setGroupedComments] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState(null);
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                await fetchUserComments(currentUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserComments = async (uid) => {
        const q = query(collection(db, "reviews"), where("uid", "==", uid));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        const movieIds = [...new Set(fetched.map((c) => c.movieId))];
        const movieData = {};

        for (const id of movieIds) {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?language=ja-JP`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
                        },
                    }
                );
                const data = await res.json();
                if (data.title) {
                    movieData[id] = {
                        title: data.title,
                        poster_path: data.poster_path,
                    };
                }
            } catch (err) {
                console.error("映画情報の取得に失敗しました:", id, err);
            }
        }

        const grouped = {};
        fetched.forEach((comment) => {
            if (!movieData[comment.movieId]) return; // 無効な映画データはスキップ
            if (!grouped[comment.movieId]) {
                grouped[comment.movieId] = {
                    movie: movieData[comment.movieId],
                    comments: [],
                };
            }
            grouped[comment.movieId].comments.push(comment);
        });

        setGroupedComments(grouped);
    };

    const handleEditClick = (comment) => {
        setEditingId(comment.id);
        setNewComment(comment.text);
    };

    const handleUpdate = async (id) => {
        await updateDoc(doc(db, "reviews", id), { text: newComment });
        setEditingId(null);
        if (user) await fetchUserComments(user.uid);
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "reviews", id));
        if (user) await fetchUserComments(user.uid);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto text-white">
            <h1 className="text-2xl font-bold mb-6">あなたのコメント一覧</h1>
            {Object.keys(groupedComments).length === 0 ? (
                <p>コメントがありません。</p>
            ) : (
                Object.entries(groupedComments).map(([movieId, group]) => (
                    <div key={movieId} className="mb-8 border-b border-gray-700 pb-4">
                        {group.movie ? (
                            <div className="flex items-center gap-4 mb-2">
                                <Link href={`/movie/${movieId}`}>
                                    <h2 className="text-xl font-semibold hover:underline cursor-pointer">
                                        {group.movie.title}
                                    </h2>
                                </Link>
                                {group.movie.poster_path && (
                                   /* <img
                                        src={`https://image.tmdb.org/t/p/w92${group.movie.poster_path}`}
                                        alt={group.movie.title}
                                        className="w-16 h-auto rounded shadow ml-auto"
                                    />*/
                                    <img
                                    src="/noimage.png"
                                    alt="No image"
                                    className="w-16 h-auto rounded shadow ml-auto"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="text-red-400">映画情報が取得できませんでした</div>
                        )}

                        <div className="space-y-4">
                            {group.comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-gray-800 p-4 rounded shadow flex flex-col gap-2"
                                >
                                    <div className="text-yellow-400 text-lg">
                                        {"⭐".repeat(comment.rating || 0)}
                                    </div>
                                    {editingId === comment.id ? (
                                        <>
                                            <textarea
                                                className="w-full p-2 border rounded bg-black text-white"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(comment.id)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400"
                                                >
                                                    保存
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-400"
                                                >
                                                    キャンセル
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p>{comment.text}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditClick(comment)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
                                                >
                                                    編集
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProfilePage;
