package io.github.hulang1024.chinesechessserver.message.client.spectator;

import io.github.hulang1024.chinesechessserver.message.ClientMessage;
import io.github.hulang1024.chinesechessserver.message.client.MessageType;
import lombok.Data;

@Data
@MessageType("spectator.join_watch")
public class JoinWatchMsg extends ClientMessage {
    private long roomId;
}