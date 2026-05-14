import React from 'react';
import TabBar from './TabBar';
import { APP_NAME, APP_TAGLINE } from '../config/appConfig';

interface HeaderProps {
    tab: string;
    setTab: (tab: string) => void;
}

export default function Header({ tab, setTab }: HeaderProps) {
    return (
        <header className="header">
            <div className="brand-container">
                <div className="brand">
                    <h1>{APP_NAME}</h1>
                    <p>{APP_TAGLINE}</p>
                </div>
            </div>

            <TabBar tab={tab} setTab={setTab} />
        </header>
    );
}
