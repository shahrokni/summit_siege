import type { IInputManager, IPublisher, ISubscriber } from "../../scene";

export type TEvent = "scope" | "fire" | "left" | "right";

export class InputManager implements IInputManager, IPublisher<TEvent> {
  constructor() {
    window.addEventListener("keydown", this.handleKeyPress);
    window.addEventListener("click", this.handleClick);
    window.addEventListener("contextmenu", this.handleRightClick);
  }

  private subscribers: Array<ISubscriber<TEvent>> = [];

  private handleKeyPress(event: KeyboardEvent): void {
    const { key } = event;
    switch (key.toLowerCase()) {
      case "a":
        this.subscribers.forEach((s) => s.notify("left"));
        break;
      case "d":
        this.subscribers.forEach((s) => s.notify("right"));
    }
  }

  private handleClick(): void {
    this.subscribers.forEach((s) => s.notify("fire"));
  }

  private handleRightClick(): void {
    this.subscribers.forEach((s) => s.notify("scope"));
  }

  public subscribe(subscriber: ISubscriber<TEvent>): void {
    const idx = this.subscribers.findIndex((s) => s.id === subscriber.id);
    if (idx !== -1) return;
    this.subscribers.push(subscriber);
  }

  public unsubscribe(id: string): void {
    const idx = this.subscribers.findIndex((s) => s.id === id);
    if (idx === -1) return;
    this.subscribers.splice(idx, 1);
  }

  public dispose(): void {
    window.removeEventListener("keydown", this.handleKeyPress);
    window.removeEventListener("click", this.handleClick);
    window.removeEventListener("scope", this.handleRightClick);
  }
}
