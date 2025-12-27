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

// @ts-ignore
type OnChangeArgs = { event?: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>, name: string, value: File[] };

export const PhotoUploadPage = () => {
    const {hash} = useParams<{hash: string}>();

    const [latex, setLatex] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!hash) return;

    const handleFileChange = async ({value}: OnChangeArgs) => {
        const file = value[0];
        console.log("%c 1 --> Line: 28||photo-upload.tsx\n file: ","color:#f0f;", file);
        if (!file) return;

        setLoading(true);
        setError(null);
        setLatex(null);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("hash", hash);

        try {
            const response = await postImage(formData);

            if (!response.ok) throw new Error("Recognition error");

            const data = await response.json();
            setLatex(data.latex);
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

                <FileUpload
                    onChange={handleFileChange}
                    inputAttributes={{accept: "image/*", disabled: loading}}
                    name="File"
                >
                    Choose image
                </FileUpload>

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
                        <TextArea name="result" disabled value={latex} size="large"/>

                        <Button
                            onClick={() => {
                                if (window.opener) {
                                    window.opener.postMessage("LATEX_RESULT:" + latex, "*");
                                    window.close();
                                } else {
                                    window.parent.postMessage("LATEX_RESULT:" + latex, "*");
                                    if (window.history.length > 1) history.back();
                                }
                            }}
                        >
                            Insert into chat
                        </Button>
                    </View>
                )}
            </View>
        </Card>
    );
};
