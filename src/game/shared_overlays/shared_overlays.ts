import type { GameCLI, IRecord } from "../cli/cli";

const COLORS = {
  info: "#76FF8A",
  command: "#E5E7EB",
  warning: "#FBBF24",
  error: "#F17171",
};

export class TerminalOverlay {
  constructor(cli: GameCLI, destroy: () => void) {
    this.cli = cli;
    this.overlay = this.buildOverlay();
    this.destroy = destroy;
  }

  private cli: GameCLI;
  private overlay: HTMLDivElement;
  private input: string = "";
  private screenElement?: HTMLDivElement;
  private inputElement?: HTMLInputElement;
  private destroy: () => void;

  private handleKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    const { key } = event;
    if (key === "Enter") {
      switch (this.input) {
        case "quit":
        case "exit":
          setTimeout(() => {
            this.destroy();
          }, 0);
          return;
        default:
          break;
      }

      const history = this.cli.execCommand(this.input);
      const topRecord = history[history.length - 1];
      const [req, res] = this.createRecord(topRecord);
      if (req) this.screenElement?.appendChild(req);
      if (res) this.screenElement?.appendChild(res);

      this.input = "";
      if (this.inputElement) {
        this.inputElement.value = "";
      }
      return;
    }

    switch (key) {
      case "Backspace":
        this.input = this.input.substring(0, this.input.length - 1);
        break;
      default:
        if (key.length !== 1) {
          return;
        }
        this.input += key;
        break;
    }
    if (this.inputElement) {
      this.inputElement.value = this.input;
    }
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement("div");
    container.style.fontFamily = '"GameTerminal",monospace';
    container.style.width = "60%";
    container.style.height = "60%";
    container.style.padding = "4px";
    container.style.opacity = "0.6";
    container.style.position = "absolute";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.backgroundColor = "#000000";
    container.style.left = "0";
    container.style.right = "0";
    container.style.top = "25%";
    container.style.marginInline = "auto";
    return container;
  }

  private createScreen(): HTMLDivElement {
    const screen = document.createElement("div");
    screen.style.width = "100%";
    screen.style.height = "90%";
    screen.style.display = "flex";
    screen.style.flexDirection = "column";

    return screen;
  }

  private createRecord(record: IRecord): Array<HTMLDivElement | undefined> {
    const recordElement = document.createElement("div");
    recordElement.style.width = "100%";
    recordElement.style.height = "fir-content";
    recordElement.style.padding = "4px";
    const { type, text, status, response } = record;
    let recordColor: string;
    let responseColor: string;
    if (type === "info") {
      recordColor = COLORS.info;
    } else {
      recordColor = COLORS.command;
    }

    if (status === "executed") {
      responseColor = COLORS.command;
    } else {
      responseColor = COLORS.error;
    }

    const responseElement = response
      ? document.createElement("div")
      : undefined;

    if (responseElement && response) {
      responseElement.style.color = responseColor;
      responseElement.style.padding = "4px";
      responseElement.innerText = response.text;
    }

    recordElement.style.color = recordColor;
    const recordText = `${type === "request" ? "$" : ""} ${text}`;
    recordElement.innerText = recordText;

    return [recordElement, responseElement];
  }

  private createInput(): HTMLInputElement {
    const textArea = document.createElement("input");
    textArea.id = "terminal-input";
    textArea.type = "text";
    textArea.style.fontFamily = "inherit";
    textArea.style.backgroundColor = "#000000";
    textArea.style.color = COLORS.command;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.height = "10%";

    return textArea;
  }

  private buildOverlay(): HTMLDivElement {
    const container = this.createContainer();
    const screen = this.createScreen();
    this.screenElement = screen;

    const history = this.cli.getHistory();
    for (let i = 0; i < history.length; i += 1) {
      const record = history[i];
      const recordElements = this.createRecord(record);
      recordElements.forEach((e) => {
        if (e) screen.appendChild(e);
      });
    }
    const textArea = this.createInput();
    this.inputElement = textArea;
    container.appendChild(screen);
    container.appendChild(textArea);
    textArea.addEventListener("keydown", this.handleKeyDown.bind(this));
    return container;
  }

  public getOverlay(): HTMLDivElement {
    return this.overlay;
  }
}
