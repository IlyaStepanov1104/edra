'use client'
import { MainPage } from "@/fsd-pages/MainPage";
import {useEffect} from "react";

export default function Home() {
    useEffect(() => {
        console.log("Home page loaded");
    }, [])
    return <MainPage />;
}
