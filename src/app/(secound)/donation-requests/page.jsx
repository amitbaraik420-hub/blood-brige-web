'use client';
import React, { useState, useEffect } from 'react';

export default function BloodCollection() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true); // লোডিং স্টেট

    useEffect(() => {
        fetch('http://localhost:8000/api/v1/blood-collection')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                console.log("ডেটা এসেছে:", data); // ব্রাউজার কনসোলে দেখো
                setRequests(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>লোড হচ্ছে...</p>;

    return (
        <div className="p-10">
            {requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {requests.map((item) => (
                        <div key={item._id} className="border p-4 rounded-xl">
                            <h3 className="font-bold">{item.name}</h3>
                            <p>{item.bloodGroup}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>কোনো ডেটা পাওয়া যায়নি!</p>
            )}
        </div>
    );
}