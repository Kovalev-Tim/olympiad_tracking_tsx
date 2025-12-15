# Olympiad Tracker

A modern web application for discovering, tracking, and extracting structured data from international academic competitions.

## Overview

Olympiad Tracker automatically scrapes olympiad websites and uses AI-powered extraction to collect:

- Competition name
- All important dates (deadlines, results, ceremonies)
- Entry fees
- Participation requirements
- Organizing institutions
- Rewards and prizes

The system normalizes all data into a clean, structured format that is easy to browse, analyze, or export (to be added in later updates).

---

## Features

### AI-Enhanced Web Scraping
Uses **Playwright** to load olympiad websites in headless mode and **OpenAI** to extract structured fields.

### Global Olympiad Coverage
Designed to track all international olympiads in:
- Mathematics
- Informatics
- Science
- Economics
- Research competitions
- Essay contests

### Built with Next.js App Router
Modern architecture with Server Components, API routes, and fast rendering.

### Clean UI
Minimal and intuitive interface (TailwindCSS).

---

## Tech Stack

| Component       | Technology                       |
|-----------------|----------------------------------|
| Frontend        | Next.js 13/14 App Router         |
| Backend         | Node.js API Routes               |
| Scraping        | Playwright                       |
| AI Extraction   | OpenAI API (GPT-4o or o3 models) |
| CSS             | TailwindCSS                      |
| Hosting         | Vercel                           |

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/olympiad-tracker.git
cd olympiad-tracker
```
### 2. Install dependencies
```bash
npm install
```
### 3. Set up environment variables
 Create a `.env` file and add:
    Your OpenAI api key - either from openai website or github models
    Your Supabase database url and key
    Your Clerk publishable key and secret key
    Admin used_id from Clerk

