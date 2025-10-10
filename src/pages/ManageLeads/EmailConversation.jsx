import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaChevronDown, FaEnvelope, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EmailConversation = ({ leadEmail, leadName }) => {
  const [thread, setThread] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(-1);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const currentUserEmail = 'team@showmecustomapparel.com';

  // Fetch email conversation thread
  const fetchAndSetThread = useCallback(async () => {
    if (!currentUserEmail || !leadEmail) return;
    setIsLoading(true);
    try {
      const res = await axios.post('https://n8nnode.bestworks.cloud/webhook/email-log-fetch-admin-singlepage', { 
        email: currentUserEmail, 
        leadEmail 
      });
      const allEmails = res.data || [];

      const conversationEmails = allEmails
        .filter(item => item && item["Email Subject"] && item["Sent Date"] && item["Sender Email"])
        .map(item => ({
          id: item.id,
          subject: item["Email Subject"],
          body: item["Email Body"] || item["Email Content"] || "No content available",
          date: item["Sent Date"],
          from: item["Sender Email"],
          to: item["Recipient Email"],
          status: item["Status"]?.toUpperCase() || "RECEIVED"
        }));

      setThread(conversationEmails);
    } catch (error) {
      console.error("Failed to fetch conversation thread:", error);
      toast.error("Could not load the email conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserEmail, leadEmail]);

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
    const subject = latestEmail?.subject?.startsWith("Re: ") ? latestEmail.subject : `Re: ${latestEmail?.subject || 'Follow up'}`;

    const payload = {
      replyBody: replyText,
      reciepent: leadEmail,
      sender: currentUserEmail,
      subject: subject,
    };

    axios.post('https://n8nnode.bestworks.cloud/webhook/email-sender', payload)
      .then(res => {
        if (res.status === 200) {
          toast.success('Reply sent successfully!');
          setReplyText('');
          // Re-fetch the conversation to get the latest update
          fetchAndSetThread();
        } else {
          toast.error('Failed to send reply. Please try again.');
        }
      })
      .catch(err => {
        console.error("Reply error:", err);
        toast.error('An error occurred while sending your reply.');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  if (!leadEmail) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaEnvelope className="w-5 h-5 mr-2 text-[#f20c32]" />
          Email Conversation
        </h2>
        <div className="text-center py-8 text-gray-500">
          <FaEnvelope className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No email address available for this lead</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <FaEnvelope className="w-5 h-5 mr-2 text-[#f20c32]" />
        Email Conversation with {leadName}
      </h2>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f20c32] mx-auto mb-2"></div>
          <span className="text-gray-600">Loading conversation...</span>
        </div>
      ) : chronologicalThread.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {chronologicalThread.map((email, index) => (
            <div key={email.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)} 
                className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#f20c32] rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{email.subject}</p>
                    <p className="text-xs text-gray-500">to {email.to}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {new Date(email.date).toLocaleDateString()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    email.status === 'SENT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {email.status}
                  </span>
                  <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>
              {openIndex === index && (
                <div className="p-4 border-t border-gray-200 text-gray-700 bg-white">
                  {/* <div className="mb-2">
                    <span className="text-sm font-medium text-gray-900">Subject: </span>
                    <span className="text-sm text-gray-700">{email.subject}</span>
                  </div> */}
                  <div className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {email.body}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaEnvelope className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No conversation history found</p>
        </div>
      )}

      {/* Reply Section */}
      <div className="mt-6 pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Send Reply</h3>
        <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#f20c32] focus-within:border-transparent transition">
          <textarea 
            className="w-full p-3 border-0 focus:ring-0 resize-none rounded-lg text-sm" 
            rows="4" 
            placeholder="Type your reply here..." 
            value={replyText} 
            onChange={(e) => setReplyText(e.target.value)}
          />
        </div>
        <div className="mt-3 flex justify-end">
          <button 
            onClick={handleSendReply} 
            className="px-6 py-2 bg-[#f20c32] text-white font-semibold rounded-lg hover:bg-[#dc2626] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm" 
            disabled={!replyText.trim() || isSending}
          >
            {isSending ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConversation;
