import * as vscode from "vscode";

export class AIAnalyzer {
  public async analyzeChanges(
    oldContent: string,
    newContent: string
  ): Promise<string> {
    try {
      // use windsurf's AI capabilities to analyze changes
      const analysis = await vscode.commands.executeCommand(
        "windsurf.analyzeChanges",
        {
          before: oldContent,
          after: newContent,
          prompt: "analyze and summarize the following website changes",
        }
      );

      return analysis as string;
    } catch (error) {
      console.error("error analyzing changes:", error);
      return "changes detected (AI analysis failed)";
    }
  }
}
