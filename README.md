# Website Monitor for Windsurf

An AI-powered website monitoring extension for Windsurf that tracks changes in websites and provides intelligent analysis of modifications.

## Features

- 🔍 Monitor multiple websites simultaneously
- 🤖 AI-powered change analysis to detect meaningful updates
- ⚡ Real-time monitoring with configurable intervals
- 🎯 Optional CSS selector support for monitoring specific elements
- 💡 Smart change highlighting in preview
- 🔔 Customizable notifications

## Usage

1. Add websites to monitor using:
   - Command Palette: `Website Monitor: Add Website to Monitor`
   - AI Command: "monitor website changes"

2. Start monitoring:
   - Command Palette: `Website Monitor: Start Monitoring`

3. Stop monitoring:
   - Command Palette: `Website Monitor: Stop Monitoring`

## Extension Settings

This extension contributes the following settings:

* `websiteMonitor.websites`: List of websites to monitor
* `websiteMonitor.aiAnalysis`: Enable/disable AI-powered change analysis
* `websiteMonitor.changeHighlighting`: Enable/disable change highlighting in preview
* `websiteMonitor.notifications`: Enable/disable change notifications

## Requirements

- Windsurf ^1.0.0

## Release Notes

### 0.0.1

Initial release of Website Monitor for Windsurf:
- Basic website monitoring functionality
- AI-powered change analysis
- Configuration options
- Status bar integration
