import {FC, useState} from "react";
import {IBotStatisticsItem} from "@/entity/bot";
import cn from "classnames";
import styles from './Dashboard.module.css';
import {Card, Progress, Text} from "reshaped";

interface Props {
    item: IBotStatisticsItem;
    index: number
}

export const DashboardItem: FC<Props> = ({item, index}) => {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <div className={styles.DashboardItemChild} onClick={() => setIsOpened(prev => !prev)}>
            <div className={cn(styles.DashboardItem, isOpened && styles.DashboardItemChecked)}>
                <Text variant="body-1">
                    <span className={styles.DashboardItemIndex}>{index}. </span>
                    <span className={styles.DashboardItemChildTitle}>{item.title}</span>
                </Text>
                <Progress value={item.percent} size="small"/>
                <Text variant="body-1">{item.percent.toFixed(1)}%</Text>
            </div>
            {isOpened && (
                <Card className={styles.DashboardItemComment} padding={4}>
                    <Text variant="body-3">{item.comment}</Text>
                </Card>
            )}
        </div>
    )
}
