'use client';

import { useRequireAuth } from '../../contexts/AuthContext';
import styles from './reports.module.css';

export default function ReportsPage() {
  // Require authentication and access to 'reports' page
  const { user, isLoading } = useRequireAuth('reports');
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Loading...</h1>
          <p className="page-subtitle">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="page-header">
        <h1 className={styles.title}>Reports & Analytics</h1>
        <p className="page-subtitle">View sales and inventory reports</p>
      </div>
      
      <div className={styles.content}>
        <div className={styles.reportCards}>
          <div className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <h3>Sales Report</h3>
              <span className={styles.cardIcon}>💰</span>
            </div>
            <div className={styles.cardContent}>
              <p>Monthly sales overview and trends</p>
              <button className={styles.cardButton}>View Details</button>
            </div>
          </div>

          <div className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <h3>Inventory Report</h3>
              <span className={styles.cardIcon}>📦</span>
            </div>
            <div className={styles.cardContent}>
              <p>Stock levels and product availability</p>
              <button className={styles.cardButton}>View Details</button>
            </div>
          </div>

          <div className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <h3>Category Report</h3>
              <span className={styles.cardIcon}>🏷️</span>
            </div>
            <div className={styles.cardContent}>
              <p>Category performance analysis</p>
              <button className={styles.cardButton}>View Details</button>
            </div>
          </div>

          <div className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <h3>User Activity</h3>
              <span className={styles.cardIcon}>👥</span>
            </div>
            <div className={styles.cardContent}>
              <p>User engagement and activity logs</p>
              <button className={styles.cardButton}>View Details</button>
            </div>
          </div>
        </div>
        
        <div className={styles.quickStats}>
          <h2>Quick Statistics</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>₹ 125,430</div>
              <div className={styles.statLabel}>Total Sales</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>1,234</div>
              <div className={styles.statLabel}>Products</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>56</div>
              <div className={styles.statLabel}>Categories</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>12</div>
              <div className={styles.statLabel}>Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}