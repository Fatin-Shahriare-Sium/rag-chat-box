# ChatBox Component Documentation

A professional, customizable chat widget component for Next.js applications that integrates with your webhook API.

## Features

✅ **Professional UI** - Modern chat interface with smooth animations
✅ **Customizable Colors** - Pass any background and text colors as props
✅ **Default Styling** - Black background with white text by default
✅ **Webhook Integration** - Sends messages to your N8N webhook
✅ **Auto-Scrolling** - Automatically scrolls to the latest message
✅ **Loading States** - Animated loading indicator while awaiting responses
✅ **Responsive Design** - Works on mobile and desktop
✅ **User Data Support** - Pass custom user ID and name
✅ **Error Handling** - Graceful error messages for failed requests
✅ **TypeScript** - Fully typed component

## Installation

The component is already installed at:

```
components/ui/new-chat-box/custom-chat.tsx
```

### Dependencies

Make sure you have `lucide-react` installed:

```bash
npm install lucide-react
```

## Usage

### Basic Usage (Default Styling)

```tsx
import ChatBox from "@/components/ui/new-chat-box/custom-chat";

export default function Page() {
  return <ChatBox />;
}
```

This will show a chat button with black background and white text in the bottom-right corner.

### Custom Styling

```tsx
<ChatBox buttonText="Contact Us" backgroundColor="#3B82F6" textColor="#FFFFFF" userId="user-123" userName="John Doe" webhookUrl="https://your-webhook.com/api" onSendMessage={(message) => console.log("Sent:", message)} />
```

## Props

| Prop              | Type     | Default                                                     | Description                                   |
| ----------------- | -------- | ----------------------------------------------------------- | --------------------------------------------- |
| `buttonText`      | string   | "Chat"                                                      | Text displayed on the chat button             |
| `backgroundColor` | string   | "#000000"                                                   | Hex color for button and user message bubbles |
| `textColor`       | string   | "#FFFFFF"                                                   | Hex color for text on button and messages     |
| `userId`          | string   | "123"                                                       | User ID sent with messages                    |
| `userName`        | string   | "Fatin"                                                     | User name sent with messages                  |
| `webhookUrl`      | string   | "https://n8n-1-78-1-3y8s.onrender.com/webhook-test/webhook" | Webhook endpoint for messages                 |
| `onSendMessage`   | function | undefined                                                   | Callback when message is sent successfully    |

## API Request Format

When a message is sent, the component makes a POST request with this JSON body:

```json
{
  "user": {
    "id": "123",
    "name": "Fatin"
  },
  "message": {
    "text": "Hello",
    "time": 1714550000
  }
}
```

## Expected API Response Format

The component expects responses in this format:

```json
{
  "success": true,
  "data": {
    "message": "Hello, how can I help you?",
    "timestamp": 1714550000
  }
}
```

The bot message displayed will be from `data.message` in the response.

## Using with User Data API

There's a custom hook included for fetching user data from an API:

```tsx
"use client";

import { useUserData } from "@/lib/useUserData";
import ChatBox from "@/components/ui/new-chat-box/custom-chat";

export default function Page() {
  const { user, isLoading } = useUserData("https://api.example.com/user");

  if (isLoading) return <div>Loading...</div>;

  return <ChatBox userId={user.id} userName={user.name} backgroundColor="#3B82F6" />;
}
```

## Styling

The component uses:

- **Tailwind CSS** for responsive layout
- **Inline styles** for dynamic color props
- **Lucide React icons** for send button and close button

## Color Scheme Examples

### Blue Theme

```tsx
<ChatBox backgroundColor="#3B82F6" textColor="#FFFFFF" />
```

### Green Theme

```tsx
<ChatBox backgroundColor="#10B981" textColor="#FFFFFF" />
```

### Purple Theme

```tsx
<ChatBox backgroundColor="#8B5CF6" textColor="#FFFFFF" />
```

### Red Theme

```tsx
<ChatBox backgroundColor="#EF4444" textColor="#FFFFFF" />
```

## Behavior

- **Chat Button** - Fixed position at bottom-right, can be customized
- **Modal** - Overlay with semi-transparent background
- **Chat Window** - 384px wide on mobile, 384px wide on desktop (configurable)
- **Messages** - User messages appear on the right, bot on the left
- **Loading** - Animated loading indicator appears while awaiting response
- **Auto-close** - Click the X button or outside the modal to close (backdrop click)
- **Auto-scroll** - Automatically scrolls to the latest message
- **Empty State** - Shows a welcome message when no messages yet

## Error Handling

If the webhook request fails:

- An error message is displayed in the chat
- The error is logged to the browser console
- The input field remains enabled for retry

## Accessibility

- Button has proper `aria-label`
- Keyboard navigation supported
- Disabled state for inputs during loading
- Semantic HTML structure

## Notes

- The component is a Client Component (`'use client'`)
- Requires Next.js 13+ (App Router)
- Make sure to import Tailwind CSS styles in your app
- The webhook URL must support CORS or be on the same domain
- Messages are stored in component state (not persistent)

## Example Page Integration

```tsx
import ChatBox from "@/components/ui/new-chat-box/custom-chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">My App</h1>
        <p className="text-lg text-gray-600">Chat support available!</p>
      </div>

      <ChatBox backgroundColor="#000000" textColor="#FFFFFF" />
    </main>
  );
}
```

## Troubleshooting

**Messages not sending?**

- Check browser console for CORS errors
- Verify webhook URL is correct
- Ensure webhook accepts POST requests

**Colors not changing?**

- Use valid hex color codes (#RRGGBB)
- Make sure to pass props correctly

**Chat not opening?**

- Verify component is rendered in a Client Component
- Check z-index if other fixed elements are overlapping
- Ensure JavaScript is enabled

## License

MIT
