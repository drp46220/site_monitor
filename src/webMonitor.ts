import { chromium } from "playwright";
import * as vscode from "vscode";
import * as crypto from "crypto";
import { AIAnalyzer } from "./aiAnalyzer";
import * as diff from "diff";

interface Website {
  url: string;
  selector?: string;
  interval: number;
  lastContent?: string;
  lastHash?: string;
}

export class WebMonitor {
  private websites: Website[] = [];
  private intervals: NodeJS.Timeout[] = [];
  private isRunning = false;
  private analyzer: AIAnalyzer;

  constructor(analyzer: AIAnalyzer) {
    this.analyzer = analyzer;
    this.loadWebsites();
  }

  private loadWebsites() {
    const config = vscode.workspace.getConfiguration("websiteMonitor");
    this.websites = config.get("websites") || [];
  }

  private saveWebsites() {
    const config = vscode.workspace.getConfiguration("websiteMonitor");
    config.update("websites", this.websites, true);
  }

  public addWebsite(website: Website) {
    this.websites.push(website);
    this.saveWebsites();
    if (this.isRunning) {
      this.startMonitoringWebsite(website);
    }
  }

  private async checkWebsite(website: Website) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(website.url);

      let content: string;
      if (website.selector) {
        const element = await page.$(website.selector);
        content = (await element?.textContent()) || "";
      } else {
        content = await page.content();
      }

      const currentHash = crypto
        .createHash("md5")
        .update(content)
        .digest("hex");

      if (website.lastHash && website.lastHash !== currentHash) {
        await this.notifyChange(website, website.lastContent || "", content);
      }

      website.lastContent = content;
      website.lastHash = currentHash;
    } catch (error) {
      vscode.window.showErrorMessage(`error checking ${website.url}: ${error}`);
    } finally {
      await browser.close();
    }
  }

  private async notifyChange(
    website: Website,
    oldContent: string,
    newContent: string
  ) {
    const config = vscode.workspace.getConfiguration("websiteMonitor");

    // get AI analysis if enabled
    let analysis = "";
    if (config.get("aiAnalysis")) {
      analysis = await this.analyzer.analyzeChanges(oldContent, newContent);
    }

    // create diff if highlighting is enabled
    let changes = "";
    if (config.get("changeHighlighting")) {
      changes = this.generateDiff(oldContent, newContent);
    }

    if (config.get("notifications")) {
      const message = analysis || "Changes detected";

      vscode.window
        .showInformationMessage(
          `${website.url}: ${message}`,
          "View Changes",
          "View Diff"
        )
        .then((selection) => {
          if (selection === "View Changes") {
            vscode.env.openExternal(vscode.Uri.parse(website.url));
          } else if (selection === "View Diff" && changes) {
            this.showDiff(website.url, changes);
          }
        });
    }
  }

  private generateDiff(oldContent: string, newContent: string): string {
    const differences = diff.diffWords(oldContent, newContent);
    return differences
      .map((part) => {
        if (part.added) {
          return `[+${part.value}]`;
        }
        if (part.removed) {
          return `[-${part.value}]`;
        }
        return part.value;
      })
      .join("");
  }

  private async showDiff(url: string, diffContent: string) {
    const doc = await vscode.workspace.openTextDocument({
      content: diffContent,
      language: "markdown",
    });
    await vscode.window.showTextDocument(doc, { preview: true });
  }

  private startMonitoringWebsite(website: Website) {
    const interval = setInterval(
      () => this.checkWebsite(website),
      website.interval * 60 * 1000
    );
    this.intervals.push(interval);
  }

  public start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.websites.forEach((website) => this.startMonitoringWebsite(website));
    }
  }

  public stop() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals = [];
    this.isRunning = false;
  }
}
