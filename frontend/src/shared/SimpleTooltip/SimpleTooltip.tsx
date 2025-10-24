import { FC, PropsWithChildren, ReactNode } from 'react'
import { Tooltip } from 'react-tooltip'

interface ISimpleTooltipProps extends PropsWithChildren {
    content: ReactNode;
    id?: string;
}

export const SimpleTooltip: FC<ISimpleTooltipProps> = ({children, content, id}) => {
    const uid = Math.random().toString(36).substring(2, 15);

    const Wrapper = () => id ? children : <div data-tooltip-id={`simple-tooltip-${uid}`}>{children}</div>;

    console.log("%c 1 --> Line: 10||SimpleTooltip.tsx\n id ?? `simple-tooltip-${uid}`: ","color:#f0f;", id ?? `simple-tooltip-${uid}`);
    return (
        <>
            <Wrapper />
            <Tooltip id={id ?? `simple-tooltip-${uid}`} style={{zIndex: 100000}} variant='light' place='top'>
                {content}
            </Tooltip>
        </>
    );
}