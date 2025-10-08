'use client';
import axios from 'axios';
import React, { useState, useMemo, useEffect, useCallback } from 'react';

const ChevronDownIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

export default function AdminEmailIndividual({ onBack, currentUserEmail, otherPartyEmail, initialSubject }) {
    const [thread, setThread] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState(-1);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Admin-specific email fetching function
    const fetchAndSetThread = useCallback(async () => {
        if (!currentUserEmail || !otherPartyEmail) return;
        setIsLoading(true);
        try {
            // Use admin-specific API endpoint
            const res = await axios.post('https://n8nnode.bestworks.cloud/webhook/email-log-fetch-admin', { 
                emailAdmin: 'team@showmecustomapparel.com' 
            });
            const allEmails = res.data || [];

            const conversationEmails = allEmails
                .filter(item =>
                    (item["Sender Email"] === currentUserEmail && item["Recipient Email"] === otherPartyEmail) ||
                    (item["Sender Email"] === otherPartyEmail && item["Recipient Email"] === currentUserEmail)
                )
                .map(item => ({ // Format the data
                    id: item.id,
                    subject: item["Email Subject"],
                    body: item["Email Body"],
                    date: item["Sent Date"],
                    from: item["Sender Email"],
                    to: item["Recipient Email"],
                    status: item["Status"]?.toUpperCase() || "RECEIVED"
                }));

            setThread(conversationEmails);
        } catch (error) {
            console.error("Failed to fetch admin conversation thread:", error);
            alert("Could not load the admin email conversation. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [currentUserEmail, otherPartyEmail]);

    // Fetch data on initial load
    useEffect(() => {
        fetchAndSetThread();
    }, [fetchAndSetThread]);
    
    // Sort the fetched thread chronologically (oldest to newest)
    const chronologicalThread = useMemo(() => {
        return [...thread].sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [thread]);

    // Auto-open the newest email once data is loaded/updated
    useEffect(() => {
        if (chronologicalThread.length > 0) {
            setOpenIndex(chronologicalThread.length - 1);
        }
    }, [chronologicalThread]);

    const handleSendReply = () => {
        if (!replyText.trim() || isSending) return;
        setIsSending(true);

        const latestEmail = chronologicalThread[chronologicalThread.length - 1];
        const subject = latestEmail.subject.startsWith("Re: ") ? latestEmail.subject : `Re: ${latestEmail.subject}`;

        const payload = {
            replyBody: replyText,
            reciepent: otherPartyEmail,
            sender: currentUserEmail,
            subject: subject,
        };

        axios.post('https://n8nnode.bestworks.cloud/webhook/email-sender', payload)
            .then(res => {
                if (res.status === 200) {
                    setReplyText('');
                    // Simply re-fetch its own data to get the latest update
                    fetchAndSetThread();
                } else {
                    alert('Failed to send reply. Please try again.');
                }
            })
            .catch(err => {
                console.error("Admin reply error:", err);
                alert('An error occurred while sending your reply.');
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    Back to Admin Mailbox
                </button>
                <h2 className="text-xl font-bold text-gray-800">{thread[0]?.subject || initialSubject}</h2>
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading admin conversation...</div>
            ) : (
                <div className="space-y-3">
                    {chronologicalThread.map((email, index) => (
                        <div key={email.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => setOpenIndex(openIndex === index ? -1 : index)} className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" alt="avatar" className="w-8 h-8 rounded-full" />
                                    <div><p className="font-semibold">{email.from}</p><p className="text-xs text-gray-500">to {email.to}</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">{new Date(email.date).toLocaleDateString()}</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${email.status === 'SENT' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{email.status}</span>
                                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            {openIndex === index && (<div className="p-4 border-t border-gray-200 text-gray-700 bg-white"><p style={{ whiteSpace: 'pre-wrap' }}>{email.body}</p></div>)}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Reply</h3>
                <div className="border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
                    <textarea className="w-full p-3 border-0 focus:ring-0 resize-none rounded-lg" rows="4" placeholder="Type your reply here..." value={replyText} onChange={(e) => setReplyText(e.target.value)}></textarea>
                </div>
                <div className="mt-3 flex justify-end">
                    <button onClick={handleSendReply} className="px-6 py-2 bg-[#f20c32] text-white font-semibold rounded-lg hover:bg-[#f54461] disabled:bg-[#f20c32be] disabled:cursor-not-allowed transition-colors" disabled={!replyText.trim() || isSending}>
                        {isSending ? 'Sending...' : 'Send Reply'}
                    </button>
                </div>
            </div>
        </div>
    );
}
