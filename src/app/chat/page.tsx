'use client';

import './style.scss';
import {useRef, useEffect} from 'react';
import Archive from '../../components/archive/archive';
import Input from '../../components/input/input';
import Settings from '../../components/settings/settings';
import Background from '../../components/background/background';
import {useSignals} from '@preact/signals-react/runtime';
import {messagesList, currentModel} from '@/signals/chatSignals';

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
    }, [messagesList.value]);

    return (
        <div id="main-container">
            <Background />
            <Archive wichPage="chat" />
            <section id="chat-container">
                <div id="chat-header">
                    {/*<UserInfo wichPage="chat" />*/}
                    <Settings />
                </div>
                <div id="messages-container" ref={scrollContainer}>
                    {messagesList.value}
                </div>
                <h1>{currentModel.value}</h1>
                <Input />
            </section>
        </div>
    );
}
