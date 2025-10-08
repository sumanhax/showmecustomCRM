import React, { useState, useMemo, useEffect, useCallback } from "react";
import AdminEmailIndividual from './AdminEmailIndividual';
import axios from "axios";

// Modal Component for sending new emails
const NewEmailModal = ({ isOpen, onClose, currentUserEmail, onEmailSent }) => {
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    if (!isOpen) return null;
    
    const handleSendEmail = () => {
        if (!recipient.trim() || !subject.trim() || !body.trim()) {
            alert('Please fill in all fields.');
            return;
        }
        setIsSending(true);
        const payload = {
            reciepent: recipient,
            sender: currentUserEmail,
            subject: subject,
            replyBody: body,
        };
        axios.post('https://n8nnode.bestworks.cloud/webhook/email-sender', payload)
            .then(res => {
                if (res.status === 200) {
                    alert('Email Sent Successfully!');
                    onEmailSent(); 
                    onClose(); 
                    setRecipient(''); 
                    setSubject(''); 
                    setBody('');
                } else { 
                    alert('Failed to send email. Please try again.'); 
                }
            })
            .catch(err => { 
                console.error("Error sending email:", err); 
                alert('An error occurred while sending the email.'); 
            })
            .finally(() => { 
                setIsSending(false); 
            });
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Send New Email</h2>
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Recipient Email" 
                        value={recipient} 
                        onChange={(e) => setRecipient(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                    <input 
                        type="text" 
                        placeholder="Subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                    <textarea 
                        rows="5" 
                        placeholder="Email body..." 
                        value={body} 
                        onChange={(e) => setBody(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                    />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSendEmail} 
                        disabled={isSending} 
                        className="px-4 py-2 bg-[#f20c32] text-white font-semibold rounded-lg hover:bg-[#f9546f] disabled:bg-[#a9243a]"
                    >
                        {isSending ? 'Sending...' : 'Send Email'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function AdminMailbox() {
    // State management
    const [selectedContact, setSelectedContact] = useState(null);
    const [emailData, setEmailData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState();
    const [isLoading, setIsLoading] = useState(true);

    // Get admin email from localStorage
    // useEffect(() => {
    //     const userEmail = localStorage.getItem('user_email');
    //     console.log("Setting admin email from localStorage:", userEmail);
    //     setEmail(userEmail);
    // }, []);
    const emailAdmin='team@showmecustomapparel.com'

    // Fetch all emails for admin view
    const fetchEmails = useCallback(() => {
        if (!emailAdmin) {
            console.log("No email found, skipping fetch");
            setIsLoading(false);
            return;
        }
        
         console.log("Fetching admin emails for:", emailAdmin);
         setIsLoading(true);
         axios.post('https://n8nnode.bestworks.cloud/webhook/email-log-fetch-admin', { emailAdmin })
            .then((res) => { 
                console.log("Admin emails fetched successfully:", res.data);
                setEmailData(res.data || []); 
            })
            .catch((err) => { 
                console.error("Error fetching admin emails:", err); 
                setEmailData([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
     }, [emailAdmin]);

    useEffect(() => { 
        if (emailAdmin) {
            fetchEmails(); 
        }
    }, [fetchEmails, emailAdmin]);

    // Process email threads for admin view
    const emailThreads = useMemo(() => {
        const threads = {};
        emailData?.forEach(item => {
            if (!item || !item["Sender Email"] || !item["Recipient Email"]) return;
            const formattedEmail = {
                id: item.id, 
                subject: item["Email Subject"], 
                body: item["Email Body"], 
                date: item["Sent Date"],
                from: item["Sender Email"], 
                to: item["Recipient Email"], 
                status: item["Status"]?.toUpperCase() || "RECEIVED"
            };
             const otherParty = formattedEmail.from === emailAdmin ? formattedEmail.to : formattedEmail.from;
            if (!threads[otherParty]) { 
                threads[otherParty] = []; 
            }
            threads[otherParty].push(formattedEmail);
        });
        Object.values(threads).forEach(thread => 
            thread.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
         return Object.values(threads);
     }, [emailData, emailAdmin]);

    // Show individual email conversation
    if (selectedContact) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                     <AdminEmailIndividual
                         onBack={() => {
                             setSelectedContact(null);
                             // Force refresh emails when coming back
                             setTimeout(() => {
                                 fetchEmails();
                             }, 100);
                         }}
                         currentUserEmail={emailAdmin}
                         otherPartyEmail={selectedContact.email}
                         initialSubject={selectedContact.subject}
                     />
                </div>
            </div>
        );
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f20c32] mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading admin emails...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <NewEmailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                 currentUserEmail={emailAdmin}
                onEmailSent={fetchEmails} 
            />
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Mailbox</h1>
                        <div className="flex gap-5">
                            <button 
                                onClick={() => {
                                    console.log("Manual refresh triggered");
                                    fetchEmails();
                                }} 
                                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                                Refresh
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(true)} 
                                className="px-4 py-2 bg-[#f20c32] text-white font-semibold rounded-lg shadow-md hover:bg-[#fb536f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Send New Email
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="px-4 py-3">Contact</th>
                                    <th className="px-4 py-3">Subject & Last Message</th>
                                    <th className="px-4 py-3">Last Activity</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emailThreads.length > 0 ? (
                                    emailThreads.map((thread, idx) => {
                                        const latestEmail = thread[0];
                                         const otherPartyEmail = latestEmail.from === emailAdmin ? latestEmail.to : latestEmail.from;
                                        return (
                                            <tr 
                                                key={idx} 
                                                className="hover:bg-blue-50 cursor-pointer transition-all"
                                                onClick={() => setSelectedContact({ 
                                                    email: otherPartyEmail, 
                                                    subject: latestEmail.subject 
                                                })}
                                            >
                                                <td className="px-4 py-3 flex items-center gap-3">
                                                    <img 
                                                        src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" 
                                                        alt="avatar" 
                                                        className="w-8 h-8 rounded-full border border-gray-300" 
                                                    />
                                                    <span className="font-medium text-gray-800">{otherPartyEmail}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-800">{latestEmail.subject}</span>
                                                        {thread.length > 1 && (
                                                            <span className="bg-[#f20c32] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                                {thread.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="truncate max-w-xs text-sm">{latestEmail.body}</p>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(latestEmail.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        latestEmail.status === 'SENT' 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {latestEmail.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10">
                                            <div className="flex flex-col items-center">
                                                <div className="text-gray-400 mb-2">
                                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium">No conversations found</p>
                                                 <p className="text-gray-400 text-sm mt-1">
                                                     {emailAdmin ? `No emails found for ${emailAdmin}` : "Please log in to view your emails"}
                                                 </p>
                                                <button 
                                                    onClick={() => fetchEmails()} 
                                                    className="mt-3 px-4 py-2 bg-[#f20c32] text-white text-sm rounded-lg hover:bg-[#fb536f] transition-colors"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
