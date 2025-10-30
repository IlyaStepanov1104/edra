import { FC, useState } from 'react'
import styles from './Dashboard.module.css';
import { getBotStatisticsStub } from "@/mocks/BotStatistics";
import { Card, Progress, Text } from "reshaped";
import { IBotStatisticsItem } from "@/entity/bot";
import cn from "classnames";

const DashboardItem: FC<{item: IBotStatisticsItem, index: number}> = ({item, index}) => {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <div className={styles.DashboardItemChild} onClick={() => setIsOpened((prev) => !prev)}>
            <div className={cn(styles.DashboardItem, isOpened && styles.DashboardItemChecked)}>
                <Text variant='body-1'><span className={styles.DashboardItemIndex}>{index}.</span> <span className={styles.DashboardItemChildTitle}>{item.title}</span></Text>
                <Progress value={item.percent} size='small'/>
                <Text variant='body-1'>{item.percent.toFixed(1)}%</Text>
            </div>
            {isOpened && <Card className={styles.DashboardItemComment} padding={4}>
                <Text variant='body-3'>{item.comment}</Text>
            </Card>}
        </div>
    )
}

export const Dashboard: FC = () => {
    const data = [getBotStatisticsStub(), getBotStatisticsStub({title: 'Math', percent: 13.2})];
    return (
        <div className={styles.Dashboard}>
            {data.map((statistics, key) => (
                <div key={key}>
                    <div className={styles.DashboardItem}>
                        <Text variant='body-2' color='primary' weight='bold'
                              className={styles.DashboardItemTitle}>{statistics.title}</Text>
                        <Progress value={statistics.percent} size='medium'/>
                        <Text variant='body-1'>{statistics.percent.toFixed(1)}%</Text>
                    </div>
                    {statistics.list.map((item, index) => (
                        <DashboardItem item={item} index={index + 1} key={index} />
                    ))}
                </div>
            ))}
        </div>
    )
}
