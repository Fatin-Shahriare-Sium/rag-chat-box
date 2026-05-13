import ChatBox from "@/components/ui/new-chat-box/custom-chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Chat App</h1>
        <p className="text-lg text-gray-600">Click the chat button in the bottom-right corner to start a conversation.</p>
      </div>

      {/* Chat Button with default styling */}
      <ChatBox />

      {/* Alternative: Custom styling example */}
      {/* 
      <ChatBox
        buttonText="Support"
        backgroundColor="#3B82F6"
        textColor="#FFFFFF"
        userId="user-456"
        userName="John Doe"
        webhookUrl="https://your-webhook-url.com/webhook"
        onSendMessage={(message) => console.log('Message sent:', message)}
      />
      */}
    </main>
  );
}
