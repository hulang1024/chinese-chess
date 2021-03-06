package io.github.hulang1024.chess.games.reversi.ws;

import io.github.hulang1024.chess.games.chess.ChessPos;
import io.github.hulang1024.chess.ws.ServerMessage;
import lombok.Data;

@Data
public class ChessPutServerMsg extends ServerMessage {
    private int chess;
    private ChessPos pos;

    public ChessPutServerMsg() {
        super("play.reversi.chess_put");
    }
}