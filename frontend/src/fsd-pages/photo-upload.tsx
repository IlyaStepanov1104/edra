'use client';

import {ChangeEvent, useState} from "react";
import {useParams} from "next/navigation";
import {
    Text,
    Button,
    Loader, Card, FileUpload, View, TextArea,
} from "reshaped";
import {Logo} from "@shared/Header/Header.assets/Logo";
import styles from "@shared/Header/Header.module.css";
import {postImage} from "@shared/lib/api";

// @ts-expect-error error generic
type OnChangeArgs = { event?: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>, name: string, value: File[] };

export const PhotoUploadPage = () => {
    const {hash} = useParams<{ hash: string }>();

    const [latex, setLatex] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!hash) return;

    const handleFileChange = async ({value}: OnChangeArgs) => {
        const file = value[0];
        if (!file) return;

        setLoading(true);
        setError(null);
        setLatex(null);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("hash", hash);

        try {
            const response = await postImage(formData);

            if (response.status !== 'done') throw new Error("Recognition error");

            setLatex(response.result);
        } catch (e) {
            console.error(e);
            setError("Error when sending a file or analyzing it");
        }
        setLoading(false);
    };

    return (
        <Card
            padding={6}
        >
            <View direction='column' justify='space-between' align='center' gap={4}>
                <Logo className={styles.HeaderLogo}/>
                <Text variant="body-1">Upload a photo of the solution</Text>

                {!loading && !error && !latex && (<FileUpload
                    onChange={handleFileChange}
                    inputAttributes={{accept: "image/*", disabled: loading}}
                    name="File"
                >
                    Choose image
                </FileUpload>)}

                {loading && (
                    <View direction="row" align="center" gap={2}>
                        <Loader size="medium"/>
                        <Text variant="body-2">Recognition...</Text>
                    </View>
                )}

                {error && (
                    <Text variant="body-2" color="critical">
                        {error}
                    </Text>
                )}

                {latex && (
                    <View gap={4}>
                        <Text variant="body-3">LaTeX result:</Text>
                        <Card>
                            <Text variant="caption-1" attributes={{style: {whiteSpace: 'pre-wrap'}}}>{latex}</Text>
                        </Card>
                    </View>
                )}
            </View>
        </Card>
    );
};
