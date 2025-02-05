import React from 'react';
import styles from './tab-navigation.module.scss';

interface TabNavigationProps {
    activeTab: 'map' | 'list';
    onTabChange: (tab: 'map' | 'list') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className={styles.tabNavigation}>
            <button
                className={`${styles.tab} ${activeTab === 'map' ? styles.active : ''}`}
                onClick={() => onTabChange('map')}
            >
                Map View
            </button>
            <button
                className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
                onClick={() => onTabChange('list')}
            >
                Polygon List
            </button>
        </div>
    );
};

export default TabNavigation;