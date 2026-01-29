import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePageTitle(title) {
    const location = useLocation();

    useEffect(() => {
        const baseTitle = '新聞係';
        document.title = title ? `${title} | ${baseTitle}` : baseTitle;
    }, [title, location]);
}
