import { configManager } from "src/boot/main";
import { ConfigItem } from "src/config/ConfigManager";
import ChineseChessDrawableChessboard from "./ChineseChessDrawableChessboard";
import DrawableChess from "./DrawableChess";
import GameAudio from "../../GameAudio";
import ChessPos from "../rule/ChessPos";

function calcSteps(from: ChessPos, to: ChessPos) {
  return Math.max(Math.abs(to.col - from.col), Math.abs(to.row - from.row));
}

export default class ChessMoveAnimation {
  public static make(
    chessboard: ChineseChessDrawableChessboard,
    chess: DrawableChess,
    toPos: ChessPos,
    events: {
      moveEnd?: (() => void) | null,
      dropStart?: (() => void) | null,
      dropEnd: () => void,
    },
    instant = false,
    enableAudio = true,
  ) {
    // todo: 模块化揭棋代码
    // 是否需要翻转棋子
    const flip = !chess.isFront();
    if (flip) {
      chess.drawFront();
    }

    // 移动一个格子的动画时长
    const stepDuration = 40;
    const steps = calcSteps(chess.getPos(), toPos);
    // 总移动动画时长
    const duration = instant ? 0
      : Math.min(stepDuration * 5, Math.max(stepDuration * 3, stepDuration * steps));
    // 翻转动画时长
    const flipDuration = 150 + 50;

    const emited = {
      dropStart: false,
      dropEnd: false,
      moveEnd: false,
    };

    const onComplete = () => {
      if (flip) {
        chess.flipToFront();
      }
      setTimeout(() => {
        if (!emited.dropStart) {
          if (events.dropStart) {
            events.dropStart();
          }
          emited.dropStart = true;
          chessboard.resetChessesZIndex();
          chess.el.classList.remove('overlay');
          if (enableAudio) {
            if (configManager.get(ConfigItem.chinesechessGameplayAudioEnabled)) {
              GameAudio.play('games/chinesechess/default/chess_move');
            }
          }
        }
        setTimeout(() => {
          if (!emited.dropEnd) {
            events.dropEnd();
            emited.dropEnd = true;
          }
        }, 50);
      }, flip ? flipDuration : 0);
      if (!emited.moveEnd) {
        if (events.moveEnd) {
          events.moveEnd();
        }
        emited.moveEnd = true;
      }
    };
    // 额外的setTimeout代码，是解决浏览器后台会暂停动画，导致回调不能及时执行，累积状态错误
    setTimeout(() => {
      onComplete();
    }, duration + 100);

    chess.el.classList.add('overlay');
    chess.el.style.setProperty('--transform-timing-function', 'cubic-bezier(0.22, 0.61, 0.36, 1)');
    chess.el.style.setProperty('--transform-duration', `${duration}ms`);
    const { x, y } = chessboard.calcChessDisplayPos(toPos);
    chess.setDisplayPos(x, y);
    chess.el.ontransitionend = (event: TransitionEvent) => {
      if (event.propertyName == 'transform') {
        chess.el.style.removeProperty('--transform-timing-function');
        chess.el.style.removeProperty('--transform-duration');
        onComplete();
        chess.el.ontransitionend = null;
      }
    };
  }
}
