"use client";

import { useEffect, useState } from "react";
import styles from "./auth.module.css";

export default function AuthPage() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" },
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Main Content */}
      <article className={styles.article}>
        <h1 className={styles.pageTitle}>Authentication</h1>
        <p className={styles.pageSubtitle}>
          JWT-based authentication with bcrypt password hashing for secure user
          authentication in the Smart Chatbot monorepo.
        </p>

        <section id="overview" className={styles.section}>
          <h2>Overview</h2>
          <p>
            This project uses <strong>JWT (JSON Web Token)</strong> for
            stateless authentication and <strong>bcrypt</strong> for secure
            password hashing.
          </p>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>JWT Authentication</h3>
              <p>
                Stateless token-based authentication with automatic expiration
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Password Hashing</h3>
              <p>Bcrypt with 10 salt rounds for secure password storage</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⏱️</div>
              <h3>Token Expiration</h3>
              <p>Automatic token expiration after 1 hour for security</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3>Passport.js</h3>
              <p>Industry-standard authentication middleware integration</p>
            </div>
          </div>
        </section>

        <section id="quick-start" className={styles.section}>
          <h2>Quick Start</h2>
          <p>
            Get started with authentication in just a few steps. Here&apos;s how
            to implement login functionality in your application.
          </p>

          <h3>Login Request</h3>
          <p>
            Send a POST request to the login endpoint with email and password:
          </p>
          <div className={styles.codeBlock}>
            <pre>
              <code>{`POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}`}</code>
            </pre>
          </div>

          <h3>Success Response</h3>
          <div className={styles.codeBlock}>
            <pre>
              <code>{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id-123",
    "email": "user@example.com"
  }
}`}</code>
            </pre>
          </div>
        </section>

        <section id="frontend-integration" className={styles.section}>
          <h2>Frontend Integration</h2>
          <p>
            Integrate authentication into your frontend application with these
            examples.
          </p>

          <h3>Login Function</h3>
          <div className={styles.codeBlock}>
            <pre>
              <code>{`async function login(email: string, password: string) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const { access_token, user } = await response.json();
  localStorage.setItem('access_token', access_token);
  
  return { access_token, user };
}`}</code>
            </pre>
          </div>

          <h3>React Hook Example</h3>
          <div className={styles.codeBlock}>
            <pre>
              <code>{`import { useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return { user, login, logout, loading };
}`}</code>
            </pre>
          </div>
        </section>

        <section id="backend-implementation" className={styles.section}>
          <h2>Backend Implementation</h2>
          <p>
            The backend uses NestJS with Passport.js for authentication.
            Here&apos;s the core implementation.
          </p>

          <h3>AuthService</h3>
          <div className={styles.codeBlock}>
            <pre>
              <code>{`import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email },
    };
  }
}`}</code>
            </pre>
          </div>
        </section>

        <section id="security" className={styles.section}>
          <h2>Security Best Practices</h2>

          <div className={styles.warningBox}>
            <h3>⚠️ Important Security Considerations</h3>
            <ul>
              <li>
                <strong>HTTPS Only:</strong> Always use HTTPS in production to
                prevent token interception
              </li>
              <li>
                <strong>Strong JWT Secret:</strong> Use a complex, random
                JWT_SECRET (minimum 32 characters)
              </li>
              <li>
                <strong>Token Storage:</strong> Consider httpOnly cookies
                instead of localStorage for better XSS protection
              </li>
              <li>
                <strong>Rate Limiting:</strong> Implement rate limiting on login
                endpoint to prevent brute force attacks
              </li>
              <li>
                <strong>Password Policy:</strong> Enforce strong password
                requirements (minimum length, complexity)
              </li>
              <li>
                <strong>Refresh Tokens:</strong> Implement refresh token
                mechanism for better UX and security
              </li>
            </ul>
          </div>
        </section>

        <section id="troubleshooting" className={styles.section}>
          <h2>Troubleshooting</h2>

          <div className={styles.troubleshootItem}>
            <h4>Error: &quot;Invalid email or password&quot;</h4>
            <ul>
              <li>Verify the email exists in the database</li>
              <li>Ensure password is hashed with bcrypt in database</li>
              <li>Check if JWT_SECRET is configured in .env</li>
            </ul>
          </div>

          <div className={styles.troubleshootItem}>
            <h4>Error: &quot;Unauthorized&quot;</h4>
            <ul>
              <li>Check if token is included in Authorization header</li>
              <li>Verify token format: &quot;Bearer YOUR_TOKEN&quot;</li>
              <li>Token may have expired (default: 1 hour)</li>
            </ul>
          </div>

          <div className={styles.troubleshootItem}>
            <h4>Error: &quot;Cannot find module &apos;bcrypt&apos;&quot;</h4>
            <ul>
              <li>
                Run: <code>pnpm install bcrypt @types/bcrypt</code>
              </li>
              <li>Rebuild the project</li>
            </ul>
          </div>
        </section>
      </article>

      {/* Table of Contents */}
      <aside className={styles.toc}>
        <div className={styles.tocHeader}>On This Page</div>
        <nav className={styles.tocNav}>
          <a
            href="#overview"
            className={
              activeSection === "overview"
                ? styles.tocLinkActive
                : styles.tocLink
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("overview");
            }}
          >
            Overview
          </a>
          <a
            href="#quick-start"
            className={
              activeSection === "quick-start"
                ? styles.tocLinkActive
                : styles.tocLink
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("quick-start");
            }}
          >
            Quick Start
          </a>
          <a
            href="#frontend-integration"
            className={
              activeSection === "frontend-integration"
                ? styles.tocLinkActive
                : styles.tocLink
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("frontend-integration");
            }}
          >
            Frontend Integration
          </a>
          <a
            href="#backend-implementation"
            className={
              activeSection === "backend-implementation"
                ? styles.tocLinkActive
                : styles.tocLink
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("backend-implementation");
            }}
          >
            Backend Implementation
          </a>
          <a
            href="#security"
            className={
              activeSection === "security"
                ? styles.tocLinkActive
                : styles.tocLink
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("security");
            }}
          >
            Security
          </a>
          <a
            href="#troubleshooting"
            className={
              activeSection === "troubleshooting"
                ? styles.tocLinkActive
                : styles.tocLink
            }
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("troubleshooting");
            }}
          >
            Troubleshooting
          </a>
        </nav>
      </aside>
    </div>
  );
}
