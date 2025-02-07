import * as vscode from "vscode";

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.setInactive();
    this.statusBarItem.show();
  }

  public setActive() {
    this.statusBarItem.text = "$(eye) Monitoring";
    this.statusBarItem.tooltip = "website monitoring is active";
    this.statusBarItem.command = "website-monitor.stopMonitoring";
  }

  public setInactive() {
    this.statusBarItem.text = "$(eye-closed) Monitor";
    this.statusBarItem.tooltip = "click to start website monitoring";
    this.statusBarItem.command = "website-monitor.startMonitoring";
  }

  public dispose() {
    this.statusBarItem.dispose();
  }
}
