import * as vscode from "vscode";
import { WebMonitor } from "./webMonitor";
import { StatusBarManager } from "./statusBar";
import { AIAnalyzer } from "./aiAnalyzer";

let monitor: WebMonitor;
let statusBar: StatusBarManager;
let analyzer: AIAnalyzer;

export function activate(context: vscode.ExtensionContext) {
  console.log("Activating Website Monitor extension...");
  analyzer = new AIAnalyzer();
  monitor = new WebMonitor(analyzer);
  statusBar = new StatusBarManager();

  // register start monitoring command
  let startMonitoring = vscode.commands.registerCommand(
    "website-monitor.startMonitoring",
    () => {
      monitor.start();
      statusBar.setActive();
      vscode.window.showInformationMessage("website monitoring started");
    }
  );

  // register stop monitoring command
  let stopMonitoring = vscode.commands.registerCommand(
    "website-monitor.stopMonitoring",
    () => {
      monitor.stop();
      statusBar.setInactive();
      vscode.window.showInformationMessage("website monitoring stopped");
    }
  );

  // register add website command
  let addWebsite = vscode.commands.registerCommand(
    "website-monitor.addWebsite",
    async () => {
      const url = await vscode.window.showInputBox({
        prompt: "enter website URL to monitor",
        placeHolder: "https://example.com",
        validateInput: (value) => {
          try {
            new URL(value);
            return null;
          } catch {
            return "please enter a valid URL";
          }
        },
      });

      if (url) {
        const selector = await vscode.window.showInputBox({
          prompt: "enter CSS selector to monitor (optional)",
          placeHolder: "#content",
        });

        const interval = await vscode.window.showInputBox({
          prompt: "check interval in minutes",
          value: "5",
          validateInput: (value) => {
            const num = parseInt(value);
            return !num || num < 1
              ? "please enter a number greater than 0"
              : null;
          },
        });

        if (interval) {
          monitor.addWebsite({
            url,
            selector: selector || undefined,
            interval: parseInt(interval),
          });
          vscode.window.showInformationMessage(`now monitoring ${url}`);
        }
      }
    }
  );

  context.subscriptions.push(startMonitoring, stopMonitoring, addWebsite);
}

export function deactivate() {
  monitor?.stop();
  statusBar?.dispose();
}
