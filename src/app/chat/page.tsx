'use client';

import './style.scss';
import { useRef, useEffect } from 'react';
import Archive from '../../components/archive/archive';
import Input from '../../components/input/input';
import Settings from '../../components/settings/settings';
import Background from '../../components/background/background';
import { useSignals } from '@preact/signals-react/runtime';
import { modelMessages, currentModel } from '@/signals/chatSignals';
import UserInfo from "@/components/user-info/user-info";

export default function Chat() {
    useSignals();
    const scrollContainer = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const timeout = setTimeout(() => {
            if (scrollContainer.current) {
                scrollContainer.current.scrollTo({
                    top: scrollContainer.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [modelMessages.value]);

    return (
        <div id="main-container">
            <Background />
            <Archive wichPage="chat" />
            <section id="chat-container">
                <div id="chat-header">
                    <UserInfo />
                    <Settings />
                </div>
                <div id="messages-container" ref={scrollContainer}>
                    {modelMessages.value[currentModel.value]}
                </div>
                <Input />
            </section>
        </div>
    );
}
