package io.github.hulang1024.chess.user.ws;

import com.alibaba.fastjson.annotation.JSONField;
import io.github.hulang1024.chess.user.SearchUserInfo;
import io.github.hulang1024.chess.user.User;
import io.github.hulang1024.chess.user.UserStatus;
import io.github.hulang1024.chess.ws.ServerMessage;
import lombok.Data;

@Data
public class UserStatusChangedServerMsg extends ServerMessage {
    private long uid;
    private SearchUserInfo user;
    @JSONField(serialize = false)
    private UserStatus status;

    public UserStatusChangedServerMsg(User user, UserStatus status) {
        super("user.status_changed");
        this.uid = user.getId();
        if (!(user instanceof SearchUserInfo)) {
            user = new SearchUserInfo(user);
        }
        this.user = (SearchUserInfo)user;
        this.user.setStatus(status);
        this.status = status;
    }

    @JSONField(name = "status")
    public int getStatusCode() {
        return status.getCode();
    }
}