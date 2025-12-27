import {useState, useEffect} from 'react';
import {Button, Input, Form, message} from 'antd';
import api from '../../shared/lib/api';

interface Bot {
    _id: string;
    name: string;
    description: string;
    prompt: string;
}

export default function BotSettings() {
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBots();
    }, []);

    const fetchBots = async () => {
        try {
            const response = await api.get('/bots');
            setBots(response.data);
        } catch (error) {
            message.error('Error with bots loading');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePrompt = async (botId: string, prompt: string) => {
        try {
            await api.put(`/bots/${botId}/prompt`, {prompt});
            message.success('Prompt has been successfully updated');
            fetchBots();
        } catch (error) {
            console.error(error);
            message.error('Error updating the product');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Bots settings</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-6">
                    {bots.map(bot => (
                        <div key={bot._id} className="p-4 border rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">{bot.name}</h2>
                            <p className="text-gray-600 mb-4">{bot.description}</p>

                            <Form
                                initialValues={{prompt: bot.prompt}}
                                onFinish={(values: { prompt: string }) =>
                                    handleUpdatePrompt(bot._id, values.prompt)
                                }
                            >
                                <Form.Item name="prompt" label="Prompt">
                                    <Input.TextArea rows={6} className="w-full"/>
                                </Form.Item>

                                <Button type="primary" htmlType="submit">
                                    Save
                                </Button>
                            </Form>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}