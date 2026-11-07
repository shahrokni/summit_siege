import type { GameCLI } from '../cli/cli';
import type { IDisposable } from '../scene';
import { TerminalOverlay } from '../shared_overlays/shared_overlays';
import { FULLY_TRANSPARENT_OVERLAY } from './level_one/overlay/sniper_scope';

export interface ILevel extends IDisposable {
  onFinish: () => void;
  run: () => Promise<void>;
}

export class Level {
  protected handleTerminalActivated(overlay: HTMLDivElement, gameCLI?: GameCLI): void {
    if (!gameCLI) return;

    gameCLI.clear();
    gameCLI.print('enter quit to exit');
    const terminal = new TerminalOverlay(gameCLI, () => {
      overlay.replaceChildren(FULLY_TRANSPARENT_OVERLAY);
    });
    const terminalOverlay = terminal.getOverlay();
    overlay.replaceChildren(terminalOverlay);
    const input = overlay.querySelector('input');
    if (input) {
      input.focus();
    }
  }
}
