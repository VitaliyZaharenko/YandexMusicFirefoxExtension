import { PlayerClientInterface } from "../player/player_interface";
import { PlayerCapability } from "../player/capabilities";
import { BaseViewInterface } from "../common/console_view"
import { ActivePlayerManagerInterface } from "../players/active_player_manager";


export { Command, CommandDispatcherInterface, BackgroundScriptCommandDispatcher }


interface Command {
    name: string
}

interface CommandDispatcherInterface {
    dispatch(command: Command)
}


class BackgroundScriptCommandDispatcher implements CommandDispatcherInterface {

    constructor(
        private view: BaseViewInterface,
        private playerManager: ActivePlayerManagerInterface,
        public onRunNativeAppCommand)
    {
        this.registerCommands()
    }

    private registerCommands(){
        browser.commands.onCommand.addListener((command) => {
            this.dispatch({name: command} as Command)
        })
    }


    dispatch(command: Command) {
        switch (command.name){
            case 'prev-track-command':
                this.playerManager.active.provide(PlayerCapability.PreviousTrack)
                break;
            case 'next-track-command':
                this.playerManager.active.provide(PlayerCapability.NextTrack)
                break;
            case 'play-pause-command':
                this.playerManager.active.provide(PlayerCapability.TogglePlaying)
                break;
            case 'run-native-app-command':
                this.onRunNativeAppCommand()
                break;
            default:
                this.view.showError("Unknown command: " + command.name)
                break;
        }
    }
}