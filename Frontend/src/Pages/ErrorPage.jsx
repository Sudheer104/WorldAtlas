import React from 'react';
import { NavLink, useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.subheading}>Oops! Something went wrong.</p>
      {error && <p style={styles.errorMessage}>{error.statusText || error.message}</p>}
      <NavLink to="/layout/home" style={styles.link}>
        <button style={styles.button}>Go Home</button>
      </NavLink>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e2f',
    color: '#ffffff',
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '10px',
  },
  subheading: {
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  errorMessage: {
    color: '#ff6b6b',
    fontSize: '1.2rem',
    marginBottom: '30px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#4caf50',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  link: {
    textDecoration: 'none',
  }
};

export default ErrorPage;
