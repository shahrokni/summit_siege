import {
  PointerEventTypes,
  type Observer,
  type PointerInfo,
  type Scene,
} from "@babylonjs/core";
import type { IInputManager, IPublisher, ISubscriber } from "../../scene";

export type TEvent = "scope" | "fire";

export class InputManager implements IInputManager, IPublisher<TEvent> {
  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.preventDefaultOnPointerDown = true;

    this.pointerObserver = this.scene.onPointerObservable.add((pointerInfo) => {
      const event = pointerInfo.event;

      switch (event.button) {
        case 2:
          if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
            this.handleRightClick();
          }
          break;
        case 0:
          if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
            this.handleClick();
          }
          break;
        default:
          break;
      }
    });
  }

  private subscribers: Array<ISubscriber<TEvent>> = [];
  private scene: Scene;
  private pointerObserver: Observer<PointerInfo>;

  private handleClick(): void {
    this.subscribers?.forEach((s) => s.notify("fire"));
  }

  private handleRightClick(): void {
    this.subscribers?.forEach((s) => s.notify("scope"));
  }

  public subscribe(subscriber: ISubscriber<TEvent>): void {
    const idx = this.subscribers?.findIndex((s) => s.id === subscriber.id);
    if (idx !== -1) return;
    this.subscribers?.push(subscriber);
  }

  public unsubscribe(id: string): void {
    const idx = this.subscribers?.findIndex((s) => s.id === id);
    if (idx === -1 || idx === undefined) return;
    this.subscribers?.splice(idx, 1);
  }

  public dispose(): void {
    this.scene.preventDefaultOnPointerDown = false;
    this.scene.onPointerObservable.remove(this.pointerObserver);
  }
}
