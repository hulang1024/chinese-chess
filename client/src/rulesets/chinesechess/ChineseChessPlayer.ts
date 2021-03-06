import RulesetPlayer from "../RulesetPlayer";
import ChineseChessGameRule from "./ChineseChessGameRule";
import ChineseChessUserPlayInput from "./ChineseChessUserPlayInput";
import Settings from './ui/Settings.vue';
import Help from './Help.vue';

export default class ChineseChessPlayer extends RulesetPlayer {
  // eslint-disable-next-line
  public openSettings() {
    this.context.$q.dialog({
      component: Settings,
    }).onOk(({ chessStatus, goDisplay }: { chessStatus: boolean, goDisplay: boolean }) => {
      if (chessStatus) {
        // eslint-disable-next-line
        (this.game as ChineseChessGameRule).chessStatusDisplay.update(this.game.viewChessHost);
      } else {
        (this.game as ChineseChessGameRule).chessStatusDisplay.clear();
      }

      const userPlayInput = this.userPlayInput as ChineseChessUserPlayInput;
      if (userPlayInput.goDisplay) {
        if (goDisplay) {
          if (userPlayInput.lastSelected) {
            userPlayInput.goDisplay.update(userPlayInput.lastSelected);
          }
        } else {
          userPlayInput.goDisplay.clear();
        }
      }
    });
  }

  public openHelp() {
    this.context.$q.dialog({
      component: Help,
    });
  }
}
