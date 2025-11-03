import { FC, useEffect, useRef, useState } from 'react'
import cn from "classnames";

import styles from './Chat.module.css';
import { Avatar, Button, Text, TextArea, Timeline, View } from "reshaped";
import { IconBot } from "@features/Chat/Chat.assets/IconBot";
import { IconUser } from "@shared/Header/Header.assets/IconUser";
import { useUnit } from 'effector-react';
import { getBotChatHistory, IChatHistory } from "@/entity/message";
import { sendBotMessage } from "@/entity/message";
import { IconMic } from "@features/Chat/Chat.assets/IconMic";
import { IconSend } from "@features/Chat/Chat.assets/IconSend";
import { PageModel } from "@shared/lib/pages";
import { IconQRCode } from './Chat.assets/IconQRCode';
import { SimpleTooltip } from "@shared/SimpleTooltip";
import { useAuth } from "@shared/lib/auth";

const informationBotHistory: IChatHistory = [
    {
        _id: '1',
        content: 'Edra is not affiliated with or endorsed by the College Board. However, our curriculum is 100% aligned with the official SAT structure and content as of 2025.\n' +
            '\n' +
            '👉 For official SAT information, policies, and registration, please visit the College Board official website. https://satsuite.collegeboard.org/sat',
        userId: 'default',
        botId: 'information',
        role: 'assistant'
    },
    {
        _id: '2',
        content: '💬 Meet Your Coach\n' +
            'Here is your personal SAT coach bot.\n' +
            'Ask anything, practice questions, and track your progress — all in one place.',
        userId: 'default',
        botId: 'information',
        role: 'assistant'
    },
];

const Marker: FC<{isMe: boolean}> = ({isMe}) => {
    return <Avatar
        size={7}
        color="primary"
        variant={isMe ? 'faded' : 'solid'}
        icon={isMe ? IconUser : IconBot}
    ></Avatar>;
}

export const Chat: FC = ({}) => {
    const params = useUnit(PageModel.$pageParams);
    const botSlug = params?.bot ?? null;
    const isInformationBot = botSlug === 'information';
    const page = params?.page;
    const [chatHistory, setChatHistory] = useState<IChatHistory>([]);
    const [inputValue, setInputValue] = useState('');
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [messageLoadingCounter, setMessageLoadingCounter] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { getToken } = useAuth();
    const token = getToken();

    useEffect(() => {
        if (!token) {
            setError('Authentication required');
            return;
        }

        if (isInformationBot) setChatHistory(informationBotHistory);

        const loadHistory = async () => {
            try {
                const history = await getBotChatHistory(botSlug, token);
                setChatHistory((prev) => [...prev, ...history]);
                setError(null);
            } catch (err) {
                setError('Failed to load chat history');
                console.error(err);
            }
        };

        loadHistory();
    }, [botSlug, token]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatContainerRef, chatHistory]);

    useEffect(() => {
        if (isMessageLoading) {
            const interval = setInterval(() => {
                setMessageLoadingCounter((prev) => prev + 1);
            }, 650);

            return () => clearInterval(interval);
        }
    }, [isMessageLoading]);

    const getHandleSend = () => async () => {
        if (!inputValue || !token || !botSlug) return;
        
        try {
            setChatHistory((prev) => [...prev, {
                _id: '',
                role: 'user',
                content: inputValue,
                "userId": '',
                "botId": '',
            }]);
            setInputValue('');
            setIsMessageLoading(true);
            
            const response = await sendBotMessage(botSlug, inputValue, token);
            
            setChatHistory((prev) => [...prev, {
                _id: '',
                role: 'assistant',
                content: response,
                "userId": '',
                "botId": '',
            }]);
        } catch (error) {
            setError('Failed to send message');
            console.error(error);
        } finally {
            setIsMessageLoading(false);
        }
    };

    const LoadingMessage = () => isMessageLoading ?
        (
            <Timeline.Item
                markerSlot={<Marker isMe={false}/>}
            >
                <Text variant="body-1" className={styles.Text}>{'.'.repeat((messageLoadingCounter % 3) + 1)}</Text>
            </Timeline.Item>
        )
        : undefined

    return botSlug ? (
            <div className={styles.ChatWrapper}>
                {isInformationBot && <div className={styles.InformationMessage}>
                    At Edra, our team of cognitive scientists and AI experts has built an innovative system that combines smart learning science with advanced AI. Each topic is practiced separately, so you master every type of question in both Reading & Writing and Math. If you commit to the program and put in the hours, we guarantee you’ll strengthen your skills and achieve your absolute best on the SAT.
                </div>}
                <div className={cn(styles.Chat, styles.Card)} ref={chatContainerRef}>
                    <Timeline>
                        {chatHistory.map((message, index) => {
                            return (
                                <Timeline.Item
                                    markerSlot={<Marker isMe={message.role === 'user'}/>}
                                    key={index}
                                >
                                    <Text variant="body-1" className={styles.Text}>{message.content}</Text>
                                </Timeline.Item>
                            );
                        })}
                        <LoadingMessage/>
                    </Timeline>
                </div>
                <View direction="row" justify="space-between" className={styles.Card} gap={4}>
                    <div className={styles.ChatInputContainer}>
                        <TextArea
                            name='input'
                            value={inputValue}
                            onChange={
                                (event) => {
                                    console.log("%c 1 --> Line: 61||Chat.tsx\n event: ", "color:#f0f;", event);
                                    setInputValue(event.value)
                                }
                            }
                            placeholder="Type message here..."
                            resize='none'
                            size='large'
                        >
                        </TextArea>
                        <View justify="space-between" direction="row">
                            <SimpleTooltip content="Извините, произошла ошибка. Пожалуйста, попробуйте позже.">
                                <Button
                                    icon={IconMic}
                                    color='primary'
                                    variant='faded'
                                    size='medium'
                                    rounded
                                    className={styles.ChatInputButton}
                                />
                            </SimpleTooltip>

                            <Button
                                icon={IconSend}
                                color='primary'
                                variant='solid'
                                size='medium'
                                rounded
                                className={styles.ChatInputButton}
                                onClick={getHandleSend()}
                            />
                        </View>
                    </div>
                    {page === 'math' && (
                        <div
                            data-tooltip-id="qr-code-button"
                            className={styles.QRCodeButtonWrapper}
                        >
                            <SimpleTooltip content={
                                <span>
                            Generate QR to scan and upload your<br/>
                            math photo; the bot parses and helps
                        </span>}
                                           id="qr-code-button">
                                <Button
                                    icon={IconQRCode}
                                    color='primary'
                                    variant='faded'
                                    className={styles.QRCodeButton}
                                />
                            </SimpleTooltip>
                        </div>
                    )}
                </View>
            </div>
        ) :
        (
            <div className={cn(styles.Card, styles.CardEmpty)}>
                <Text variant="featured-1" align="center">Select a topic on the left to open the chat.</Text>
            </div>
        );
}