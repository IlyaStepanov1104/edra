import {FC, useEffect, useRef, useState} from 'react'
import cn from "classnames";

import styles from './Chat.module.css';
import {Avatar, Button, Link, Loader, Modal, Text, TextArea, Timeline, View} from "reshaped";
import {IconBot} from "@features/Chat/Chat.assets/IconBot";
import {IconUser} from "@shared/Header/Header.assets/IconUser";
import {useUnit} from 'effector-react';
import {getBotChatHistory, IChatHistory} from "@/entity/message";
import {sendBotMessage} from "@/entity/message";
import {IconMic} from "@features/Chat/Chat.assets/IconMic";
import {IconSend} from "@features/Chat/Chat.assets/IconSend";
import {PageModel} from "@shared/lib/pages";
import {IconQRCode} from './Chat.assets/IconQRCode';
import {SimpleTooltip} from "@shared/SimpleTooltip";
import {useAuth} from "@shared/lib/auth";
import {MessageRender} from "@shared/MessageRender";
import {getLatexResult, getQRCodeLink, LatexResult, unsubscribeLatexResult} from "@shared/lib/api";
import {QRCode} from "antd";

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
    }
];

const Marker: FC<{ isMe: boolean }> = ({isMe}) => {
    return <Avatar
        size={7}
        color="primary"
        variant={isMe ? 'faded' : 'solid'}
        icon={isMe ? IconUser : IconBot}
    ></Avatar>;
}

export const Chat: FC = ({}) => {
    const params = useUnit(PageModel.$pageParams);
    const [botSlug, setBotSlug] = useState(params?.bot ?? null);
    const isInformationBot = botSlug === 'information';
    const page = params?.page;
    const [chatHistory, setChatHistory] = useState<IChatHistory>([]);
    const [inputValue, setInputValue] = useState('');
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [messageLoadingCounter, setMessageLoadingCounter] = useState<number>(0);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const {getToken} = useAuth();
    const token = getToken();
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [qrHash, setQrHash] = useState<string | null>(null);
    const QRLink = `${window.origin}/photo-upload/${qrHash}`;
    const [qrResult, setQrResult] = useState<LatexResult | null>(null);
    console.log("%c 1 --> Line: 67||Chat.tsx\n qrResult: ", "color:#f0f;", qrResult);

    useEffect(() => {
        if (params?.bot !== botSlug) setBotSlug(params?.bot ?? null);
    }, [botSlug, params]);

    const handleGenerateQR = async () => {
        if (!botSlug || !token) return;

        const data = await getQRCodeLink(token);
        setQrHash(data.hash);
        setQrModalOpen(true);
    };

    useEffect(() => {
        if (!qrModalOpen || !qrHash || !token) return;

        const interval = setInterval(async () => {
            const result = await getLatexResult(qrHash, token);
            if (result.status !== qrResult?.status) {
                setQrResult(result);
            }
            if (result.status === 'done' || result.status === 'error') {
                clearInterval(interval)
            }
        }, 2000);


        return () => clearInterval(interval);
    }, [qrHash, qrModalOpen, qrResult?.status, token]);

    useEffect(() => {
        setChatHistory([]);
        getBotChatHistory(botSlug, token)
            .then(
                (history) => setChatHistory(() => {
                    if (isInformationBot) return [...informationBotHistory, ...history]
                    return [...history]
                })
            )
            .catch(console.error);
    }, [botSlug, isInformationBot, token]);

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

    const insertQrResultInChat = () => {
        setInputValue((prev) => `${prev}\n${qrResult?.result ?? ''}`);
        setQrModalOpen(false);
        unsubscribeLatexResult(qrHash ?? '', token ?? '');
        setQrResult(null);
        setQrHash(null);
    }

    return botSlug ? (
        <div className={cn(styles.ChatWrapper, isInformationBot && styles.ChatWrapperInformation)}>
            {isInformationBot && <div className={styles.InformationMessage}>
                At Edra, our team of cognitive scientists and AI experts has built an innovative system that combines
                smart learning science with advanced AI. Each topic is practiced separately, so you master every type of
                question in both Reading & Writing and Math. If you commit to the program and put in the hours, we
                guarantee you’ll strengthen your skills and achieve your absolute best on the SAT.
            </div>}
            <div className={cn(styles.Chat, styles.Card)} ref={chatContainerRef}>
                <Timeline>
                    {chatHistory.map((message, index) => {
                        return (
                            <Timeline.Item
                                markerSlot={<Marker isMe={message.role === 'user'}/>}
                                key={index}
                            >
                                <MessageRender content={message.content}/>
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
                                setInputValue(event.value)
                            }
                        }
                        placeholder="Type message here..."
                        resize='none'
                        size='large'
                    >
                    </TextArea>
                    <View justify="space-between" direction="row">
                        <SimpleTooltip content="Sorry, there was a mistake. Please try again later.">
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
                                onClick={handleGenerateQR}
                                size="xlarge"
                            />
                        </SimpleTooltip>
                    </div>
                )}
            </View>
            <Modal active={qrModalOpen} onClose={() => setQrModalOpen(false)}>
                {(!qrResult || qrResult.status === 'pending') && (
                    <View align="center" gap={4}>
                        <Text variant="featured-2">Scan to upload your math photo</Text>
                        {QRLink && <QRCode value={QRLink} size={180} type="svg"/>}
                        <Link href={QRLink ?? undefined} attributes={{target: '_blank'}}>{QRLink}</Link>
                    </View>
                )}
                {(qrResult?.status === 'processing') && (
                    <View align="center" gap={4}>
                        <Text variant="featured-2">Waiting</Text>
                        <Loader size="large"/>
                    </View>
                )}
                {(qrResult?.status === 'done') && (
                    <View align="center" gap={4}>
                        <Text variant="featured-2">Result</Text>
                        <TextArea
                            value={qrResult.result}
                            name="result"
                            resize='none'
                            size='large'
                            onChange={({value}) => setQrResult((prev) => ({
                                status: prev?.status || 'pending',
                                result: value,
                                error: prev?.error
                            }))}
                        />
                        <Button
                            onClick={insertQrResultInChat}
                            color='primary'
                            variant='solid'
                            size='xlarge'>Insert in message</Button>
                    </View>
                )}
                {(qrResult?.status === 'error') && (
                    <View align="center" gap={4}>
                        <Text variant="featured-2">Error</Text>
                        <Text variant="featured-3" color="critical">{qrResult.error}</Text>
                    </View>
                )}
            </Modal>
        </div>
    ) : (
        <div className={cn(styles.Card, styles.CardEmpty)}>
            <Text variant="featured-1" align="center">Select a topic on the left to open the chat.</Text>
        </div>
    );
}