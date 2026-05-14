import { Github } from 'lucide-react';
import { APP_NAME, GITHUB_REPO_URL, OWNER_FULL_NAME } from '../config/appConfig';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <span>© {new Date().getFullYear()} Todos los derechos reservados a {OWNER_FULL_NAME}</span>
                <span className="footer-separator">|</span>
                <span>{APP_NAME}</span>
                <span className="footer-separator">|</span>
                <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="footer-link">
                    <Github size={15} aria-hidden="true" />
                    GitHub
                </a>
            </div>
        </footer>
    );
}
