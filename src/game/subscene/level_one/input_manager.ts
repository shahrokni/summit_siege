import {
  KeyboardInfo,
  PointerEventTypes,
  type Observer,
  type PointerInfo,
  type Scene,
} from '@babylonjs/core';
import type { IInputManager, IPublisher, ISubscriber } from '../../scene';

export type TEvent = 'right_click' | 'left_click' | 'terminal_activated';

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

    this.keyboardObserver = this.scene.onKeyboardObservable.add((keyboardInfo) => {
      const event = keyboardInfo.event;
      if (event.code === 'ControlLeft') {
        this.handleBackquotePressed();
      }
    });
  }

  private subscribers: Array<ISubscriber<TEvent>> = [];
  private scene: Scene;
  private pointerObserver: Observer<PointerInfo>;
  private keyboardObserver: Observer<KeyboardInfo>;

  private handleBackquotePressed(): void {
    this.subscribers.forEach((s) => s.notify('terminal_activated'));
  }

  private handleClick(): void {
    this.subscribers?.forEach((s) => s.notify('left_click'));
  }

  private handleRightClick(): void {
    this.subscribers?.forEach((s) => s.notify('right_click'));
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
    this.scene.onKeyboardObservable.remove(this.keyboardObserver);
  }
}
