import React from 'react';
import { APP_NAME, GITHUB_REPO_URL, OWNER_FULL_NAME } from '../config/appConfig';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <span>© {new Date().getFullYear()} {OWNER_FULL_NAME}</span>
                <span>{APP_NAME}</span>
                <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
            </div>
        </footer>
    );
}
