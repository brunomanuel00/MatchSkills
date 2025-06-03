import { UserRound, MessageCircle, Handshake } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl";
    large?: boolean
}

interface CardInfoInterface {
    icon: React.ReactElement,
    title: string,
    description: string
}

export interface ContentCardInfo {
    content: CardInfoInterface
}

type User = {
    _id: string;
    name: string;
    avatar: {
        public_id: string;
        url: string;
    };
};

export type Message = {
    id: string;
    senderId: User;  // Ahora es un objeto User
    receiverId: User; // Ahora es un objeto User
    content: string;
    timestamp: Date;
    read: boolean;
};

export type Chat = {
    user: User;
    lastMessage: Message;
    unreadCount: number;
};



export const useBenefits = (): CardInfoInterface[] => {
    const { t } = useTranslation();

    return [
        {
            icon: <UserRound className="h-7 w-7" />,
            title: t('benefits.find.title'),
            description: t('benefits.find.description')
        },
        {
            icon: <MessageCircle className="h-7 w-7" />,
            title: t('benefits.chat.title'),
            description: t('benefits.chat.description')
        },
        {
            icon: <Handshake className="h-7 w-7" />,
            title: t('benefits.collaborate.title'),
            description: t('benefits.collaborate.description')
        }
    ];
};