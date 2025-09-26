
import React, { useState, useMemo, useEffect, useCallback } from "react";
import EmailIndividual from './EmailIndividual';
import axios from "axios";
import { useParams } from "react-router-dom";

// Modal Component - Unchanged
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
                    onEmailSent(); onClose(); setRecipient(''); setSubject(''); setBody('');
                } else { alert('Failed to send email. Please try again.'); }
            })
            .catch(err => { console.error("Error sending email:", err); alert('An error occurred while sending the email.'); })
            .finally(() => { setIsSending(false); });
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Send New Email</h2>
                <div className="space-y-4">
                    <input type="email" placeholder="Recipient Email" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                    <textarea rows="5" placeholder="Email body..." value={body} onChange={(e) => setBody(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSendEmail} disabled={isSending} className="px-4 py-2 bg-[#f20c32] text-white font-semibold rounded-lg hover:bg-[#f9546f] disabled:bg-[#a9243a]">{isSending ? 'Sending...' : 'Send Email'}</button>
                </div>
            </div>
        </div>
    );
};

export default function ManageRepEmailBox() {
    // MODIFIED: State now holds the selected contact's info, not the whole thread
    const [selectedContact, setSelectedContact] = useState(null);
    const [emailData, setEmailData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const params = useParams();
    // const email = decodeURIComponent(params.email);

const [email, setEmail] = useState();

useEffect(()=>{
    setEmail(localStorage.getItem('user_email'));
},[email])

    const fetchEmails = useCallback(() => {
        axios.post('https://n8nnode.bestworks.cloud/webhook/email-log-fetch', { email })
            .then((res) => { setEmailData(res.data); })
            .catch((err) => { console.error("Error fetching emails:", err); });
    }, [email]);

    useEffect(() => { fetchEmails(); }, [fetchEmails]);

    const emailThreads = useMemo(() => {
        const threads = {};
        emailData?.forEach(item => {
            if (!item || !item["Sender Email"] || !item["Recipient Email"]) return;
            const formattedEmail = {
                id: item.id, subject: item["Email Subject"], body: item["Email Body"], date: item["Sent Date"],
                from: item["Sender Email"], to: item["Recipient Email"], status: item["Status"]?.toUpperCase() || "RECEIVED"
            };
            const otherParty = formattedEmail.from === email ? formattedEmail.to : formattedEmail.from;
            if (!threads[otherParty]) { threads[otherParty] = []; }
            threads[otherParty].push(formattedEmail);
        });
        Object.values(threads).forEach(thread => thread.sort((a, b) => new Date(b.date) - new Date(a.date)));
        return Object.values(threads);
    }, [emailData, email]);

    // MODIFIED: This component no longer needs to manage complex updates for the child
    if (selectedContact) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <EmailIndividual
                        onBack={() => {
                            setSelectedContact(null);
                            fetchEmails(); // Refresh the dashboard list when coming back
                        }}
                        currentUserEmail={email}
                        otherPartyEmail={selectedContact.email}
                        initialSubject={selectedContact.subject}
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <NewEmailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} currentUserEmail={email} onEmailSent={fetchEmails} />
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
                       <div className="flex gap-5">
                         {/* <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">Reload</button> */}
                        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#f20c32] text-white font-semibold rounded-lg shadow-md hover:bg-[#fb536f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">Send New Email</button>
                       </div>
                        </div>
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100 text-left"><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Subject & Last Message</th><th className="px-4 py-3">Last Activity</th><th className="px-4 py-3">Status</th></tr>
                            </thead>
                            <tbody>
                                {emailThreads.length > 0 ? (
                                    emailThreads.map((thread, idx) => {
                                        const latestEmail = thread[0];
                                        const otherPartyEmail = latestEmail.from === email ? latestEmail.to : latestEmail.from;
                                        return (
                                            <tr key={idx} className="hover:bg-blue-50 cursor-pointer transition-all"
                                                onClick={() => setSelectedContact({ email: otherPartyEmail, subject: latestEmail.subject })}>
                                                <td className="px-4 py-3 flex items-center gap-3">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" alt="avatar" className="w-8 h-8 rounded-full border border-gray-300" />
                                                    <span className="font-medium text-gray-800">{otherPartyEmail}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-800">{latestEmail.subject}</span>
                                                        {thread.length > 1 && (<span className="bg-[#f20c32] text-white text-xs font-bold px-2 py-0.5 rounded-full">{thread.length}</span>)}
                                                    </div>
                                                    <p className="truncate max-w-xs text-sm">{latestEmail.body}</p>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{new Date(latestEmail.date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${latestEmail.status === 'SENT' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{latestEmail.status}</span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="4" className="text-center py-10 text-gray-500">No conversations found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
