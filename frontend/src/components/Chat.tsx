import { useChat } from './context/ChatContext';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

export default function Chat({ receivedUserId, onClose }: { receivedUserId: string, onClose: Function }) {
    const { sendMessage, setActiveChat } = useChat();
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        setActiveChat(receivedUserId)
    }, [])

    const handleSubmit = async () => {
        if (newMessage.trim()) {
            await sendMessage(newMessage);
            setNewMessage('');
        }
        setActiveChat(null)
        onClose()

    };

    return (
        <div>
            <div className="flex gap-2 mt-2">
                <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje"
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <Button onClick={handleSubmit}>
                    <Send />
                </Button>
            </div>
        </div>
    );
}
