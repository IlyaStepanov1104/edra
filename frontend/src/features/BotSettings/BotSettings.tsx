import { useState, useEffect } from 'react';
import { Button, Input, Form, message } from 'antd';
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
      message.error('Ошибка при загрузке ботов');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrompt = async (botId: string, prompt: string) => {
    try {
      await api.put(`/bots/${botId}/prompt`, { prompt });
      message.success('Промпт успешно обновлен');
      fetchBots();
    } catch (error) {
      message.error('Ошибка при обновлении промпта');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Настройки ботов</h1>
      
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="space-y-6">
          {bots.map(bot => (
            <div key={bot._id} className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{bot.name}</h2>
              <p className="text-gray-600 mb-4">{bot.description}</p>
              
              <Form
                initialValues={{ prompt: bot.prompt }}
                onFinish={(values: {prompt: string}) => 
                  handleUpdatePrompt(bot._id, values.prompt)
                }
              >
                <Form.Item name="prompt" label="Промпт">
                  <Input.TextArea rows={6} className="w-full" />
                </Form.Item>
                
                <Button type="primary" htmlType="submit">
                  Сохранить
                </Button>
              </Form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}