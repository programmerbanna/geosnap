import React from 'react';
import styles from './main-layout.module.scss';

interface MainLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, sidebar }) => {
    return (
        <div className={styles.layout}>
            <main className={styles.main}>{children}</main>
            {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
        </div>
    );
};

export default MainLayout;