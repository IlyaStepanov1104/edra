import {FC, useEffect, useState} from 'react'
import styles from './Dashboard.module.css';
import {Progress, Text} from "reshaped";
import {IDashboardBot, IDashboardModule} from "./types";
import {getBotList, getStatistics} from "@shared/lib/api";
import {DashboardItem} from "./DashboardItem";

const modules = [{title: 'Reading & writing', slug: 'reading-and-writing'}, {title: 'Math', slug: 'math'}];

export const Dashboard: FC = () => {
    const [data, setData] = useState<IDashboardModule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const allModules: IDashboardModule[] = [];

            for (const item of modules) {
                const bots = await getBotList(item.slug);

                const botsWithStats: IDashboardBot[] = await Promise.all(
                    bots.map(async bot => {
                            const stats = await getStatistics(bot._id);
                            return {
                                bot,
                                statistics: {
                                    name: bot.name,
                                    title: bot.name,
                                    percent: stats.understandingPercent ?? 0,
                                    comment: stats.comment ?? ''
                                }
                            }
                        }
                    )
                );

                allModules.push({module: item.slug, bots: botsWithStats});
            }

            setData(allModules);
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.Dashboard}>
            {data.map((moduleData, moduleIndex) => {
                const percent = moduleData.bots.reduce((a, b) => a + b.statistics.percent, 0) / moduleData.bots.length;
                const moduleItem = modules.find((item) => item.slug === moduleData.module);
                return (
                    <div key={moduleIndex}>
                        <div className={styles.DashboardItem}>
                            <Text variant='body-2' color='primary' weight='bold'
                                  className={styles.DashboardItemTitle}>{moduleItem?.title}</Text>
                            <Progress value={percent} size='medium'/>
                            <Text variant='body-1'>{percent.toFixed(1)}%</Text>
                        </div>

                        {moduleData.bots.map((botItem, index) => (
                            <DashboardItem item={botItem.statistics} index={index + 1} key={index}/>
                        ))}
                    </div>
                )
            })}
        </div>
    )
}
